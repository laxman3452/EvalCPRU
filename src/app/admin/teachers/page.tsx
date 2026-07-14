import dbConnect from "@/lib/mongoose";
import Teacher from "@/models/Teacher";
import Link from "next/link";
import { deleteTeacher } from "@/actions/admin";
import ResetPasswordButton from "@/components/ResetPasswordButton";
import SearchInput from "@/components/SearchInput";

export default async function AdminTeachersPage(props: { searchParams?: Promise<{ q?: string }> }) {
  await dbConnect();
  
  const searchParams = await props.searchParams;
  const q = searchParams?.q || "";

  const teachers = await Teacher.find({}).sort({ createdAt: -1 }).lean();

  const teacherData = teachers.map((t: any) => ({
    _id: t._id.toString(),
    fullName: t.fullName,
    username: t.username,
  }));

  const filtered = teacherData.filter(teacher => 
    Object.values(teacher).some(val => 
      String(val ?? "").toLowerCase().includes(q.toLowerCase())
    )
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Teachers</h1>
          <p className="text-sm text-gray-500 mt-0.5">{teacherData.length} teacher(s) total</p>
        </div>
        <Link href="/admin/teachers/new" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl shadow hover:bg-blue-700 font-semibold transition-colors self-start sm:self-auto">
          + Add Teacher
        </Link>
      </div>

      <SearchInput placeholder="Search teachers by name or username..." />

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filtered.map((teacher: any) => (
              <tr key={teacher._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4 text-gray-900 font-medium">{teacher.fullName}</td>
                <td className="px-5 py-4 text-gray-600">{teacher.username}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-3 items-center">
                    <ResetPasswordButton id={teacher._id} />
                    <form action={async () => { "use server"; await deleteTeacher(teacher._id); }}>
                      <button className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {q ? `No results for "${q}"` : "No teachers found."}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {filtered.map((teacher: any) => (
          <div key={teacher._id} className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-bold text-gray-900 text-lg">{teacher.fullName}</p>
                <p className="text-sm text-gray-500">@{teacher.username}</p>
              </div>
            </div>
            <div className="flex gap-3 pt-3 border-t border-gray-100">
              <ResetPasswordButton id={teacher._id} />
              <form action={async () => { "use server"; await deleteTeacher(teacher._id); }}>
                <button className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors">Delete</button>
              </form>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
            {q ? `No results for "${q}"` : "No teachers found."}
          </div>
        )}
      </div>

      {q && (
        <p className="mt-3 text-xs text-gray-500">
          Showing <strong>{filtered.length}</strong> of <strong>{teacherData.length}</strong> records
        </p>
      )}
    </div>
  );
}
