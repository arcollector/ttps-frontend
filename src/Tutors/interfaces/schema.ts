import * as yup from "yup";

export const schema = yup.object().shape({
  id: yup.string().optional(),

  email: yup
    .string()
    .email("Email tutor ingresado es invalido")
    .required("Email tutor no puede estar vacio"),

  telefono: yup.string().required("Telefono tutor no puede estar vacio"),

  nombre: yup
    .string()
    .matches(/[a-zA-Z]+/, "Nombre tutor es invalido")
    .required("Nombre tutor no puede estar vacio"),

  apellido: yup
    .string()
    .matches(/[a-zA-Z]+/, "Apellido tutor es invalido")
    .required("Apellido tutor no puede estar vacio"),

  direccion: yup.string().required("La direccion tutor no puede estar vacia"),
});

export const validators = {
  id: yup.reach(schema, "id"),
  email: yup.reach(schema, "email"),
  telefono: yup.reach(schema, "telefono"),
  nombre: yup.reach(schema, "nombre"),
  apellido: yup.reach(schema, "apellido"),
  direccion: yup.reach(schema, "direccion"),
};
