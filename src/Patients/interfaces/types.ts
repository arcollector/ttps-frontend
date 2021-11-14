export type Patient = {
  id: string,
  idInsurer: string,
  numsoc: string,
  email: string,
  telefono: string,
  nombre: string,
  apellido: string,
  dni: string,
  fecnac: string,
  historial: string,
};

export const emptyPatient: Patient = {
  id: '',
  idInsurer: '',
  numsoc: '',
  email: '',
  telefono: '',
  nombre: '',
  apellido: '',
  dni: '',
  fecnac: '',
  historial: '',
};
