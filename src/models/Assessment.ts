import mongoose from "mongoose";

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
