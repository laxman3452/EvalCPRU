import { auth } from "../../../../../../../auth";
import dbConnect from "@/lib/mongoose";
import Assessment from "@/models/Assessment";
import TeacherAssignment from "@/models/TeacherAssignment";
import Student from "@/models/Student";
import Unit from "@/models/Unit";
import LearningObjective from "@/models/LearningObjective";
import PrintButton from "@/components/PrintButton";
import AssessmentRow from "@/components/AssessmentRow";
import Image from "next/image";
import StudentDashboardTabs from "@/components/StudentDashboardTabs";

export default async function StudentEvaluationPage({ params }: { params: Promise<{ id: string, studentId: string }> }) {
  await dbConnect();
  
  const { id, studentId } = await params;

  const assignment = await TeacherAssignment.findById(id).populate('classId sectionId subjectId teacherId');
  if (!assignment) return <div>Assignment not found</div>;

  const student = await Student.findById(studentId);
  if (!student) return <div>Student not found</div>;

  const units = await Unit.find({ subjectId: assignment.subjectId._id });
  
  // Fetch objectives and assessments
  const unitsData = await Promise.all(units.map(async (unit) => {
    const objectives = await LearningObjective.find({ unitId: unit._id });
    const objectivesWithAssessments = await Promise.all(objectives.map(async (obj) => {
      const assessment = await Assessment.findOne({ studentId: student._id, objectiveId: obj._id });
      return { ...obj.toObject(), assessment: assessment ? assessment.toObject() : null };
    }));
    return { ...unit.toObject(), objectives: objectivesWithAssessments };
  }));

  return (
    <StudentDashboardTabs 
      student={JSON.parse(JSON.stringify(student))}
      assignment={JSON.parse(JSON.stringify(assignment))}
      unitsData={JSON.parse(JSON.stringify(unitsData))}
      id={id}
    />
  );
}
