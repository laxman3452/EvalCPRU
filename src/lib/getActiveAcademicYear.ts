import dbConnect from "@/lib/mongoose";
import Setting from "@/models/Setting";

/**
 * Plain server-side utility to get the active academic year.
 * NOT a server action — can be safely imported anywhere on the server side.
 */
export async function getActiveAcademicYear(): Promise<string> {
  await dbConnect();
  const setting = await Setting.findOne({ key: "active_academic_year" }).lean() as any;
  return setting?.value ?? "2083";
}
