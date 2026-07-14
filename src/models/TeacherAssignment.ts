import mongoose from "mongoose";

const TeacherAssignmentSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  academicYear: { type: String, default: "2083" },
}, { timestamps: true });

delete (mongoose.models as any).TeacherAssignment;
export default mongoose.model("TeacherAssignment", TeacherAssignmentSchema);
