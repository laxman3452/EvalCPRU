import mongoose from "mongoose";

const LearningObjectiveSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  outcome: { type: String, required: true },
  unitId: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true },
}, { timestamps: true });

export default mongoose.models.LearningObjective || mongoose.model("LearningObjective", LearningObjectiveSchema);
