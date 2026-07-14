import { auth } from "../../../../../auth";
import dbConnect from "@/lib/mongoose";
import TeacherAssignment from "@/models/TeacherAssignment";
import Student from "@/models/Student";
import Unit from "@/models/Unit";
import LearningObjective from "@/models/LearningObjective";
import Link from "next/link";
import AddUnitForm from "@/components/AddUnitForm";
import AddObjectiveForm from "@/components/AddObjectiveForm";

import UnitItem from "@/components/UnitItem";
import ObjectiveItem from "@/components/ObjectiveItem";

export default async function AssignmentDashboard({ params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const session = await auth();
  const { id } = await params;
  
  const assignment: any = await TeacherAssignment.findById(id).populate('classId sectionId subjectId');
  if (!assignment) return <div className="p-6 text-gray-600">Assignment not found.</div>;

  const students = await Student.find({ 
    classId: assignment.classId._id, 
    sectionId: assignment.sectionId._id,
    academicYear: assignment.academicYear
  }).sort({ rollNumber: 1 });
  const units = await Unit.find({ subjectId: assignment.subjectId._id });
  
  const unitsWithObjectives = await Promise.all(units.map(async (unit) => {
    const objectives = await LearningObjective.find({ unitId: unit._id });
    return { ...unit.toObject(), objectives };
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-mukta">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Class {assignment.classId.name} — Section {assignment.sectionId.name}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Subject: <span className="font-semibold text-gray-700">{assignment.subjectId.name}</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Syllabus */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Course Syllabus
          </h2>
          
          <AddUnitForm subjectId={assignment.subjectId._id.toString()} assignmentId={id} />

          <div className="space-y-4 mt-4">
            {unitsWithObjectives.map((unit: any) => (
              <UnitItem key={unit._id.toString()} unit={unit} assignmentId={id}>
                <ul className="mb-4 space-y-2 text-sm mt-3">
                  {unit.objectives.map((obj: any) => (
                    <li key={obj._id.toString()}>
                      <ObjectiveItem obj={obj} assignmentId={id} />
                    </li>
                  ))}
                  {unit.objectives.length === 0 && (
                    <li className="text-gray-400 text-xs pl-2">No objectives yet — add one below.</li>
                  )}
                </ul>

                <AddObjectiveForm unitId={unit._id.toString()} assignmentId={id} />
              </UnitItem>
            ))}
            {unitsWithObjectives.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                No units added yet. Use the form above to add your first unit.
              </div>
            )}
          </div>
        </div>

        {/* Student List */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Students
            <span className="ml-auto text-sm font-normal text-gray-500">{students.length} enrolled</span>
          </h2>
          <div className="space-y-2">
            {students.map((student: any) => (
              <Link 
                href={`/teacher/assignments/${id}/students/${student._id}`} 
                key={student._id.toString()}
                className="flex justify-between items-center p-3 rounded-xl border border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 group-hover:bg-green-100 flex items-center justify-center text-gray-600 group-hover:text-green-700 font-bold text-sm transition-colors">
                    {student.rollNumber}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{student.name}</div>
                    <div className="text-xs text-gray-400">Roll No: {student.rollNumber}</div>
                  </div>
                </div>
                <span className="text-xs bg-gray-100 group-hover:bg-green-600 group-hover:text-white text-gray-600 px-2.5 py-1 rounded-full font-semibold transition-colors">
                  Evaluate →
                </span>
              </Link>
            ))}
            {students.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                No students in this class yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
