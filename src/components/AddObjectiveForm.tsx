"use client";
import { addObjective } from "@/actions/teacher";
import toast from "react-hot-toast";
import { useRef, useState } from "react";

export default function AddObjectiveForm({ unitId, assignmentId }: { unitId: string; assignmentId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    try {
      await addObjective(formData);
      toast.success("Objective added!");
      formRef.current?.reset();
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to add objective");
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg px-3 py-2 border border-dashed border-blue-300 font-medium transition-colors flex items-center justify-center gap-1"
      >
        <span>+</span> Add Objective
      </button>
    );
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-2 mt-2 pt-3 border-t border-gray-200">
      <input type="hidden" name="unitId" value={unitId} />
      <input type="hidden" name="assignmentId" value={assignmentId} />
      <input
        type="text"
        name="topic"
        placeholder="Topic (e.g. Measurement of Angles)"
        required
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        type="text"
        name="outcome"
        placeholder="Learning outcome description..."
        required
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white text-sm px-3 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Save Objective
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
