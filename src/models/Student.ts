import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
  academicYear: { type: String, default: "2083" },
}, { timestamps: true });

delete (mongoose.models as any).Student;
export default mongoose.model("Student", StudentSchema);
