export type Tutor = {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  email: string;
};

export const emptyTutor: Tutor = {
  id: "",
  email: "",
  telefono: "",
  nombre: "",
  apellido: "",
  direccion: "",
};
