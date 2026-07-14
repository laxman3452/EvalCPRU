const fs = require('fs');
const path = require('path');

const files = {
  "src/actions/admin.ts": `"use server";
import dbConnect from "@/lib/mongoose";
import Teacher from "@/models/Teacher";
import Student from "@/models/Student";
import Class from "@/models/Class";
import Section from "@/models/Section";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

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
  
  await Student.create({ name, rollNumber, classId: cls._id, sectionId: sec._id });
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
`,
  "src/app/admin/teachers/page.tsx": `import dbConnect from "@/lib/mongoose";
import Teacher from "@/models/Teacher";
import Link from "next/link";
import { deleteTeacher } from "@/actions/admin";

export default async function AdminTeachersPage() {
  await dbConnect();
  const teachers = await Teacher.find({}).sort({ createdAt: -1 });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Teachers</h1>
        <Link href="/admin/teachers/new" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          Add Teacher
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.map((teacher: any) => (
              <tr key={teacher._id.toString()}>
                <td className="px-6 py-4 whitespace-nowrap">{teacher.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{teacher.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-4">
                  <form action={async () => {
                    "use server";
                    await deleteTeacher(teacher._id.toString());
                  }}>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {teachers.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  No teachers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`,
  "src/app/admin/students/page.tsx": `import dbConnect from "@/lib/mongoose";
import Student from "@/models/Student";
import Link from "next/link";
import { deleteStudent } from "@/actions/admin";

export default async function AdminStudentsPage() {
  await dbConnect();
  const students = await Student.find({}).populate('classId sectionId').sort({ createdAt: -1 });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Students</h1>
        <Link href="/admin/students/new" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          Add Student
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student: any) => (
              <tr key={student._id.toString()}>
                <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.rollNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.classId?.name} - {student.sectionId?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-4">
                  <form action={async () => {
                    "use server";
                    await deleteStudent(student._id.toString());
                  }}>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`,
  "src/app/admin/teachers/new/page.tsx": `"use client";
import { addTeacher } from "@/actions/admin";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NewTeacherPage() {
  const router = useRouter();
  
  async function handleSubmit(formData: FormData) {
    try {
      await addTeacher(formData);
      toast.success("Teacher added successfully");
      router.push("/admin/teachers");
    } catch (e: any) {
      toast.error(e.message || "Failed to add teacher");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-6">Add New Teacher</h2>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input name="fullName" type="text" required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input name="username" type="text" required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input name="password" type="password" required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          Save Teacher
        </button>
      </form>
    </div>
  );
}
`,
  "src/app/admin/students/new/page.tsx": `"use client";
import { addStudent } from "@/actions/admin";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NewStudentPage() {
  const router = useRouter();
  
  async function handleSubmit(formData: FormData) {
    try {
      await addStudent(formData);
      toast.success("Student added successfully");
      router.push("/admin/students");
    } catch (e: any) {
      toast.error(e.message || "Failed to add student");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-6">Add New Student</h2>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Student Name</label>
          <input name="name" type="text" required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Roll Number</label>
          <input name="rollNumber" type="text" required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Class Name (e.g. 5)</label>
          <input name="className" type="text" required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Section Name (e.g. A)</label>
          <input name="sectionName" type="text" required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          Save Student
        </button>
      </form>
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
