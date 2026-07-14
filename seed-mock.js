require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/school_evaluation";

// Models
const TeacherSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });
const Teacher = mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);

const ClassSchema = new mongoose.Schema({ name: { type: String, required: true } });
const Class = mongoose.models.Class || mongoose.model("Class", ClassSchema);

const SectionSchema = new mongoose.Schema({ name: { type: String, required: true }, classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" } });
const Section = mongoose.models.Section || mongoose.model("Section", SectionSchema);

const SubjectSchema = new mongoose.Schema({ name: { type: String, required: true }, classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" } });
const Subject = mongoose.models.Subject || mongoose.model("Subject", SubjectSchema);

const TeacherAssignmentSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
});
const TeacherAssignment = mongoose.models.TeacherAssignment || mongoose.model("TeacherAssignment", TeacherAssignmentSchema);

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
});
const Student = mongoose.models.Student || mongoose.model("Student", StudentSchema);

const UnitSchema = new mongoose.Schema({ name: { type: String, required: true }, subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" } });
const Unit = mongoose.models.Unit || mongoose.model("Unit", UnitSchema);

const LearningObjectiveSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  outcome: { type: String, required: true },
  unitId: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true },
});
const LearningObjective = mongoose.models.LearningObjective || mongoose.model("LearningObjective", LearningObjectiveSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB for mock data seeding...");

  // Clear existing
  await Promise.all([
    Teacher.deleteMany({}), Class.deleteMany({}), Section.deleteMany({}), 
    Subject.deleteMany({}), TeacherAssignment.deleteMany({}), Student.deleteMany({}), 
    Unit.deleteMany({}), LearningObjective.deleteMany({})
  ]);

  const hashedPassword = await bcrypt.hash("password123", 10);
  
  // 1. Create Teacher
  const teacher = await Teacher.create({ fullName: "Jane Doe", username: "teacher", password: hashedPassword });
  
  // 2. Create Class, Section, Subject
  const cls = await Class.create({ name: "5" });
  const sec = await Section.create({ name: "A", classId: cls._id });
  const sub = await Subject.create({ name: "Mathematics", classId: cls._id });
  
  // 3. Assign Teacher
  const assignment = await TeacherAssignment.create({
    teacherId: teacher._id,
    classId: cls._id,
    sectionId: sec._id,
    subjectId: sub._id,
    academicYear: "2083"
  });

  // 4. Create Students
  await Student.insertMany([
    { name: "Alice Johnson", rollNumber: "1", classId: cls._id, sectionId: sec._id, academicYear: "2083" },
    { name: "Bob Smith", rollNumber: "2", classId: cls._id, sectionId: sec._id, academicYear: "2083" },
    { name: "Charlie Brown", rollNumber: "3", classId: cls._id, sectionId: sec._id, academicYear: "2083" }
  ]);

  // 5. Create Unit and Objectives
  const unit1 = await Unit.create({ name: "Geometry", subjectId: sub._id });
  await LearningObjective.insertMany([
    { topic: "Measurement of Angles", outcome: "Measure and draw angles from 0 to 180 degrees", unitId: unit1._id },
    { topic: "Types of Angles", outcome: "Differentiate acute, right and obtuse angles", unitId: unit1._id }
  ]);

  console.log("✅ Mock Data Seeded Successfully!");
  console.log("-----------------------------------------");
  console.log("Admin Login: admin / admin");
  console.log("Teacher Login: teacher / password123");
  console.log("-----------------------------------------");
  
  mongoose.disconnect();
}

seed();
