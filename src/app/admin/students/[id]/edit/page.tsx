import dbConnect from "@/lib/mongoose";
import Student from "@/models/Student";
import Class from "@/models/Class";
import Section from "@/models/Section";
import EditStudentForm from "@/components/EditStudentForm";

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  
  const { id } = await params;
  
  const student = await Student.findById(id).populate('classId sectionId').lean();
  if (!student) return <div>Student not found</div>;
  
  const classes = await Class.find({}, 'name').lean();
  const sections = await Section.find({}, 'name').lean();

  const studentDoc = student as any;

  return (
    <EditStudentForm 
      studentId={studentDoc._id.toString()}
      defaultName={studentDoc.name}
      defaultRoll={studentDoc.rollNumber}
      defaultClass={studentDoc.classId?.name || ""}
      defaultSection={studentDoc.sectionId?.name || ""}
      classes={JSON.parse(JSON.stringify(classes))}
      sections={JSON.parse(JSON.stringify(sections))}
    />
  );
}
