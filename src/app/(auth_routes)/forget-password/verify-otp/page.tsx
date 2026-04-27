"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { forgetPassword, verifyOtp } from "../action";
import toast from "react-hot-toast";

const VerifyOtp = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };
  useEffect(() => {
    const otpRequested = sessionStorage.getItem("otpRequested");
    const storedEmail = sessionStorage.getItem("reset-email");

    if (!otpRequested || !storedEmail) {
      router.push("/forget-password");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email not found. Please restart the password reset flow.");
      return;
    }

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    try {
      setIsVerifying(true);
      const res = await verifyOtp(email, otpValue);
      if (res.redirectUrl) {
        const segments = res.redirectUrl.split("/");
        //extracting token response that is provided via backend url: redirectUrl:""
        const token = segments[segments.length - 1];

        toast.success("OTP successfully verified.");
        // removing the extracted email
        sessionStorage.removeItem("otpRequested");
        sessionStorage.removeItem("reset-email");
        router.push(`/update-password/${token}`);
      }
    } catch (err: any) {
      setError("Invalid or expired OTP");
    } finally {
      setIsVerifying(false);
    }
  };
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;

    setOtp(pasted.split(""));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const resendCode = async () => {
    if (!email) return;
    try {
      setIsSending(true);
      const res = await forgetPassword(email);
      if (res.success) {
        setOtp(Array(6).fill(""));
        setError("");
      }
      toast.success("OTP successfully sent.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-sm border border-border px-6 py-8 rounded-lg bg-white space-y-4">
        <h1 className="text-2xl font-bold text-center">Verify OTP</h1>
        <p className="text-sm text-center text-black/50">
          Enter the 6-digit code sent to your {email}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onPaste={handlePaste}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-10 h-12 text-center text-lg rounded-md border ${
                  error ? "border-red-500" : "border-border"
                } focus:outline-none focus:ring-2 focus:ring-[#1BAE70]`}
              />
            ))}
          </div>

          {error && <p className="text-xs text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full bg-[#1BAE70] text-white py-2 rounded-3xl disabled:opacity-50"
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <button
          type="button"
          className="text-xs text-center w-full text-secondary hover:underline cursor-pointer"
          onClick={resendCode}
          disabled={isVerifying}
        >
          {isSending ? "Sending" : "Resend OTP"}
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
