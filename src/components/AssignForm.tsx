"use client";
import { addAssignment } from "@/actions/assign";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AssignForm({ teachers, classes, sections, subjects }: { teachers: any[], classes: any[], sections: any[], subjects: any[] }) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    try {
      await addAssignment(formData);
      toast.success("Assigned successfully");
      router.push("/admin/assign");
    } catch (e: any) {
      toast.error(e.message || "Failed to assign");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-6">Assign Teacher</h2>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Teacher</label>
          <select name="teacherUsername" required className="mt-1 block w-full px-3 py-2 border rounded-md">
            <option value="">Select a Teacher</option>
            {teachers.map(t => (
              <option key={t.username} value={t.username}>{t.fullName} ({t.username})</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Class Name</label>
          <input name="className" type="text" list="classesList" required className="mt-1 block w-full px-3 py-2 border rounded-md" placeholder="e.g. 5" />
          <datalist id="classesList">
            {classes.map(c => <option key={c._id} value={c.name} />)}
          </datalist>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Section Name</label>
          <input name="sectionName" type="text" list="sectionsList" required className="mt-1 block w-full px-3 py-2 border rounded-md" placeholder="e.g. A" />
          <datalist id="sectionsList">
            {sections.map(s => <option key={s._id} value={s.name} />)}
          </datalist>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Subject Name</label>
          <input name="subjectName" type="text" list="subjectsList" required className="mt-1 block w-full px-3 py-2 border rounded-md" placeholder="e.g. Mathematics" />
          <datalist id="subjectsList">
            {subjects.map(s => <option key={s._id} value={s.name} />)}
          </datalist>
        </div>
        
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          Save Assignment
        </button>
      </form>
    </div>
  );
}
