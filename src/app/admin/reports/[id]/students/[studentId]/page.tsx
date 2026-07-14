import dbConnect from "@/lib/mongoose";
import TeacherAssignment from "@/models/TeacherAssignment";
import Student from "@/models/Student";
import Unit from "@/models/Unit";
import LearningObjective from "@/models/LearningObjective";
import Assessment from "@/models/Assessment";
import Link from "next/link";
import StudentDashboardTabs from "@/components/StudentDashboardTabs";

export default async function AdminStudentReportPage({ params }: { params: Promise<{ id: string, studentId: string }> }) {
  await dbConnect();
  const { id, studentId } = await params;
  
  const assignment = await TeacherAssignment.findById(id).populate('classId sectionId subjectId teacherId').lean();
  const student = await Student.findById(studentId).lean();
  
  if (!assignment || !student) return <div className="p-6">Not found</div>;

  const units = await Unit.find({ subjectId: assignment.subjectId._id }).lean();
  
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

  // Clean data for client components
  const cleanAssignment = JSON.parse(JSON.stringify(assignment));
  const cleanStudent = JSON.parse(JSON.stringify(student));
  const cleanUnitsData = JSON.parse(JSON.stringify(unitsWithData));

  return (
    <div className="max-w-6xl mx-auto space-y-6 print:space-y-0">
      <div className="print:hidden mb-4">
        <Link href={`/admin/reports/${id}`} className="text-blue-600 hover:underline text-sm font-semibold flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Class List
        </Link>
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
