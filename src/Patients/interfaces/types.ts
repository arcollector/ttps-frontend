export type Patient = {
  id: string;
  idInsurer: string;
  numsoc: string;
  email: string;
  telefono: string;
  nombre: string;
  apellido: string;
  dni: string;
  fecnac: string;
  historial: string;
  idTutor: string | null;
};

export const emptyPatient: Patient = {
  id: "",
  idInsurer: "",
  numsoc: "",
  email: "",
  telefono: "",
  nombre: "",
  apellido: "",
  dni: "",
  fecnac: "",
  historial: "",
  idTutor: null,
};
