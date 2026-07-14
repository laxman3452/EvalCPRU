"use client";
import { saveAssessment } from "@/actions/teacher";
import toast from "react-hot-toast";
import { useState } from "react";

export default function AssessmentRow({ index, objective, studentId, teacherId, subjectId, unitId, assignmentId, isReadOnly }: any) {
  const [loading, setLoading] = useState(false);

  async function handleSave(formData: FormData) {
    setLoading(true);
    try {
      await saveAssessment(formData);
      toast.success("Score saved!");
    } catch (e: any) {
      toast.error(e.message || "Failed to save score");
    } finally {
      setLoading(false);
    }
  }

  const defaultRegDate = objective.assessment?.regularAssessment?.date ? new Date(objective.assessment.regularAssessment.date).toISOString().split('T')[0] : "";
  const defaultRegScore = objective.assessment?.regularAssessment?.score || "";
  const defaultAddDate = objective.assessment?.reassessment?.date ? new Date(objective.assessment.reassessment.date).toISOString().split('T')[0] : "";
  const defaultAddScore = objective.assessment?.reassessment?.score || "";
  const defaultRemarks = objective.assessment?.remarks || "";

  return (
    <tr className="print:bg-transparent">
      <td className="border border-black p-2">{index}</td>
      <td className="border border-black p-2 text-left">{objective.topic}</td>
      <td className="border border-black p-2 text-left">{objective.outcome}</td>
      
      <td className="border border-black p-2">
        <input disabled={isReadOnly} form={`form-${objective._id}`} type="date" name="regularDate" defaultValue={defaultRegDate} className="w-full text-center print:appearance-none print:border-none bg-transparent" />
      </td>
      <td className="border border-black p-2">
        <input disabled={isReadOnly} form={`form-${objective._id}`} type="number" min="1" max="4" name="regularScore" defaultValue={defaultRegScore} className="w-12 text-center print:appearance-none print:border-none bg-transparent" />
      </td>
      
      <td className="border border-black p-2">
        <input disabled={isReadOnly} form={`form-${objective._id}`} type="date" name="additionalDate" defaultValue={defaultAddDate} className="w-full text-center print:appearance-none print:border-none bg-transparent" />
      </td>
      <td className="border border-black p-2">
        <input disabled={isReadOnly} form={`form-${objective._id}`} type="number" min="1" max="4" name="additionalScore" defaultValue={defaultAddScore} className="w-12 text-center print:appearance-none print:border-none bg-transparent" />
      </td>
      
      <td className="border border-black p-2">
        <input disabled={isReadOnly} form={`form-${objective._id}`} type="text" name="remarks" defaultValue={defaultRemarks} className="w-full bg-transparent print:appearance-none print:border-none" />
      </td>
      
      {!isReadOnly && (
        <td className="border border-black p-2 print:hidden">
          <form id={`form-${objective._id}`} action={handleSave}>
            <input type="hidden" name="studentId" value={studentId} />
            <input type="hidden" name="teacherId" value={teacherId} />
            <input type="hidden" name="subjectId" value={subjectId} />
            <input type="hidden" name="unitId" value={unitId} />
            <input type="hidden" name="objectiveId" value={objective._id} />
            <input type="hidden" name="assignmentId" value={assignmentId} />
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50">
              {loading ? "..." : "Save"}
            </button>
          </form>
        </td>
      )}
    </tr>
  );
}
