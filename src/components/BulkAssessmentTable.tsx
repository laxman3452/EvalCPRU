"use client";
import { saveBulkAssessments } from "@/actions/teacher";
import toast from "react-hot-toast";
import { useState } from "react";

export default function BulkAssessmentTable({ studentsData, objectiveId, unitId, subjectId, teacherId, assignmentId }: any) {
  const [loading, setLoading] = useState(false);
  const [assessments, setAssessments] = useState(
    studentsData.map((student: any) => ({
      studentId: student._id.toString(),
      name: student.name,
      rollNumber: student.rollNumber,
      regularDate: student.assessment?.regularAssessment?.date ? new Date(student.assessment.regularAssessment.date).toISOString().split('T')[0] : "",
      regularScore: student.assessment?.regularAssessment?.score || "",
      additionalDate: student.assessment?.reassessment?.date ? new Date(student.assessment.reassessment.date).toISOString().split('T')[0] : "",
      additionalScore: student.assessment?.reassessment?.score || "",
      remarks: student.assessment?.remarks || ""
    }))
  );

  const [bulkRegDate, setBulkRegDate] = useState("");
  const [bulkAddDate, setBulkAddDate] = useState("");

  const handleBulkRegDate = (val: string) => {
    setBulkRegDate(val);
    if (val) setAssessments((prev: any) => prev.map((a: any) => ({ ...a, regularDate: val })));
  };

  const handleBulkAddDate = (val: string) => {
    setBulkAddDate(val);
    if (val) setAssessments((prev: any) => prev.map((a: any) => ({ ...a, additionalDate: val })));
  };

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...assessments];
    updated[index][field] = value;
    setAssessments(updated);
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      const dataToSave = assessments.map((a: any) => ({
        ...a, objectiveId, unitId, subjectId, teacherId, assignmentId
      }));
      await saveBulkAssessments(dataToSave);
      toast.success("All scores saved successfully!");
    } catch (e: any) {
      toast.error(e.message || "Failed to save scores");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

  return (
    <div className="space-y-4">
      {/* Bulk date controls + Save button */}
      <div className="bg-white rounded-xl shadow p-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Bulk Date Setter</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-indigo-700 mb-1">Regular Assessment Date</label>
            <input
              type="date"
              value={bulkRegDate}
              onChange={(e) => handleBulkRegDate(e.target.value)}
              className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <p className="text-xs text-gray-400 mt-1">Sets date for all students instantly</p>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-purple-700 mb-1">Additional Assistance Date</label>
            <input
              type="date"
              value={bulkAddDate}
              onChange={(e) => handleBulkAddDate(e.target.value)}
              className="w-full border border-purple-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <p className="text-xs text-gray-400 mt-1">Sets date for all students instantly</p>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSaveAll}
              disabled={loading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md disabled:opacity-50 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save All Scores
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 p-3 text-gray-700 font-semibold text-sm w-16">Roll</th>
                <th className="border border-gray-200 p-3 text-left text-gray-700 font-semibold text-sm">Student Name</th>
                <th className="border border-gray-200 p-3 text-gray-700 font-semibold text-sm bg-indigo-50" colSpan={2}>Regular Assessment</th>
                <th className="border border-gray-200 p-3 text-gray-700 font-semibold text-sm bg-purple-50" colSpan={2}>Additional Assistance</th>
                <th className="border border-gray-200 p-3 text-gray-700 font-semibold text-sm">Remarks</th>
              </tr>
              <tr className="bg-gray-50 text-xs">
                <th className="border border-gray-200 p-2"></th>
                <th className="border border-gray-200 p-2"></th>
                <th className="border border-gray-200 p-2 text-gray-600 bg-indigo-50 w-32">Date</th>
                <th className="border border-gray-200 p-2 text-gray-600 bg-indigo-50 w-24">Score (1–4)</th>
                <th className="border border-gray-200 p-2 text-gray-600 bg-purple-50 w-32">Date</th>
                <th className="border border-gray-200 p-2 text-gray-600 bg-purple-50 w-24">Score (1–4)</th>
                <th className="border border-gray-200 p-2 text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((student: any, idx: number) => (
                <tr key={student.studentId} className="hover:bg-gray-50 transition-colors">
                  <td className="border border-gray-200 p-2 text-center text-gray-900 font-bold">{student.rollNumber}</td>
                  <td className="border border-gray-200 p-2 font-medium text-gray-900">{student.name}</td>
                  <td className="border border-gray-200 p-1">
                    <input type="date" value={student.regularDate} onChange={(e) => handleChange(idx, 'regularDate', e.target.value)} className={inputCls} />
                  </td>
                  <td className="border border-gray-200 p-1">
                    <input type="number" min="1" max="4" value={student.regularScore} onChange={(e) => handleChange(idx, 'regularScore', e.target.value)} className={inputCls + " text-center font-bold"} />
                  </td>
                  <td className="border border-gray-200 p-1">
                    <input type="date" value={student.additionalDate} onChange={(e) => handleChange(idx, 'additionalDate', e.target.value)} className={inputCls} />
                  </td>
                  <td className="border border-gray-200 p-1">
                    <input type="number" min="1" max="4" value={student.additionalScore} onChange={(e) => handleChange(idx, 'additionalScore', e.target.value)} className={inputCls + " text-center font-bold"} />
                  </td>
                  <td className="border border-gray-200 p-1">
                    <input type="text" value={student.remarks} onChange={(e) => handleChange(idx, 'remarks', e.target.value)} className={inputCls} placeholder="Remarks..." />
                  </td>
                </tr>
              ))}
              {assessments.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">No students found in this class.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {assessments.map((student: any, idx: number) => (
          <div key={student.studentId} className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                {student.rollNumber}
              </div>
              <div>
                <p className="font-bold text-gray-900">{student.name}</p>
                <p className="text-xs text-gray-400">Roll No: {student.rollNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-indigo-50 rounded-lg p-2">
                <label className="block text-xs font-bold text-indigo-600 mb-1">Regular Date</label>
                <input type="date" value={student.regularDate} onChange={(e) => handleChange(idx, 'regularDate', e.target.value)} className="w-full text-xs border border-indigo-200 rounded px-2 py-1.5 text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400" />
              </div>
              <div className="bg-indigo-50 rounded-lg p-2">
                <label className="block text-xs font-bold text-indigo-600 mb-1">Regular Score</label>
                <input type="number" min="1" max="4" value={student.regularScore} onChange={(e) => handleChange(idx, 'regularScore', e.target.value)} className="w-full text-center text-sm font-bold border border-indigo-200 rounded px-2 py-1.5 text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400" />
              </div>
              <div className="bg-purple-50 rounded-lg p-2">
                <label className="block text-xs font-bold text-purple-600 mb-1">Additional Date</label>
                <input type="date" value={student.additionalDate} onChange={(e) => handleChange(idx, 'additionalDate', e.target.value)} className="w-full text-xs border border-purple-200 rounded px-2 py-1.5 text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-purple-400" />
              </div>
              <div className="bg-purple-50 rounded-lg p-2">
                <label className="block text-xs font-bold text-purple-600 mb-1">Additional Score</label>
                <input type="number" min="1" max="4" value={student.additionalScore} onChange={(e) => handleChange(idx, 'additionalScore', e.target.value)} className="w-full text-center text-sm font-bold border border-purple-200 rounded px-2 py-1.5 text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-purple-400" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Remarks</label>
              <input type="text" value={student.remarks} onChange={(e) => handleChange(idx, 'remarks', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400" placeholder="Add remarks..." />
            </div>
          </div>
        ))}
        {assessments.length === 0 && (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">No students found in this class.</div>
        )}
      </div>
    </div>
  );
}
