import { auth } from "../../../auth";
import dbConnect from "@/lib/mongoose";
import TeacherAssignment from "@/models/TeacherAssignment";
import Link from "next/link";

import { getActiveAcademicYear } from "@/lib/getActiveAcademicYear";

export default async function TeacherDashboard() {
  const session = await auth();
  await dbConnect();
  
  const activeYear = await getActiveAcademicYear();
  const assignments = await TeacherAssignment.find({ 
    teacherId: session?.user?.id,
    academicYear: activeYear
  }).populate('classId sectionId subjectId');
  const totalClasses = new Set(assignments.map((a: any) => a.classId._id.toString())).size;
  const totalSubjects = new Set(assignments.map((a: any) => a.subjectId._id.toString())).size;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, <span className="font-semibold text-gray-700">{session?.user?.name}</span></p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{totalClasses}</p>
            <p className="text-xs text-gray-500 font-medium">Classes</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{totalSubjects}</p>
            <p className="text-xs text-gray-500 font-medium">Subjects</p>
          </div>
        </div>
      </div>

      {/* Assignments list */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">My Assignments</h2>
        </div>

        {assignments.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <svg className="w-14 h-14 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="font-medium">No assignments yet.</p>
            <p className="text-sm mt-1">Please contact the administrator to get assigned to a class.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {assignments.map((assignment: any) => (
              <div key={assignment._id.toString()} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0 text-green-700 font-bold text-sm">
                    {assignment.classId.name}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">
                      {assignment.subjectId.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Class {assignment.classId.name} — Section {assignment.sectionId?.name || '—'}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/teacher/assignments/${assignment._id.toString()}`}
                  className="ml-3 flex-shrink-0 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-green-700 transition-colors"
                >
                  Manage →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
