import mongoose from "mongoose";

const UnitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
}, { timestamps: true });

export default mongoose.models.Unit || mongoose.model("Unit", UnitSchema);
