import * as yup from "yup";

export const schema = yup.object().shape({
  id: yup.string().optional(),

  username: yup.string().required("El nombre de usuario es obligatorio"),

  email: yup
    .string()
    .email("Email ingresado es invalido")
    .required("Email no puede estar vacio"),

  pass: yup
    .string()
    .required("La clave de acceso es obligatoria")
    .min(6, "Su clave de acceso debe tener al menos 6 caracteres"),
});

export const validators = {
  id: yup.reach(schema, "id"),
  username: yup.reach(schema, "username"),
  email: yup.reach(schema, "email"),
  pass: yup.reach(schema, "pass"),
};
