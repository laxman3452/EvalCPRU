import dbConnect from "@/lib/mongoose";
import TeacherAssignment from "@/models/TeacherAssignment";
import Student from "@/models/Student";
import Link from "next/link";

export default async function AdminAssignmentReportsPage({ params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  
  const assignment: any = await TeacherAssignment.findById(id).populate('classId sectionId subjectId teacherId');
  if (!assignment) return <div className="p-6 text-gray-600">Assignment not found.</div>;

  const students = await Student.find({ 
    classId: assignment.classId._id, 
    sectionId: assignment.sectionId._id,
    academicYear: assignment.academicYear
  }).sort({ rollNumber: 1 });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/admin/reports" className="text-blue-600 hover:underline text-sm mb-2 inline-block">
            ← Back to Classes
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Reports: Class {assignment.classId.name} — Section {assignment.sectionId.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Subject: {assignment.subjectId.name} | Teacher: {assignment.teacherId.fullName}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Students ({students.length})
        </h2>
        
        <div className="space-y-2">
          {students.map((student: any) => (
            <Link 
              href={`/admin/reports/${id}/students/${student._id}`} 
              key={student._id.toString()}
              className="flex justify-between items-center p-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center text-gray-600 group-hover:text-blue-700 font-bold text-sm transition-colors">
                  {student.rollNumber}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{student.name}</div>
                  <div className="text-xs text-gray-400">Roll No: {student.rollNumber}</div>
                </div>
              </div>
              <span className="text-xs bg-gray-100 group-hover:bg-blue-600 group-hover:text-white text-gray-600 px-3 py-1.5 rounded-full font-semibold transition-colors">
                View Analytics & Print →
              </span>
            </Link>
          ))}
          {students.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No students enrolled in this class yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
