import {toast} from 'react-toastify';

import { db } from '../shared/utils/Firebase';

export const getPatientMedixExams = (patientId: string) => {
  const refMedicExams = db
    .collection("medicExams")
    .where("idPatient","==",patientId);
  return refMedicExams
    .get()
    .then(doc=>{
      let arrayExams: any[] =[]; 
      if(!doc.empty){
        doc.docs.forEach((docActual)=>{
          const data=docActual.data();
          data.id=docActual.id;
          arrayExams.push(data);
        })
        return Promise.resolve(arrayExams);
      }
    });
};
