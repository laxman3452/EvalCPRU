"use client";
import { resetTeacherPassword } from "@/actions/admin";
import toast from "react-hot-toast";

export default function ResetPasswordButton({ id }: { id: string }) {
  async function handleReset() {
    if (!confirm("Are you sure you want to reset this teacher's password to 'password123'?")) return;
    try {
      await resetTeacherPassword(id);
      toast.success("Password reset to 'password123'");
    } catch (e: any) {
      toast.error(e.message || "Failed to reset password");
    }
  }

  return (
    <button onClick={handleReset} className="text-blue-600 hover:text-blue-900">
      Reset Password
    </button>
  );
}
