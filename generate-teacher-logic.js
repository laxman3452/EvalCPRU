const fs = require('fs');
const path = require('path');

const files = {
  "src/actions/teacher.ts": `"use server";
import dbConnect from "@/lib/mongoose";
import Unit from "@/models/Unit";
import LearningObjective from "@/models/LearningObjective";
import Assessment from "@/models/Assessment";
import { revalidatePath } from "next/cache";

export async function addUnit(formData: FormData) {
  await dbConnect();
  const name = formData.get("name") as string;
  const subjectId = formData.get("subjectId") as string;
  const assignmentId = formData.get("assignmentId") as string;
  
  if (!name || !subjectId) throw new Error("Missing fields");
  
  await Unit.create({ name, subjectId });
  revalidatePath(\`/teacher/assignments/\${assignmentId}\`);
}

export async function addObjective(formData: FormData) {
  await dbConnect();
  const topic = formData.get("topic") as string;
  const outcome = formData.get("outcome") as string;
  const unitId = formData.get("unitId") as string;
  const assignmentId = formData.get("assignmentId") as string;
  
  if (!topic || !outcome || !unitId) throw new Error("Missing fields");
  
  await LearningObjective.create({ topic, outcome, unitId });
  revalidatePath(\`/teacher/assignments/\${assignmentId}\`);
}

export async function saveAssessment(formData: FormData) {
  await dbConnect();
  const studentId = formData.get("studentId") as string;
  const teacherId = formData.get("teacherId") as string;
  const subjectId = formData.get("subjectId") as string;
  const unitId = formData.get("unitId") as string;
  const objectiveId = formData.get("objectiveId") as string;
  const assignmentId = formData.get("assignmentId") as string;
  
  const regularDateStr = formData.get("regularDate") as string;
  const regularScoreStr = formData.get("regularScore") as string;
  const additionalDateStr = formData.get("additionalDate") as string;
  const additionalScoreStr = formData.get("additionalScore") as string;
  const remarks = formData.get("remarks") as string;

  let updateData: any = { regularAssessment: {}, reassessment: {} };
  
  if (regularDateStr && regularScoreStr) {
    updateData.regularAssessment = { date: new Date(regularDateStr), score: parseInt(regularScoreStr) };
  }
  if (additionalDateStr && additionalScoreStr) {
    updateData.reassessment = { date: new Date(additionalDateStr), score: parseInt(additionalScoreStr) };
  }
  if (remarks !== undefined) {
    updateData.remarks = remarks;
  }

  await Assessment.findOneAndUpdate(
    { studentId, objectiveId },
    { $set: { studentId, teacherId, subjectId, unitId, objectiveId, ...updateData } },
    { upsert: true, new: true }
  );

  revalidatePath(\`/teacher/assignments/\${assignmentId}/students/\${studentId}\`);
}
`,
  "src/app/teacher/assignments/[id]/page.tsx": `import { auth } from "../../../../../auth";
import dbConnect from "@/lib/mongoose";
import TeacherAssignment from "@/models/TeacherAssignment";
import Student from "@/models/Student";
import Unit from "@/models/Unit";
import LearningObjective from "@/models/LearningObjective";
import Link from "next/link";
import { addUnit, addObjective } from "@/actions/teacher";

export default async function AssignmentDashboard({ params }: { params: { id: string } }) {
  await dbConnect();
  const session = await auth();
  
  const assignment = await TeacherAssignment.findById(params.id).populate('classId sectionId subjectId');
  if (!assignment) return <div>Not found</div>;

  const students = await Student.find({ classId: assignment.classId._id, sectionId: assignment.sectionId._id });
  const units = await Unit.find({ subjectId: assignment.subjectId._id });
  
  // Fetch objectives for all units
  const unitsWithObjectives = await Promise.all(units.map(async (unit) => {
    const objectives = await LearningObjective.find({ unitId: unit._id });
    return { ...unit.toObject(), objectives };
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{assignment.classId.name} - {assignment.sectionId.name} | {assignment.subjectId.name}</h1>
        <p className="text-gray-500">Manage syllabus and evaluate students.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Manage Units & Objectives */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Course Syllabus</h2>
          
          <form action={addUnit} className="flex gap-2 mb-6">
            <input type="hidden" name="subjectId" value={assignment.subjectId._id.toString()} />
            <input type="hidden" name="assignmentId" value={params.id} />
            <input type="text" name="name" placeholder="New Unit Name..." required className="flex-1 border rounded px-3 py-2" />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Unit</button>
          </form>

          <div className="space-y-4">
            {unitsWithObjectives.map((unit: any) => (
              <div key={unit._id.toString()} className="border rounded p-4">
                <h3 className="font-bold text-lg mb-2">{unit.name}</h3>
                
                <ul className="mb-4 space-y-2 pl-4 list-disc text-sm">
                  {unit.objectives.map((obj: any) => (
                    <li key={obj._id.toString()}>
                      <span className="font-semibold">{obj.topic}</span>: {obj.outcome}
                    </li>
                  ))}
                </ul>

                <form action={addObjective} className="flex flex-col gap-2 mt-2 border-t pt-2">
                  <input type="hidden" name="unitId" value={unit._id.toString()} />
                  <input type="hidden" name="assignmentId" value={params.id} />
                  <input type="text" name="topic" placeholder="Topic name (e.g. Geometry)" required className="border rounded px-2 py-1 text-sm" />
                  <input type="text" name="outcome" placeholder="Learning Outcome..." required className="border rounded px-2 py-1 text-sm" />
                  <button type="submit" className="bg-gray-100 text-sm px-2 py-1 rounded hover:bg-gray-200 text-left w-max">
                    + Add Objective
                  </button>
                </form>
              </div>
            ))}
            {unitsWithObjectives.length === 0 && <p className="text-gray-500 text-sm">No units added yet.</p>}
          </div>
        </div>

        {/* Student List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Students</h2>
          <div className="space-y-2">
            {students.map((student: any) => (
              <Link 
                href={\`/teacher/assignments/\${params.id}/students/\${student._id}\`} 
                key={student._id.toString()}
                className="block border rounded p-3 hover:border-blue-500 flex justify-between items-center"
              >
                <div>
                  <div className="font-bold">{student.name}</div>
                  <div className="text-xs text-gray-500">Roll No: {student.rollNumber}</div>
                </div>
                <div className="text-blue-600 text-sm font-semibold">
                  Evaluate &rarr;
                </div>
              </Link>
            ))}
            {students.length === 0 && <p className="text-gray-500 text-sm">No students assigned to this class.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created', fullPath);
}
