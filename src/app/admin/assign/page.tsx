import dbConnect from "@/lib/mongoose";
import Teacher from "@/models/Teacher";
import Class from "@/models/Class";
import Section from "@/models/Section";
import Subject from "@/models/Subject";
import TeacherAssignment from "@/models/TeacherAssignment";
import Link from "next/link";
import { deleteAssignment } from "@/actions/assign";
import { getActiveAcademicYear } from "@/lib/getActiveAcademicYear";

export default async function AssignPage() {
  await dbConnect();
  const activeYear = await getActiveAcademicYear();
  const assignments = await TeacherAssignment.find({ academicYear: activeYear })
    .populate('teacherId classId sectionId subjectId')
    .sort({ createdAt: -1 });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Teacher Assignments</h1>
        <Link href="/admin/assign/new" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          New Assignment
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assignments.map((a: any) => (
              <tr key={a._id.toString()}>
                <td className="px-6 py-4 whitespace-nowrap">{a.teacherId?.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{a.classId?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{a.sectionId?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{a.subjectId?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                  <form action={async () => {
                    "use server";
                    await deleteAssignment(a._id.toString());
                  }}>
                    <button className="hover:text-red-900">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {assignments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No assignments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
