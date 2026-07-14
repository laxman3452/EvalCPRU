import dbConnect from "@/lib/mongoose";
import Teacher from "@/models/Teacher";
import Class from "@/models/Class";
import Section from "@/models/Section";
import Subject from "@/models/Subject";
import AssignForm from "@/components/AssignForm";

export default async function NewAssignmentPage() {
  await dbConnect();
  
  const teachers = await Teacher.find({}, 'username fullName').lean();
  const classes = await Class.find({}, 'name').lean();
  const sections = await Section.find({}, 'name').lean();
  const subjects = await Subject.find({}, 'name').lean();

  return (
    <AssignForm 
      teachers={JSON.parse(JSON.stringify(teachers))}
      classes={JSON.parse(JSON.stringify(classes))}
      sections={JSON.parse(JSON.stringify(sections))}
      subjects={JSON.parse(JSON.stringify(subjects))}
    />
  );
}
