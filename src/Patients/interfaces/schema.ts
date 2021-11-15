import * as yup from 'yup';
import moment from 'moment';

export const schema = yup.object().shape({
  id: yup
    .string()
    .optional(),

  email: yup
    .string()
    .email('Email ingresado es invalido')
    .optional(),

  idInsurer: yup
    .string()
    .optional(),

  numsoc: yup
    .string()
    .optional(),

  telefono: yup
    .string()
    .required('Telefono no puede estar vacio'),

  nombre: yup
    .string()
    .matches(/[a-zA-Z]+/, 'Nombre es invalido')
    .required('Nombre no puede estar vacio'),

  apellido: yup
    .string()
    .matches(/[a-zA-Z]+/, 'Apellido es invalido')
    .required('Apellido no puede estar vacio'),

  dni: yup
    .number()
    .required('DNI no puede estar vacio')
    .typeError('DNI debe ser solo numeros')
    .min(1000000, 'DNI es invalido')
    .max(99999999, 'DNI es invalido'),

  fecnac: yup
    .date()
    .required('Fecha de nacimiento no puede estar vacio')
    .typeError('La fecha de nacimiento debe estar en formato DD/MM/YYYY')
    .transform((value, originalValue) => {
      const d = moment(originalValue, 'DD/MM/YYYY');
      if (d.isValid()) {
        return d.toDate();
      }
      return originalValue;
    })
    .min(
      moment('1900-01-01', 'YYYY-MM-DD').toDate(),
      'Fecha de nacimiento no se encuentra en un rango valido'
    )
    .max(
      moment().toDate(),
      'Fecha de nacimiento no se encuentra en un rango valido'
    ),

  historial: yup
    .string()
    .required('La historia clinica no puede estar vacia')
});

export const validators = {
  id: yup.reach(schema, 'id'),
  email: yup.reach(schema, 'email'),
  telefono: yup.reach(schema, 'telefono'),
  nombre: yup.reach(schema, 'nombre'),
  apellido: yup.reach(schema, 'apellido'),
  dni: yup.reach(schema, 'dni'),
  fecnac: yup.reach(schema, 'fecnac'),
  historial: yup.reach(schema, 'historial'),
  idInsurer: yup.reach(schema, 'idInsurer'),
  numsoc: yup.reach(schema, 'numsoc'),
};
