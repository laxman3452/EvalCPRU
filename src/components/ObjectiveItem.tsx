"use client";
import { useState } from "react";
import { deleteObjective, editObjective } from "@/actions/teacher";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ObjectiveItem({ obj, assignmentId }: { obj: any, assignmentId: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [topic, setTopic] = useState(obj.topic);
  const [outcome, setOutcome] = useState(obj.outcome);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("objectiveId", obj._id);
    formData.append("topic", topic);
    formData.append("outcome", outcome);
    formData.append("assignmentId", assignmentId);
    
    try {
      await editObjective(formData);
      setIsEditing(false);
      toast.success("Objective updated successfully");
    } catch (err) {
      toast.error("Failed to update objective");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this learning objective?")) return;
    setIsDeleting(true);
    try {
      await deleteObjective(obj._id, assignmentId);
      toast.success("Objective deleted successfully");
    } catch (err) {
      toast.error("Failed to delete objective");
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleEdit} className="p-3 rounded-lg bg-blue-50 flex flex-col gap-2">
        <input 
          type="text" 
          value={topic} 
          onChange={(e) => setTopic(e.target.value)} 
          placeholder="Topic (e.g., 1.1 Grammar)"
          className="w-full border rounded px-2 py-1 text-sm font-mukta" 
          required 
        />
        <input 
          type="text" 
          value={outcome} 
          onChange={(e) => setOutcome(e.target.value)} 
          placeholder="Learning Outcome"
          className="w-full border rounded px-2 py-1 text-sm font-mukta" 
          required 
        />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Save</button>
          <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">Cancel</button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors group">
      <Link 
        href={`/teacher/assignments/${assignmentId}/objectives/${obj._id.toString()}`}
        className="flex-1 min-w-0 flex items-start gap-2"
      >
        <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex-1 min-w-0 font-mukta">
          <span className="font-semibold text-blue-900">{obj.topic}</span>
          <span className="text-blue-700">: {obj.outcome}</span>
        </div>
      </Link>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-700 p-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
        </button>
        <button onClick={handleDelete} disabled={isDeleting} className="text-red-400 hover:text-red-600 p-1 disabled:opacity-50">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
      
      <Link 
        href={`/teacher/assignments/${assignmentId}/objectives/${obj._id.toString()}`}
        className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-semibold flex-shrink-0 hover:bg-blue-600 hover:text-white transition-colors"
      >
        Grade All →
      </Link>
    </div>
  );
}
