"use client";
import { addTeacher } from "@/actions/admin";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NewTeacherPage() {
  const router = useRouter();
  
  async function handleSubmit(formData: FormData) {
    try {
      await addTeacher(formData);
      toast.success("Teacher added successfully");
      router.push("/admin/teachers");
    } catch (e: any) {
      toast.error(e.message || "Failed to add teacher");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-6">Add New Teacher</h2>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input name="fullName" type="text" required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input name="username" type="text" required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input name="password" type="password" required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          Save Teacher
        </button>
      </form>
    </div>
  );
}
