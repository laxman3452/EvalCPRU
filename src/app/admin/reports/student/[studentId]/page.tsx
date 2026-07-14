import dbConnect from "@/lib/mongoose";
import TeacherAssignment from "@/models/TeacherAssignment";
import Student from "@/models/Student";
import Unit from "@/models/Unit";
import LearningObjective from "@/models/LearningObjective";
import Assessment from "@/models/Assessment";
import Link from "next/link";
import StudentDashboardTabs from "@/components/StudentDashboardTabs";
import { getActiveAcademicYear } from "@/lib/getActiveAcademicYear";
import SubjectSelector from "./SubjectSelector";

export default async function AdminFullStudentReportPage(props: { params: Promise<{ studentId: string }>, searchParams?: Promise<{ subjectId?: string }> }) {
  await dbConnect();
  const { studentId } = await props.params;
  const searchParams = await props.searchParams;
  const activeYear = await getActiveAcademicYear();

  const student = await Student.findById(studentId).populate('classId sectionId').lean();
  if (!student) return <div className="p-6">Student not found</div>;

  // Find all assignments (subjects) this student is enrolled in
  const assignments = await TeacherAssignment.find({
    classId: student.classId._id,
    sectionId: student.sectionId._id,
    academicYear: activeYear
  }).populate('subjectId teacherId').lean();

  if (assignments.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-gray-500 bg-white rounded-xl shadow mt-6">
        No subjects assigned to this student's class and section yet.
      </div>
    );
  }

  // Determine active assignment
  const activeSubjectId = searchParams?.subjectId || assignments[0].subjectId._id.toString();
  const activeAssignment = assignments.find(a => a.subjectId._id.toString() === activeSubjectId) || assignments[0];

  const units = await Unit.find({ subjectId: activeAssignment.subjectId._id }).lean();

  const unitsWithData = await Promise.all(units.map(async (unit) => {
    const objectives = await LearningObjective.find({ unitId: unit._id }).lean();

    const objectivesWithAssessments = await Promise.all(objectives.map(async (obj) => {
      const assessment = await Assessment.findOne({
        studentId: student._id,
        objectiveId: obj._id
      }).lean();

      return { ...obj, assessment };
    }));

    return { ...unit, objectives: objectivesWithAssessments };
  }));

  const cleanAssignments = JSON.parse(JSON.stringify(assignments));
  const cleanAssignment = JSON.parse(JSON.stringify(activeAssignment));
  const cleanStudent = JSON.parse(JSON.stringify(student));
  const cleanUnitsData = JSON.parse(JSON.stringify(unitsWithData));

  return (
    <div className="max-w-6xl mx-auto space-y-6 print:space-y-0">
      <div className="print:hidden mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link href={`/admin/reports?classId=${student.classId._id}&sectionId=${student.sectionId._id}`} className="text-blue-600 hover:underline text-sm font-semibold flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Students List
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Viewing Subject:</span>
          <SubjectSelector assignments={cleanAssignments} activeSubjectId={cleanAssignment.subjectId._id.toString()} studentId={student._id.toString()} />
        </div>
      </div>

      <StudentDashboardTabs
        student={cleanStudent}
        assignment={cleanAssignment}
        unitsData={cleanUnitsData}
        isReadOnly={true}
        id={cleanAssignment._id.toString()}
      />
    </div>
  );
}
