import { toast } from "react-toastify";

import { TutorsService } from "./services";
import { Tutor, emptyTutor } from "./interfaces";

export const getTutor = async (tutorId: string): Promise<Tutor> => {
  try {
    return await TutorsService.getAsItem(tutorId);
  } catch (error) {
    console.error(error);
    toast.error(`no se pudo obtener los datos del tutor ${tutorId}`);
    return emptyTutor;
  }
};
