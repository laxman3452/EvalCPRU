"use client";
import { addUnit } from "@/actions/teacher";
import toast from "react-hot-toast";

export default function AddUnitForm({ subjectId, assignmentId }: { subjectId: string; assignmentId: string }) {
  async function handleSubmit(formData: FormData) {
    try {
      await addUnit(formData);
      toast.success("Unit added!");
    } catch (e: any) {
      toast.error(e.message || "Failed to add unit");
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-4">
      <input type="hidden" name="subjectId" value={subjectId} />
      <input type="hidden" name="assignmentId" value={assignmentId} />
      <input
        type="text"
        name="name"
        placeholder="New unit name..."
        required
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
      >
        + Add Unit
      </button>
    </form>
  );
}
