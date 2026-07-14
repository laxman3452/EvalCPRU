const fs = require('fs');
const path = require('path');

const files = {
  "src/app/admin/assign/page.tsx": `import dbConnect from "@/lib/mongoose";
import Teacher from "@/models/Teacher";
import Class from "@/models/Class";
import Section from "@/models/Section";
import Subject from "@/models/Subject";
import TeacherAssignment from "@/models/TeacherAssignment";
import Link from "next/link";
import { deleteAssignment } from "@/actions/assign";

export default async function AssignPage() {
  await dbConnect();
  const assignments = await TeacherAssignment.find({})
    .populate('teacherId classId sectionId subjectId')
    .sort({ createdAt: -1 });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Teacher Assignments</h1>
        <Link href="/admin/assign/new" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          New Assignment
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assignments.map((a: any) => (
              <tr key={a._id.toString()}>
                <td className="px-6 py-4 whitespace-nowrap">{a.teacherId?.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{a.classId?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{a.sectionId?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{a.subjectId?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                  <form action={async () => {
                    "use server";
                    await deleteAssignment(a._id.toString());
                  }}>
                    <button className="hover:text-red-900">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {assignments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No assignments found.
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
  "src/app/admin/assign/new/page.tsx": `"use client";
import { addAssignment } from "@/actions/assign";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NewAssignmentPage() {
  const router = useRouter();
  
  async function handleSubmit(formData: FormData) {
    try {
      await addAssignment(formData);
      toast.success("Assigned successfully");
      router.push("/admin/assign");
    } catch (e: any) {
      toast.error(e.message || "Failed to assign");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-6">Assign Teacher</h2>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Teacher Username</label>
          <input name="teacherUsername" type="text" required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Class Name (e.g. 5)</label>
          <input name="className" type="text" required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Section Name (e.g. A)</label>
          <input name="sectionName" type="text" required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Subject Name</label>
          <input name="subjectName" type="text" required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          Save Assignment
        </button>
      </form>
    </div>
  );
}
`,
  "src/actions/assign.ts": `"use server";
import dbConnect from "@/lib/mongoose";
import Teacher from "@/models/Teacher";
import Class from "@/models/Class";
import Section from "@/models/Section";
import Subject from "@/models/Subject";
import TeacherAssignment from "@/models/TeacherAssignment";
import { revalidatePath } from "next/cache";

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
  
  await TeacherAssignment.create({
    teacherId: teacher._id,
    classId: cls._id,
    sectionId: sec._id,
    subjectId: sub._id
  });
  
  revalidatePath("/admin/assign");
}

export async function deleteAssignment(id: string) {
  await dbConnect();
  await TeacherAssignment.findByIdAndDelete(id);
  revalidatePath("/admin/assign");
}
`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created', fullPath);
}

// Update Admin Layout sidebar
const layoutPath = path.join(__dirname, "src/app/admin/layout.tsx");
let layoutStr = fs.readFileSync(layoutPath, "utf8");
layoutStr = layoutStr.replace(
  '<Link href="/admin/students" className="block px-4 py-2 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-600">Students</Link>',
  '<Link href="/admin/students" className="block px-4 py-2 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-600">Students</Link>\\n          <Link href="/admin/assign" className="block px-4 py-2 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-600">Assignments</Link>'
);
fs.writeFileSync(layoutPath, layoutStr);
