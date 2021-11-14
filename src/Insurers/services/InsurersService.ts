import { Crud } from '../../shared/firebase';
import { Insurer } from '../interfaces';
import { Patient } from '../../Patients';

export class InsurersService {

  public static async getAllAsItems(): Promise<Insurer[]> {
    return await Crud.getAllAsItems<Insurer>('insurers');
  }

  public static async create(formData: Insurer): Promise<boolean> {
    await Crud.create('insurers', formData);
    return true;
  }

  public static async update(id: string, formData: Insurer): Promise<boolean> {
    const doc = await Crud.getAsDoc('insurers', id);
    await Crud.update(doc, formData);
    return true;
  }

  public static async getAsItem(id: string): Promise<Insurer> {
    return await Crud.getAsItem<Insurer>('insurers', id);
  }

  public static async remove(id: string): Promise<boolean> {
    const items = await Crud.getAllBy<Patient>('patients', ['idInsurer', id]);
    if (items.length !== 0) {
      return false;
    }
    const doc = await Crud.getAsDoc('insurers', id);
    await Crud.delete(doc);
    return true;
  }

}
