"use server";
import dbConnect from "@/lib/mongoose";
import Teacher from "@/models/Teacher";
import Class from "@/models/Class";
import Section from "@/models/Section";
import Subject from "@/models/Subject";
import TeacherAssignment from "@/models/TeacherAssignment";
import { revalidatePath } from "next/cache";

import { getActiveAcademicYear } from "@/lib/getActiveAcademicYear";

export async function addAssignment(formData: FormData) {
  await dbConnect();
  const teacherUsername = formData.get("teacherUsername") as string;
  const className = formData.get("className") as string;
  const sectionName = formData.get("sectionName") as string;
  const subjectName = formData.get("subjectName") as string;
  
  if (!teacherUsername || !className || !sectionName || !subjectName) throw new Error("Missing fields");
  
  const teacher = await Teacher.findOne({ username: teacherUsername });
  if (!teacher) throw new Error("Teacher not found");
  
  let cls = await Class.findOne({ name: className });
  if (!cls) cls = await Class.create({ name: className });
  
  let sec = await Section.findOne({ name: sectionName, classId: cls._id });
  if (!sec) sec = await Section.create({ name: sectionName, classId: cls._id });
  
  let sub = await Subject.findOne({ name: subjectName, classId: cls._id });
  if (!sub) sub = await Subject.create({ name: subjectName, classId: cls._id });
  
  const activeYear = (await getActiveAcademicYear()) || "2083";
  
  await TeacherAssignment.create({
    teacherId: teacher._id,
    classId: cls._id,
    sectionId: sec._id,
    subjectId: sub._id,
    academicYear: activeYear
  });
  
  revalidatePath("/admin/assign");
}

export async function deleteAssignment(id: string) {
  await dbConnect();
  await TeacherAssignment.findByIdAndDelete(id);
  revalidatePath("/admin/assign");
}
