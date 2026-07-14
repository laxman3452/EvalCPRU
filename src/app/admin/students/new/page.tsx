"use client";
import { addStudent } from "@/actions/admin";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NewStudentPage() {
  const router = useRouter();
  
  async function handleSubmit(formData: FormData) {
    try {
      await addStudent(formData);
      toast.success("Student added successfully");
      router.push("/admin/students");
    } catch (e: any) {
      toast.error(e.message || "Failed to add student");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-6">Add New Student</h2>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Student Name</label>
          <input name="name" type="text" required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Roll Number</label>
          <input name="rollNumber" type="text" required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Class Name (e.g. 5)</label>
          <input name="className" type="text" required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Section Name (e.g. A)</label>
          <input name="sectionName" type="text" required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          Save Student
        </button>
      </form>
    </div>
  );
}
