import dbConnect from "@/lib/mongoose";
import Student from "@/models/Student";
import Link from "next/link";
import { deleteStudent } from "@/actions/admin";
import SearchInput from "@/components/SearchInput";
import { getActiveAcademicYear } from "@/lib/getActiveAcademicYear";

export default async function AdminStudentsPage(props: { searchParams?: Promise<{ q?: string }> }) {
  await dbConnect();
  
  const searchParams = await props.searchParams;
  const q = searchParams?.q || "";
  const activeYear = await getActiveAcademicYear();

  const students = await Student.find({ academicYear: activeYear }).populate("classId sectionId").sort({ createdAt: -1 }).lean();

  const studentData = students.map((s: any) => ({
    _id: s._id.toString(),
    name: s.name,
    rollNumber: s.rollNumber,
    className: s.classId?.name || "—",
    sectionName: s.sectionId?.name || "—",
  }));

  const filtered = studentData.filter(student => 
    Object.values(student).some(val => 
      String(val ?? "").toLowerCase().includes(q.toLowerCase())
    )
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Students</h1>
          <p className="text-sm text-gray-500 mt-0.5">{studentData.length} student(s) total</p>
        </div>
        <Link href="/admin/students/new" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl shadow hover:bg-blue-700 font-semibold transition-colors self-start sm:self-auto">
          + Add Student
        </Link>
      </div>

      <SearchInput placeholder="Search students by name, roll no, or class..." />

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Roll No</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Section</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filtered.map((student: any) => (
              <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4 text-gray-900 font-medium">{student.name}</td>
                <td className="px-5 py-4 text-gray-600">{student.rollNumber}</td>
                <td className="px-5 py-4 text-gray-600">{student.className}</td>
                <td className="px-5 py-4 text-gray-600">{student.sectionName}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-3 items-center">
                    <Link href={`/admin/students/${student._id}/edit`} className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">Edit</Link>
                    <form action={async () => { "use server"; await deleteStudent(student._id); }}>
                      <button className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {q ? `No results for "${q}"` : "No students found."}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {filtered.map((student: any) => (
          <div key={student._id} className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-start mb-1">
              <p className="font-bold text-gray-900 text-lg">{student.name}</p>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Roll {student.rollNumber}</span>
            </div>
            <p className="text-sm text-gray-500 mb-3">Class {student.className} — Section {student.sectionName}</p>
            <div className="flex gap-3 pt-3 border-t border-gray-100">
              <Link href={`/admin/students/${student._id}/edit`} className="text-blue-600 hover:text-blue-800 font-semibold text-sm">Edit</Link>
              <form action={async () => { "use server"; await deleteStudent(student._id); }}>
                <button className="text-red-500 hover:text-red-700 font-semibold text-sm">Delete</button>
              </form>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
            {q ? `No results for "${q}"` : "No students found."}
          </div>
        )}
      </div>
      
      {q && (
        <p className="mt-3 text-xs text-gray-500">
          Showing <strong>{filtered.length}</strong> of <strong>{studentData.length}</strong> records
        </p>
      )}
    </div>
  );
}
