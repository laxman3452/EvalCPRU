"use server";
import dbConnect from "@/lib/mongoose";
import Teacher from "@/models/Teacher";
import Student from "@/models/Student";
import Class from "@/models/Class";
import Section from "@/models/Section";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { getActiveAcademicYear } from "@/lib/getActiveAcademicYear";

export async function addTeacher(formData: FormData) {
  await dbConnect();
  const fullName = formData.get("fullName") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  
  if (!fullName || !username || !password) throw new Error("Missing fields");
  
  const existing = await Teacher.findOne({ username });
  if (existing) throw new Error("Username already exists");
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  await Teacher.create({ fullName, username, password: hashedPassword });
  revalidatePath("/admin/teachers");
}

export async function addStudent(formData: FormData) {
  await dbConnect();
  const name = formData.get("name") as string;
  const rollNumber = formData.get("rollNumber") as string;
  const className = formData.get("className") as string;
  const sectionName = formData.get("sectionName") as string;
  
  if (!name || !rollNumber || !className || !sectionName) throw new Error("Missing fields");
  
  // Find or create class
  let cls = await Class.findOne({ name: className });
  if (!cls) cls = await Class.create({ name: className });
  
  // Find or create section
  let sec = await Section.findOne({ name: sectionName, classId: cls._id });
  if (!sec) sec = await Section.create({ name: sectionName, classId: cls._id });
  
  const activeYear = (await getActiveAcademicYear()) || "2083";
  
  await Student.create({ 
    name, 
    rollNumber, 
    classId: cls._id, 
    sectionId: sec._id, 
    academicYear: activeYear 
  });
  revalidatePath("/admin/students");
}

export async function deleteTeacher(id: string) {
  await dbConnect();
  await Teacher.findByIdAndDelete(id);
  revalidatePath("/admin/teachers");
}

export async function deleteStudent(id: string) {
  await dbConnect();
  await Student.findByIdAndDelete(id);
  revalidatePath("/admin/students");
}

export async function editStudent(id: string, formData: FormData) {
  await dbConnect();
  const name = formData.get("name") as string;
  const rollNumber = formData.get("rollNumber") as string;
  const className = formData.get("className") as string;
  const sectionName = formData.get("sectionName") as string;
  
  if (!name || !rollNumber || !className || !sectionName) throw new Error("Missing fields");
  
  let cls = await Class.findOne({ name: className });
  if (!cls) cls = await Class.create({ name: className });
  
  let sec = await Section.findOne({ name: sectionName, classId: cls._id });
  if (!sec) sec = await Section.create({ name: sectionName, classId: cls._id });
  
  await Student.findByIdAndUpdate(id, { name, rollNumber, classId: cls._id, sectionId: sec._id });
  revalidatePath("/admin/students");
}

export async function resetTeacherPassword(id: string) {
  await dbConnect();
  const hashedPassword = await bcrypt.hash("password123", 10);
  await Teacher.findByIdAndUpdate(id, { password: hashedPassword });
  revalidatePath("/admin/teachers");
}
