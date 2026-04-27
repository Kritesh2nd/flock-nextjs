"use client";

import { useState } from "react";
import { MdClose } from "react-icons/md";
import { getAllUser } from "./notification"; // adjust path if needed
import { useEffect } from "react";
import toast from "react-hot-toast";
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
type UserOption = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};
interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    payload: {
      title: string;
      message: string;
      recipientUserIds: number[];
    },
    targets: {
      hatcheryMembers: boolean;
      executives: boolean;
      moderators: boolean;
    },
  ) => Promise<void>;
}

const TARGET_ROLES = [
  { label: "Moderators", value: "moderator" },
  { label: "Hatchery Members", value: "Hatchery member" },
  { label: "Executives", value: "executives" },
] as const;

const DELIVERY_METHODS = [
  { key: "whatsApp", label: "WhatsApp" },
  { key: "sms", label: "SMS" },
  { key: "email", label: "Email" },
] as const;

const NotificationModal = ({
  isOpen,
  onClose,
  onSubmit,
}: NotificationModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    target: [] as Array<"moderator" | "Hatchery member" | "executives">,
  });
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await getAllUser();

        let usersArray: any[] = [];

        // ✅ Handle ALL possible backend shapes
        if (Array.isArray(response)) {
          usersArray = response;
        } else if (Array.isArray(response?.users)) {
          usersArray = response.users;
        } else if (Array.isArray(response?.data?.users)) {
          usersArray = response.data.users;
        } else if (Array.isArray(response?.data)) {
          usersArray = response.data;
        } else if (Array.isArray(response?.result)) {
          usersArray = response.result;
        }

        // setAllUsers(users);
        const users: User[] = usersArray.map((u) => ({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
        }));

        setAllUsers(users);
      } catch (err) {
        console.error("Failed to fetch users", err);
        setAllUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [isOpen]);

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isUserInputFocused, setIsUserInputFocused] = useState(false);

  const [userInput, setUserInput] = useState("");

  const [deliveryMethods, setDeliveryMethods] = useState({
    whatsApp: false,
    sms: false,
    email: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- USER SEARCH LOGIC ---------------- */
  // const filteredUsers = allUsers
  //     .filter((u) => !selectedUsers.some((s) => s.id === u.id))
  //     .filter((u) => {
  //         const search = userInput.toLowerCase();
  //         return (
  //             u.firstName.toLowerCase().includes(search) ||
  //             u.lastName.toLowerCase().includes(search) ||
  //             u.email.toLowerCase().includes(search)
  //         );
  //     });
  const filteredUsers = allUsers
    .filter((u) => !selectedUsers.some((s) => s.id === u.id))
    .filter((u) =>
      `${u.firstName} ${u.lastName} ${u.email}`
        .toLowerCase()
        .includes(userInput.toLowerCase()),
    );

  // const addUser = (user: UserOption) => {
  //     setSelectedUsers((prev) => [...prev, user]);
  //     setUserInput("");
  // };
  //
  // const removeUser = (id: number) => {
  //     setSelectedUsers((prev) => prev.filter((u) => u.id !== id));
  // };
  const addUser = (user: User) => {
    setSelectedUsers((prev) => [...prev, user]);
    setUserInput("");
  };

  const removeUser = (id: number) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== id));
  };
  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!formData.message.trim()) {
      setError("Message is required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      title: formData.title.trim(),
      message: formData.message.trim(),
      recipientUserIds: selectedUsers.map((u) => u.id),
    };

    const targets = {
      hatcheryMembers: formData.target.includes("Hatchery member"),
      executives: formData.target.includes("executives"),
      moderators: formData.target.includes("moderator"),
    };

    try {
      await onSubmit(payload, targets);

      setFormData({
        title: "",
        message: "",
        target: [],
      });

      setDeliveryMethods({ whatsApp: false, sms: false, email: false });
      setSelectedUsers([]);
      setUserInput("");

      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create notification");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-primary/50 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900">
              Create Notification
            </h3>
            <p className="text-sm text-gray-500">
              Send a new system notification
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-gray-400 hover:text-gray-600"
          >
            <MdClose size={28} className="cursor-pointer" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 h-130 2xl:h-160 overflow-y-auto px-1"
        >
          {/* Type */}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              disabled={submitting}
              className="w-full px-4 py-3 bg-white border border-border rounded-xl"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium mb-2">Message *</label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              disabled={submitting}
              className="w-full px-4 py-3 bg-white border border-border rounded-xl resize-none"
            />
          </div>

          {/* Target Role */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Target Role *
            </label>
            <div className="flex gap-6">
              {TARGET_ROLES.map((role) => {
                const isChecked = formData.target.includes(role.value);

                return (
                  <label key={role.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        setFormData((prev) => ({
                          ...prev,
                          target: isChecked
                            ? prev.target.filter((t) => t !== role.value) // remove
                            : [...prev.target, role.value], // add
                        }));
                      }}
                    />
                    {role.label}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Select Users */}
          <div className="border border-gray-300 rounded-xl p-4">
            <label className="block text-sm font-medium mb-2">
              Select Users
            </label>

            <div className="flex flex-wrap gap-2 mb-3">
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center bg-blue-100 px-3 py-1 rounded-full text-sm"
                >
                  <span>
                    {user.firstName} {user.lastName}
                    <span className="ml-1 text-gray-500 text-xs">
                      ({user.email})
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeUser(user.id)}
                    className="ml-1"
                  >
                    <MdClose size={14} />
                  </button>
                </div>
              ))}
            </div>

            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onFocus={() => setIsUserInputFocused(true)}
              onBlur={() => setTimeout(() => setIsUserInputFocused(false), 150)}
              disabled={submitting}
              placeholder="Type name or email to add users..."
              className="w-full px-4 py-2.5 border rounded-lg"
            />

            {isUserInputFocused && filteredUsers.length > 0 && (
              <div className="mt-2 border rounded-lg max-h-40 overflow-y-auto">
                {/*{filteredUsers.map((user) => (*/}
                {/*    <button*/}
                {/*        key={user.id}*/}
                {/*        type="button"*/}
                {/*        onClick={() => addUser(user)}*/}
                {/*        className="w-full text-left px-4 py-2 hover:bg-gray-100"*/}
                {/*    >*/}
                {/*        <div className="text-sm font-medium">*/}
                {/*            {user.firstName} {user.lastName}*/}
                {/*        </div>*/}
                {/*        <div className="text-xs text-gray-500">{user.email}</div>*/}
                {/*    </button>*/}
                {/*))}*/}
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => addUser(user)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    <div className="font-medium">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </button>
                ))}
                {isUserInputFocused && loadingUsers && (
                  <div className="mt-2 p-3 text-sm text-gray-500">
                    Loading users...
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Delivery */}
          <div className="hidden">
            <label className="block text-sm font-medium mb-3">
              Send Notification To:
            </label>
            <div className="flex gap-6">
              {DELIVERY_METHODS.map((method) => (
                <label key={method.key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={deliveryMethods[method.key]}
                    onChange={(e) =>
                      setDeliveryMethods({
                        ...deliveryMethods,
                        [method.key]: e.target.checked,
                      })
                    }
                  />
                  {method.label}
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="form-button-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="form-button-save"
            >
              {submitting ? "Sending..." : "Create Notification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationModal;
