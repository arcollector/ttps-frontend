import { Patient } from '../interfaces'
import { Insurer } from '../../Insurers'

export function getPatientInsurer(patient: Patient | null, insurers: Insurer[]) {
  return patient ? insurers.find((insurer) => insurer.id === patient.idInsurer) : null;
}
