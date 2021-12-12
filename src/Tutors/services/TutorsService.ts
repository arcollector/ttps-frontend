import { Crud } from "../../shared/firebase";
import { Tutor } from "../interfaces";

export class TutorsService {
  public static async create(formData: Tutor): Promise<string> {
    return await Crud.create("tutors", formData);
  }

  public static async update(
    tutorId: string,
    formData: Tutor
  ): Promise<boolean> {
    const doc = await Crud.getAsDoc("tutors", tutorId);
    await Crud.update(doc, formData);
    return true;
  }

  public static async remove(tutorId: string): Promise<boolean> {
    const doc = await Crud.getAsDoc("tutors", tutorId);
    await Crud.delete(doc);
    return true;
  }

  public static async getAsItem(tutorId: string): Promise<Tutor> {
    return await Crud.getAsItem<Tutor>("tutors", tutorId);
  }
}
