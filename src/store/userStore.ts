import { create } from "zustand";
import { UserFormType, UserPropsType } from "@/types";
import {
  deleteUsers,
  getAllHatcheryMember,
  getAllModerators,
  postModeratorsOrHatcheryMember,
  updateHatcheryMembers,
  linkHatchery,
  getUserById,
} from "@/components/UserManagement/action";
import toast from "react-hot-toast";

type Role = "MODERATOR" | "HATCHERY_MEMBER";

type UserStore = {
  moderators: UserPropsType[];
  hatcheryMembers: UserPropsType[];
  isLoading: boolean;

  currentPage: number;
  totalPages: number;
  totalItems: number;
  currentLimit: number;

  modCurrentPage: number;
  modTotalPages: number;
  modTotalItems: number;
  modCurrentLimit: number;

  addUpdateLoading: boolean;

  fetchModerators: (page?: number, limit?: number) => Promise<void>;
  fetchHatcheryMembers: (page?: number, limit?: number) => Promise<void>;

  addOrEditUser: (
    data: UserFormType,
    role: Role,
  ) => Promise<UserPropsType | void>;
  deleteUser: (id: string, role: Role) => Promise<void>;
};

export const useUserStore = create<UserStore>((set, get) => ({
  moderators: [],
  hatcheryMembers: [],
  isLoading: false,

  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  currentLimit: 6,

  modCurrentPage: 1,
  modTotalPages: 1,
  modTotalItems: 0,
  modCurrentLimit: 7,

  addUpdateLoading: false,

  // Fetch moderators
  fetchModerators: async (page = 1, limit = 7) => {
    try {
      set({ isLoading: true });
      const res = await getAllModerators(page, limit);
      const data: UserPropsType[] = res?.data ?? [];
      const meta = res?.metadata ?? {};

      set({
        moderators: data,
        modCurrentPage: meta.currentPage ?? 1,
        modTotalPages: meta.totalPages ?? 1,
        modTotalItems: meta.totalItems ?? 0,
        modCurrentLimit: meta.currentLimit ?? 7,
      });
    } catch (err) {
      console.error("Failed to fetch moderators:", err);
      toast.error("Failed to load moderators");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchHatcheryMembers: async (page = 1, limit = 7) => {
    try {
      set({ isLoading: true });
      const res = await getAllHatcheryMember(page, limit);
      const users: UserPropsType[] = res.users ?? [];
      const meta = res.meta ?? {};

      set({
        hatcheryMembers: users,
        currentPage: meta.page?.toString() ? Number(meta.page) : 1,
        totalPages: meta.totalPages?.toString() ? Number(meta.totalPages) : 1,
        totalItems: meta.total?.toString() ? Number(meta.total) : 0,
        currentLimit: meta.limit?.toString() ? Number(meta.limit) : 7,
      });
    } catch (err) {
      console.error("Failed to fetch hatchery members:", err);
      toast.error("Failed to load hatchery members");
    } finally {
      set({ isLoading: false });
    }
  },

  addOrEditUser: async (data, role) => {
    try {
      const userId = data.id ? Number(data.id) : undefined;
      const hatcheryId = data.hatcheryId ? Number(data.hatcheryId) : undefined;

      if (userId) {
        if (!data.firstName || !data.lastName || !data.email) {
          toast.error(
            "First name, last name, and email are required for updates",
          );
          return;
        }

        const formData = new FormData();
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("email", data.email);
        if (data.phone) formData.append("phone", data.phone);
        data.roles?.forEach((role) => formData.append("roles[]", role));
        formData.append("isExecutive", data.isExecutive ? "true" : "false");
        if (data.designation) formData.append("designation", data.designation);
        if (data.photo instanceof File) {
          formData.append("photo", data.photo);
        }

        set({ addUpdateLoading: true });
        const res = await updateHatcheryMembers(userId, formData);

        const updatedUser: UserPropsType = res.data ?? res;

        if (hatcheryId) {
          await linkHatchery(userId, hatcheryId);
          const freshUser = await getUserById(userId);
          const userToUpdate = freshUser?.data ?? null;

          if (userToUpdate) {
            set((state) => ({
              hatcheryMembers: state.hatcheryMembers.map((u) =>
                Number(u.id) === userId ? userToUpdate : u,
              ),
            }));
          } else {
            console.warn("User not found after linking hatchery:", userId);
          }
        } else {
          set((state) => ({
            hatcheryMembers: state.hatcheryMembers.map((u) =>
              Number(u.id) === userId ? { ...u, ...updatedUser } : u,
            ),
          }));
        }
        const { fetchHatcheryMembers } = get();
        fetchHatcheryMembers();
        set({ addUpdateLoading: false });

        return updatedUser;
      } else {
        const createPayload: UserFormType = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          roles: data.roles || [],
          isExecutive: data.isExecutive ?? false,
          photo: data.photo || null,
          hatcheryId: data.hatcheryId ?? null,
          designation: data.designation ?? "",
        };
        set({ addUpdateLoading: true });
        const res = await postModeratorsOrHatcheryMember(createPayload);
        const newUser: UserPropsType = res.data ?? res;

        set((state) => ({
          moderators:
            role === "MODERATOR"
              ? [...state.moderators, newUser]
              : state.moderators,
          hatcheryMembers:
            role === "HATCHERY_MEMBER"
              ? [...state.hatcheryMembers, newUser]
              : state.hatcheryMembers,
        }));
        const { fetchModerators, fetchHatcheryMembers } = get();
        if (role === "MODERATOR") {
          fetchModerators();
        }
        if (role === "HATCHERY_MEMBER") {
          fetchHatcheryMembers();
        }
        set({ addUpdateLoading: false });
        if (res.status == 201) {
          toast.success("User added successfully");
        }

        if (res.status == 200) {
          toast.success("User updated successfully");
        }

        return newUser;
      }
    } catch (error: any) {
      console.error("Failed to add/edit user:", error.response ?? error);
      toast.error(error.response?.data?.message || "Could not save user");
    }
    const { fetchModerators, fetchHatcheryMembers } = get();
    if (role === "MODERATOR") {
      fetchModerators();
    }
    if (role === "HATCHERY_MEMBER") {
      fetchHatcheryMembers();
    }
  },

  deleteUser: async (id, role) => {
    try {
      await deleteUsers(id);

      set((state) => ({
        moderators:
          role === "MODERATOR"
            ? state.moderators.filter((u) => u.id !== id)
            : state.moderators,
        hatcheryMembers:
          role === "HATCHERY_MEMBER"
            ? state.hatcheryMembers.filter((u) => u.id !== id)
            : state.hatcheryMembers,
      }));
      const { fetchModerators, fetchHatcheryMembers } = get();
      if (role === "MODERATOR") {
        fetchModerators();
      }
      if (role === "HATCHERY_MEMBER") {
        fetchHatcheryMembers();
      }
      toast.success("User deleted successfully");
    } catch (error: any) {
      console.error("Failed to delete user:", error.response ?? error);
      toast.error(error.response?.data?.message || "Could not delete user");
    }
  },
}));
