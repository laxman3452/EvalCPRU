import dbConnect from "@/lib/mongoose";
import Link from "next/link";
import ClassModel from "@/models/Class";
import SectionModel from "@/models/Section";
import Student from "@/models/Student";
import { getActiveAcademicYear } from "@/lib/getActiveAcademicYear";
import FilterDropdowns from "./FilterDropdowns";

export default async function AdminReportsPage(props: { searchParams?: Promise<{ classId?: string, sectionId?: string }> }) {
  await dbConnect();
  const searchParams = await props.searchParams;
  const activeYear = await getActiveAcademicYear();
  
  const classes = await ClassModel.find().sort({ name: 1 }).lean();
  const sections = await SectionModel.find().sort({ name: 1 }).lean();
  
  const classId = searchParams?.classId;
  const sectionId = searchParams?.sectionId;
  
  let students: any[] = [];
  if (classId && sectionId) {
    students = await Student.find({ classId, sectionId, academicYear: activeYear })
      .populate('classId sectionId')
      .sort({ rollNumber: 1 })
      .lean();
  }

  const cleanClasses = JSON.parse(JSON.stringify(classes));
  const cleanSections = JSON.parse(JSON.stringify(sections));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assessment Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Select a class and section to view student reports</p>
        </div>
        
        <FilterDropdowns classes={cleanClasses} sections={cleanSections} defaultClass={classId} defaultSection={sectionId} />
      </div>
      
      {classId && sectionId ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student: any) => (
                <tr key={student._id.toString()} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.rollNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.classId?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.sectionId?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <Link href={`/admin/reports/student/${student._id}`} className="text-blue-600 hover:text-blue-900 font-semibold bg-blue-50 px-3 py-1.5 rounded-full transition-colors inline-block">
                      View Full Report →
                    </Link>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No students found for this class and section.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-12 text-center text-gray-500 border border-gray-100">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Please select both a class and a section from the dropdowns above to view students.
        </div>
      )}
    </div>
  );
}
