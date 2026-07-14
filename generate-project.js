const fs = require('fs');
const path = require('path');

const files = {
  "src/models/Teacher.ts": `import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);
`,
  "src/models/Class.ts": `import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. "5"
}, { timestamps: true });

export default mongoose.models.Class || mongoose.model("Class", ClassSchema);
`,
  "src/models/Section.ts": `import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "A"
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
}, { timestamps: true });

export default mongoose.models.Section || mongoose.model("Section", SectionSchema);
`,
  "src/models/Subject.ts": `import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
}, { timestamps: true });

export default mongoose.models.Subject || mongoose.model("Subject", SubjectSchema);
`,
  "src/models/TeacherAssignment.ts": `import mongoose from "mongoose";

const TeacherAssignmentSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
}, { timestamps: true });

export default mongoose.models.TeacherAssignment || mongoose.model("TeacherAssignment", TeacherAssignmentSchema);
`,
  "src/models/Student.ts": `import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model("Student", StudentSchema);
`,
  "src/models/Unit.ts": `import mongoose from "mongoose";

const UnitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
}, { timestamps: true });

export default mongoose.models.Unit || mongoose.model("Unit", UnitSchema);
`,
  "src/models/LearningObjective.ts": `import mongoose from "mongoose";

const LearningObjectiveSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  outcome: { type: String, required: true },
  unitId: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true },
}, { timestamps: true });

export default mongoose.models.LearningObjective || mongoose.model("LearningObjective", LearningObjectiveSchema);
`,
  "src/models/Assessment.ts": `import mongoose from "mongoose";

const AssessmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  unitId: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true },
  objectiveId: { type: mongoose.Schema.Types.ObjectId, ref: "LearningObjective", required: true },
  regularAssessment: {
    date: { type: Date },
    score: { type: Number, min: 1, max: 4 }
  },
  reassessment: {
    date: { type: Date },
    score: { type: Number, min: 1, max: 4 }
  },
  remarks: { type: String },
}, { timestamps: true });

export default mongoose.models.Assessment || mongoose.model("Assessment", AssessmentSchema);
`,
  "auth.ts": `import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongoose"
import Teacher from "@/models/Teacher"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        
        const username = credentials.username as string;
        const password = credentials.password as string;

        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
          return { id: "admin", name: "Admin", role: "admin" }
        }

        await dbConnect();
        const teacher = await Teacher.findOne({ username });
        if (!teacher) return null;

        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) return null;

        return { id: teacher._id.toString(), name: teacher.fullName, role: "teacher" };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" }
})
`,
  "types/next-auth.d.ts": `import NextAuth from "next-auth";
declare module "next-auth" {
  interface User {
    id: string;
    role: string;
  }
  interface Session {
    user: User & {
      id: string;
      role: string;
    };
  }
}`,
  ".env.example": `MONGODB_URI=mongodb://localhost:27017/school_evaluation
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
AUTH_SECRET=my-secret-key-for-next-auth
`,
  "src/app/api/auth/[...nextauth]/route.ts": `import { handlers } from "../../../../../auth"
export const { GET, POST } = handlers
`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created', fullPath);
}
