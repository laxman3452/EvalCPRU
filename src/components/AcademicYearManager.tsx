"use client";
import { useState, useTransition } from "react";
import { setActiveAcademicYear } from "@/actions/settings";
import toast from "react-hot-toast";

export default function AcademicYearManager({ currentYear }: { currentYear: string }) {
  const [year, setYear] = useState(currentYear);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    if (!year.trim()) return toast.error("Year cannot be empty");
    startTransition(async () => {
      try {
        await setActiveAcademicYear(year);
        toast.success("Academic year updated successfully!");
      } catch (e: any) {
        toast.error("Failed to update academic year");
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="text-base font-bold text-gray-900 mb-4">Academic Year Settings</h2>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex-1 w-full relative">
          <input 
            type="text" 
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. 2083"
          />
        </div>
        <button
          onClick={handleUpdate}
          disabled={isPending || year === currentYear}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors w-full sm:w-auto flex-shrink-0"
        >
          {isPending ? "Updating..." : "Update Year"}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        This is the active academic year (currently {currentYear}). Updating this will set the academic year for new student enrollments and teacher assignments.
      </p>
    </div>
  );
}
