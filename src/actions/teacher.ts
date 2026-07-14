"use server";
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
  revalidatePath(`/teacher/assignments/${assignmentId}`);
}

export async function addObjective(formData: FormData) {
  await dbConnect();
  const topic = formData.get("topic") as string;
  const outcome = formData.get("outcome") as string;
  const unitId = formData.get("unitId") as string;
  const assignmentId = formData.get("assignmentId") as string;
  
  if (!topic || !outcome || !unitId) throw new Error("Missing fields");
  
  await LearningObjective.create({ topic, outcome, unitId });
  revalidatePath(`/teacher/assignments/${assignmentId}`);
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

  revalidatePath(`/teacher/assignments/${assignmentId}/students/${studentId}`);
}

export async function saveBulkAssessments(assessments: any[]) {
  await dbConnect();
  
  const bulkOps = assessments.map(data => {
    let updateData: any = { regularAssessment: {}, reassessment: {} };
    
    if (data.regularDate && data.regularScore) {
      updateData.regularAssessment = { date: new Date(data.regularDate), score: parseInt(data.regularScore) };
    }
    if (data.additionalDate && data.additionalScore) {
      updateData.reassessment = { date: new Date(data.additionalDate), score: parseInt(data.additionalScore) };
    }
    if (data.remarks !== undefined) {
      updateData.remarks = data.remarks;
    }

    return {
      updateOne: {
        filter: { studentId: data.studentId, objectiveId: data.objectiveId },
        update: { $set: { 
          studentId: data.studentId, 
          teacherId: data.teacherId, 
          subjectId: data.subjectId, 
          unitId: data.unitId, 
          objectiveId: data.objectiveId, 
          ...updateData 
        } },
        upsert: true
      }
    };
  });

  if (bulkOps.length > 0) {
    await Assessment.bulkWrite(bulkOps);
  }
  
  if (assessments.length > 0) {
    revalidatePath(`/teacher/assignments/${assessments[0].assignmentId}/objectives/${assessments[0].objectiveId}`);
  }
}

export async function deleteUnit(unitId: string, assignmentId: string) {
  await dbConnect();
  await Unit.findByIdAndDelete(unitId);
  await LearningObjective.deleteMany({ unitId });
  revalidatePath(`/teacher/assignments/${assignmentId}`);
}

export async function editUnit(formData: FormData) {
  await dbConnect();
  const unitId = formData.get("unitId") as string;
  const name = formData.get("name") as string;
  const assignmentId = formData.get("assignmentId") as string;
  if (!unitId || !name) throw new Error("Missing fields");
  await Unit.findByIdAndUpdate(unitId, { name });
  revalidatePath(`/teacher/assignments/${assignmentId}`);
}

export async function deleteObjective(objectiveId: string, assignmentId: string) {
  await dbConnect();
  await LearningObjective.findByIdAndDelete(objectiveId);
  revalidatePath(`/teacher/assignments/${assignmentId}`);
}

export async function editObjective(formData: FormData) {
  await dbConnect();
  const objectiveId = formData.get("objectiveId") as string;
  const topic = formData.get("topic") as string;
  const outcome = formData.get("outcome") as string;
  const assignmentId = formData.get("assignmentId") as string;
  if (!objectiveId || !topic || !outcome) throw new Error("Missing fields");
  await LearningObjective.findByIdAndUpdate(objectiveId, { topic, outcome });
  revalidatePath(`/teacher/assignments/${assignmentId}`);
}
