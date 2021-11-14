import { Crud } from '../../shared/firebase';
import { Patient } from '../interfaces';

// TODO to be removed
type MedicExam = {
  idPatient: string
};

export class PatientsService {

  public static async getAllAsItems(): Promise<Patient[]> {
    return await Crud.getAllAsItems<Patient>('patients');
  }

  public static async existsDni(dni: string): Promise<boolean> {
    const items = await Crud.getAllBy<Patient>('patients', ['dni', dni])
    return items.length !== 0;
  }

  public static async create(formData: Patient): Promise<boolean> {
    const existsDni = await PatientsService.existsDni(formData.dni);
    if (!existsDni) {
      await Crud.create('patients', formData);
      return true;
    }
    return false;
  }

  public static async update(patientId: string, formData: Patient): Promise<boolean> {
    const doc = await Crud.getAsDoc('patients', patientId);
    await Crud.update(doc, formData);
    return true;
  }

  public static async getAsItem(patientId: string): Promise<Patient> {
    return await Crud.getAsItem<Patient>('patients', patientId);
  }

  public static async remove(patientId: string): Promise<boolean> {
    const items = await Crud.getAllBy<MedicExam>('medicExams', ['idPatient', patientId]);
    if (items.length !== 0) {
      return false;
    }
    const doc = await Crud.getAsDoc('patients', patientId);
    await Crud.delete(doc);
    return true;
  }

}
