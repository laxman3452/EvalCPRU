"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function SubjectSelector({ assignments, activeSubjectId, studentId }: any) {
  const router = useRouter();
  
  return (
    <select 
      value={activeSubjectId} 
      onChange={(e) => {
        router.push(`/admin/reports/student/${studentId}?subjectId=${e.target.value}`);
      }}
      className="border border-gray-300 rounded-lg px-3 py-1.5 bg-white shadow-sm text-sm font-semibold focus:ring-blue-500 focus:border-blue-500"
    >
      {assignments.map((a: any) => (
        <option key={a.subjectId._id.toString()} value={a.subjectId._id.toString()}>
          {a.subjectId.name} ({a.teacherId?.fullName || "No Teacher"})
        </option>
      ))}
    </select>
  );
}
