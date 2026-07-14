const fs = require('fs');
const path = require('path');

const files = {
  "src/app/teacher/assessments/page.tsx": `import { auth } from "../../../../auth";
import dbConnect from "@/lib/mongoose";
import Assessment from "@/models/Assessment";
import TeacherAssignment from "@/models/TeacherAssignment";
import Student from "@/models/Student";
import Unit from "@/models/Unit";
import LearningObjective from "@/models/LearningObjective";
import Image from "next/image";

export default async function AssessmentPrintPage() {
  const session = await auth();
  await dbConnect();

  // Mock data for display purposes
  return (
    <div className="bg-white p-8 max-w-[1000px] mx-auto print:p-0 print:max-w-full">
      <div className="flex items-center justify-between mb-8 border-b-2 border-black pb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-xs print:w-12 print:h-12">
            CP Logo
          </div>
          <div>
            <h1 className="text-2xl font-bold text-blue-900 uppercase tracking-widest print:text-xl">Chaitanya Pathashala Rapti Upatyaka</h1>
            <p className="text-sm font-semibold">Student Evaluation System</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-end mb-4 font-bold text-sm">
        <div>
          <div>Class: 5</div>
          <div>Roll No: 12</div>
        </div>
        <div>
          <div>Subject: Mathematics</div>
        </div>
        <div>
          <div>Student's Name: John Doe</div>
        </div>
      </div>
      
      <div className="mb-2 font-bold text-lg flex items-center gap-2">
        <span className="border border-black px-1 leading-none">+</span> Unit: Geometry
      </div>

      <table className="w-full border-collapse border border-black text-sm text-center mb-8">
        <thead>
          <tr className="bg-gray-100 print:bg-transparent">
            <th className="border border-black p-2 w-12" rowSpan={2}>S.N.</th>
            <th className="border border-black p-2 w-48" rowSpan={2}>Content Topic</th>
            <th className="border border-black p-2 w-48" rowSpan={2}>Learning Achievement / Outcomes</th>
            <th className="border border-black p-2" colSpan={2}>Assessment after Regular Teaching</th>
            <th className="border border-black p-2" colSpan={2}>Assessment after Additional Assistance</th>
            <th className="border border-black p-2 w-32" rowSpan={2}>Remarks</th>
          </tr>
          <tr className="bg-gray-100 print:bg-transparent">
            <th className="border border-black p-2">Date</th>
            <th className="border border-black p-2">Score</th>
            <th className="border border-black p-2">Date</th>
            <th className="border border-black p-2">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black p-2">1</td>
            <td className="border border-black p-2 text-left">Measurement and Construction of Angles</td>
            <td className="border border-black p-2 text-left">Measure and draw angles from 0° to 180° using a protractor.</td>
            <td className="border border-black p-2">12/10</td>
            <td className="border border-black p-2">3</td>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2">Good</td>
          </tr>
          <tr>
            <td className="border border-black p-2">2</td>
            <td className="border border-black p-2 text-left">Types of Angles</td>
            <td className="border border-black p-2 text-left">Differentiate right angle, obtuse angle, and acute angle.</td>
            <td className="border border-black p-2">12/12</td>
            <td className="border border-black p-2">4</td>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2">Excellent</td>
          </tr>
          <tr className="font-bold bg-gray-50 print:bg-transparent text-left">
            <td className="border border-black p-2" colSpan={3}>Subject Area Achievement</td>
            <td className="border border-black p-2" colSpan={5}>
              <div>Total Score of Learning Achievements: 7</div>
              <div>Achievement Percentage = (7 / (4 × 2)) × 100 = 87.5%</div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-between mt-16 font-bold text-sm">
        <div className="flex gap-4">
          <div>Teacher's Signature: ______________________</div>
          <div>Date: ______________________</div>
        </div>
        <div className="flex gap-4">
          <div>Parent's Signature: ______________________</div>
          <div>Date: ______________________</div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end print:hidden">
        <button onClick={() => window.print()} className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700">
          Print Evaluation Sheet
        </button>
      </div>
    </div>
  );
}
`,
  "seed.js": `const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb://localhost:27017/school_evaluation";

const TeacherSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const Teacher = mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const hashedPassword = await bcrypt.hash("password123", 10);
  
  await Teacher.deleteMany({});
  
  await Teacher.create({
    fullName: "John Smith",
    username: "jsmith",
    password: hashedPassword,
  });
  
  console.log("Database seeded successfully");
  mongoose.disconnect();
}

seed();
`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created', fullPath);
}
