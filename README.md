# Estructura de la aplicacion

## Carpeta Navigation

Aca se encuentra las vistas de Guest y Host

  * Guest vista para usuario no autenticado
  * Host vista para usuario autenticado


## Carpeta Appointments

Todo lo relacionado a turnos

## Carpeta MedicalExams

Todo lo relacionado a medical examens

## Caperta Patients

Todo lo relacionado a pacientes

## Carpeta shared

Aqui se guardan todos los archivos utilizados por las otras carpetas
Estos son
  * components: aqui estan los componentes que todas las vistas consumen
  * firefase
  * utils
  * helpers
  * scss

# Cada carpeta es una agrupacion de una entidad

Por ejemplo en Pacientes estan todo lo que hace pacientes, el container de listado de pacientes, el container de creacion de un paciente, etc

# Containers vs components

Un container es una pagina principal, por ejmplo, Listado de pacientes esta en `Patients/containers/Patients.tsx`, por ejemplo, la pantalla de creacion de un paciente esta en `Patients/containers/PatientNeForm.js`

Un componente a diferencia de un container es consumido por unico container y no es compartido por otros containers
