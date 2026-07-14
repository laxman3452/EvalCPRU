require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/school_evaluation";

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
