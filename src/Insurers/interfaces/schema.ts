import * as yup from 'yup';

export const schema = yup.object().shape({
  nombre: yup
    .string()
    .required()
    .min(1, 'El nombre de la obra social no puede estar vacio')
});

export const validators = {
  nombre: yup.reach(schema, 'nombre'),
};
