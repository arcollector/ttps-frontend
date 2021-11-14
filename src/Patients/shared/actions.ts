import {toast} from 'react-toastify';
import { Patient } from '../interfaces'
import { db } from '../../shared/utils/Firebase';

export const searchPatientByDni = (dniToSearch: string): Promise<Patient | null> => {
  let pacienteBuscado: Patient[] =[];
  const refDoc = db
    .collection('patients')
    .where("dni","==",dniToSearch);
  return refDoc
    .get()
    .then((doc) => {
      if(!doc.empty){
        pacienteBuscado.push(doc.docs[0].data() as Patient);
        pacienteBuscado[0].id=doc.docs[0].id;
        return Promise.resolve(pacienteBuscado[0]);
      }
      toast.warning("El paciente que ingreso no existe");
      return Promise.resolve(null);
    });
};
