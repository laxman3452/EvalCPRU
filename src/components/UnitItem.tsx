"use client";
import { useState } from "react";
import { deleteUnit, editUnit } from "@/actions/teacher";
import toast from "react-hot-toast";

export default function UnitItem({ unit, assignmentId, children }: { unit: any, assignmentId: string, children: React.ReactNode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(unit.name);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("unitId", unit._id);
    formData.append("name", name);
    formData.append("assignmentId", assignmentId);
    
    try {
      await editUnit(formData);
      setIsEditing(false);
      toast.success("Unit updated successfully");
    } catch (err) {
      toast.error("Failed to update unit");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this unit and all its objectives?")) return;
    setIsDeleting(true);
    try {
      await deleteUnit(unit._id, assignmentId);
      toast.success("Unit deleted successfully");
    } catch (err) {
      toast.error("Failed to delete unit");
      setIsDeleting(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        {isEditing ? (
          <form onSubmit={handleEdit} className="flex-1 flex gap-2 mr-2">
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="flex-1 border rounded px-2 py-1 text-sm font-mukta" 
              required 
            />
            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Save</button>
            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">Cancel</button>
          </form>
        ) : (
          <h3 className="font-bold text-gray-900 flex items-center gap-2 font-mukta">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
            {unit.name}
          </h3>
        )}
        
        {!isEditing && (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-blue-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
            <button onClick={handleDelete} disabled={isDeleting} className="text-gray-500 hover:text-red-600 disabled:opacity-50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
