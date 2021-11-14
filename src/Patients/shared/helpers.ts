import { Patient } from '../interfaces'
import { Insurer } from '../../Insurers'

export function getPatientInsurerName(patient: Patient | null, insurers: Insurer[]) {
  if (patient && insurers.length > 0) {
    const insurer = insurers.find((insurer) => insurer.id === patient.idInsurer);
    if (insurer) {
      return insurer.nombre;
    }
  }
  return '';
}
