import dbConnect from "@/lib/mongoose";
import Assessment from "@/models/Assessment";
import TeacherAssignment from "@/models/TeacherAssignment";
import Student from "@/models/Student";
import LearningObjective from "@/models/LearningObjective";
import Unit from "@/models/Unit";
import BulkAssessmentTable from "@/components/BulkAssessmentTable";
import Link from "next/link";

export default async function AssessObjectivePage({ params }: { params: Promise<{ id: string, objectiveId: string }> }) {
  await dbConnect();
  
  const { id, objectiveId } = await params;

  const assignment = await TeacherAssignment.findById(id).populate('classId sectionId subjectId teacherId');
  if (!assignment) return <div>Assignment not found</div>;

  const objective = await LearningObjective.findById(objectiveId).populate('unitId');
  if (!objective) return <div>Objective not found</div>;

  const students = await Student.find({ 
    classId: assignment.classId._id, 
    sectionId: assignment.sectionId._id,
    academicYear: assignment.academicYear
  }).sort({ rollNumber: 1 });
  
  // Fetch assessments for all students for this objective
  const studentsData = await Promise.all(students.map(async (student) => {
    const assessment = await Assessment.findOne({ studentId: student._id, objectiveId: objective._id });
    return { ...student.toObject(), assessment: assessment ? assessment.toObject() : null };
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6">
        <Link href={`/teacher/assignments/${id}`} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-4 font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Syllabus
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Evaluate Learning Objective</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-indigo-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">Unit</p>
            <p className="text-sm font-bold text-indigo-900 mt-0.5">{objective.unitId.name}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide">Topic</p>
            <p className="text-sm font-bold text-blue-900 mt-0.5">{objective.topic}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-purple-500 uppercase tracking-wide">Outcome</p>
            <p className="text-sm font-bold text-purple-900 mt-0.5">{objective.outcome}</p>
          </div>
        </div>
      </div>

      <BulkAssessmentTable 
        studentsData={JSON.parse(JSON.stringify(studentsData))}
        objectiveId={objectiveId}
        unitId={objective.unitId._id.toString()}
        subjectId={assignment.subjectId._id.toString()}
        teacherId={assignment.teacherId._id.toString()}
        assignmentId={id}
      />
    </div>
  );
}
