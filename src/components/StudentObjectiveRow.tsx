"use client";
import { saveAssessment } from "@/actions/teacher";
import toast from "react-hot-toast";
import { useState } from "react";

export default function StudentObjectiveRow({ student, objectiveId, unitId, subjectId, teacherId, assignmentId }: any) {
  const [loading, setLoading] = useState(false);

  async function handleSave(formData: FormData) {
    setLoading(true);
    try {
      await saveAssessment(formData);
      toast.success("Score saved for " + student.name);
    } catch (e: any) {
      toast.error(e.message || "Failed to save score");
    } finally {
      setLoading(false);
    }
  }

  const defaultRegDate = student.assessment?.regularAssessment?.date ? new Date(student.assessment.regularAssessment.date).toISOString().split('T')[0] : "";
  const defaultRegScore = student.assessment?.regularAssessment?.score || "";
  const defaultAddDate = student.assessment?.reassessment?.date ? new Date(student.assessment.reassessment.date).toISOString().split('T')[0] : "";
  const defaultAddScore = student.assessment?.reassessment?.score || "";
  const defaultRemarks = student.assessment?.remarks || "";

  return (
    <tr className="hover:bg-gray-50">
      <td className="border border-gray-300 p-2 text-center">{student.rollNumber}</td>
      <td className="border border-gray-300 p-2 font-medium">{student.name}</td>
      
      <td className="border border-gray-300 p-1">
        <input form={`form-${student._id}`} type="date" name="regularDate" defaultValue={defaultRegDate} className="w-full px-1 py-1 border rounded text-sm" />
      </td>
      <td className="border border-gray-300 p-1">
        <input form={`form-${student._id}`} type="number" min="1" max="4" name="regularScore" defaultValue={defaultRegScore} className="w-16 text-center px-1 py-1 border rounded text-sm" />
      </td>
      
      <td className="border border-gray-300 p-1">
        <input form={`form-${student._id}`} type="date" name="additionalDate" defaultValue={defaultAddDate} className="w-full px-1 py-1 border rounded text-sm" />
      </td>
      <td className="border border-gray-300 p-1">
        <input form={`form-${student._id}`} type="number" min="1" max="4" name="additionalScore" defaultValue={defaultAddScore} className="w-16 text-center px-1 py-1 border rounded text-sm" />
      </td>
      
      <td className="border border-gray-300 p-1">
        <input form={`form-${student._id}`} type="text" name="remarks" defaultValue={defaultRemarks} className="w-full px-2 py-1 border rounded text-sm" placeholder="Remarks..." />
      </td>
      
      <td className="border border-gray-300 p-2 text-center">
        <form id={`form-${student._id}`} action={handleSave}>
          <input type="hidden" name="studentId" value={student._id} />
          <input type="hidden" name="teacherId" value={teacherId} />
          <input type="hidden" name="subjectId" value={subjectId} />
          <input type="hidden" name="unitId" value={unitId} />
          <input type="hidden" name="objectiveId" value={objectiveId} />
          <input type="hidden" name="assignmentId" value={assignmentId} />
          <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium disabled:opacity-50">
            {loading ? "..." : "Save"}
          </button>
        </form>
      </td>
    </tr>
  );
}
