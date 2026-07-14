import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
}, { timestamps: true });

export default mongoose.models.Subject || mongoose.model("Subject", SubjectSchema);
