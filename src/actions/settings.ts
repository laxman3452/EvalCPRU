"use server";
import Setting from "@/models/Setting";
import dbConnect from "@/lib/mongoose";
import { revalidatePath } from "next/cache";


export async function setActiveAcademicYear(year: string) {
  await dbConnect();
  await Setting.findOneAndUpdate(
    { key: "active_academic_year" },
    { value: year },
    { upsert: true, new: true }
  );
  revalidatePath("/", "layout");
}
