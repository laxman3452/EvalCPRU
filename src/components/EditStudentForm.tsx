"use client";
import { editStudent } from "@/actions/admin";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EditStudentForm({ studentId, defaultName, defaultRoll, defaultClass, defaultSection, classes, sections }: any) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    try {
      await editStudent(studentId, formData);
      toast.success("Student updated successfully");
      router.push("/admin/students");
    } catch (e: any) {
      toast.error(e.message || "Failed to update student");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-6">Edit Student</h2>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Student Name</label>
          <input name="name" type="text" defaultValue={defaultName} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Roll Number</label>
          <input name="rollNumber" type="text" defaultValue={defaultRoll} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Class Name</label>
          <input name="className" type="text" list="classesList" defaultValue={defaultClass} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
          <datalist id="classesList">
            {classes.map((c: any) => <option key={c._id} value={c.name} />)}
          </datalist>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Section Name</label>
          <input name="sectionName" type="text" list="sectionsList" defaultValue={defaultSection} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
          <datalist id="sectionsList">
            {sections.map((s: any) => <option key={s._id} value={s.name} />)}
          </datalist>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          Update Student
        </button>
      </form>
    </div>
  );
}
