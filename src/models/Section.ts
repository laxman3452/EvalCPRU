import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "A"
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
}, { timestamps: true });

export default mongoose.models.Section || mongoose.model("Section", SectionSchema);
