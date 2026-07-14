import dbConnect from "@/lib/mongoose";
import Teacher from "@/models/Teacher";
import Student from "@/models/Student";
import Class from "@/models/Class";
import Subject from "@/models/Subject";
import Link from "next/link";
import { getActiveAcademicYear } from "@/lib/getActiveAcademicYear";
import AcademicYearManager from "@/components/AcademicYearManager";

const cards = [
  { title: "Teachers", href: "/admin/teachers", color: "bg-blue-500", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { title: "Students", href: "/admin/students", color: "bg-green-500", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { title: "Classes", href: "/admin/assign", color: "bg-purple-500", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" },
  { title: "Subjects", href: "/admin/assign", color: "bg-orange-500", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
];

export default async function AdminDashboard() {
  await dbConnect();
  const activeYear = await getActiveAcademicYear();
  const [totalTeachers, totalStudents, totalClasses, totalSubjects] = await Promise.all([
    Teacher.countDocuments(),
    Student.countDocuments({ academicYear: activeYear }),
    Class.countDocuments(),
    Subject.countDocuments()
  ]);
  const values = [totalTeachers, totalStudents, totalClasses, totalSubjects];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">System overview for Academic Year {activeYear}</p>
        </div>
        <div className="bg-blue-100 text-blue-800 text-xs px-3 py-1.5 rounded-full font-bold">
          Year: {activeYear}
        </div>
      </div>

      {/* Stat cards grid — 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <Link key={card.title} href={card.href} className="bg-white rounded-xl shadow p-4 flex flex-col gap-3 hover:shadow-md transition-shadow group">
            <div className={`w-11 h-11 rounded-xl ${card.color} flex items-center justify-center`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{values[i]}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{card.title}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Settings Panel */}
      <AcademicYearManager currentYear={activeYear} />

      {/* Quick actions */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link href="/admin/teachers/new" className="flex items-center gap-3 p-3 rounded-xl border border-blue-100 hover:bg-blue-50 hover:border-blue-300 transition-all group">
            <div className="w-9 h-9 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Add New Teacher</p>
              <p className="text-xs text-gray-400">Create a teacher account</p>
            </div>
          </Link>
          <Link href="/admin/students/new" className="flex items-center gap-3 p-3 rounded-xl border border-green-100 hover:bg-green-50 hover:border-green-300 transition-all group">
            <div className="w-9 h-9 rounded-lg bg-green-100 group-hover:bg-green-200 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Enroll New Student</p>
              <p className="text-xs text-gray-400">Add a student to a class</p>
            </div>
          </Link>
          <Link href="/admin/assign/new" className="flex items-center gap-3 p-3 rounded-xl border border-purple-100 hover:bg-purple-50 hover:border-purple-300 transition-all group">
            <div className="w-9 h-9 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Assign Teacher</p>
              <p className="text-xs text-gray-400">Assign to class & subject</p>
            </div>
          </Link>
          <Link href="/admin/teachers" className="flex items-center gap-3 p-3 rounded-xl border border-orange-100 hover:bg-orange-50 hover:border-orange-300 transition-all group">
            <div className="w-9 h-9 rounded-lg bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Reset Password</p>
              <p className="text-xs text-gray-400">Manage teacher credentials</p>
            </div>
          </Link>
          <Link href="/admin/reports" className="flex items-center gap-3 p-3 rounded-xl border border-blue-100 hover:bg-blue-50 hover:border-blue-300 transition-all group sm:col-span-2">
            <div className="w-9 h-9 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">View Assessment Reports</p>
              <p className="text-xs text-gray-400">Access class analytics and print student records</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
