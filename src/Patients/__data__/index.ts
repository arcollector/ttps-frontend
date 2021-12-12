import { Patient } from "../interfaces";

export const patient: Patient = {
  id: "123456",
  idInsurer: "ioma",
  email: "test@test.com",
  numsoc: "12345",
  telefono: "11554814",
  nombre: "Jorge",
  apellido: "Lopez",
  dni: "1222333",
  fecnac: "10/10/2010",
  historial: "10/10 Todo mal",
  idTutor: null,
};

export const patientRecentlyCreated: Patient = {
  id: "",
  idInsurer: "ioma",
  email: "test@test.com",
  numsoc: "12345",
  telefono: "11554814",
  nombre: "Jorge",
  apellido: "Lopez",
  dni: "1222333",
  fecnac: "10/10/2010",
  historial: "10/10 Todo mal",
  idTutor: null,
};

export const patients = [patient];
