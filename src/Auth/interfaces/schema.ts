import * as yup from "yup";

export const schema = yup.object().shape({
  id: yup.string().optional(),

  username: yup.string().required("El nombre de usuario es obligatorio"),

  pass: yup
    .string()
    .required("La clave de acceso es obligatoria")
    .min(6, "Su clave de acceso debe tener al menos 6 caracteres"),
});

export const validators = {
  id: yup.reach(schema, "id"),
  username: yup.reach(schema, "username"),
  pass: yup.reach(schema, "pass"),
};
