"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FilterDropdowns({ classes, sections, defaultClass, defaultSection }: any) {
  const router = useRouter();
  const [classId, setClassId] = useState(defaultClass || "");
  const [sectionId, setSectionId] = useState(defaultSection || "");

  const applyFilters = (cId: string, sId: string) => {
    if (cId || sId) {
      const params = new URLSearchParams();
      if (cId) params.set("classId", cId);
      if (sId) params.set("sectionId", sId);
      router.push(`/admin/reports?${params.toString()}`);
    } else {
      router.push(`/admin/reports`);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <select 
        value={classId} 
        onChange={(e) => {
          setClassId(e.target.value);
          applyFilters(e.target.value, sectionId);
        }}
        className="border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select Class...</option>
        {classes.map((c: any) => (
          <option key={c._id.toString()} value={c._id.toString()}>{c.name}</option>
        ))}
      </select>

      <select 
        value={sectionId} 
        onChange={(e) => {
          setSectionId(e.target.value);
          applyFilters(classId, e.target.value);
        }}
        className="border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select Section...</option>
        {sections.map((s: any) => (
          <option key={s._id.toString()} value={s._id.toString()}>{s.name}</option>
        ))}
      </select>
    </div>
  );
}
