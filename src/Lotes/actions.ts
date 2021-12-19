import { db } from "../shared/utils/Firebase";
import saveState from "../shared/helpers/saveState";

export const updateLotes = (
  lote: {
    id: string;
    idMedicExam1: string;
    idMedicExam2: string;
    idMedicExam3: string;
    idMedicExam4: string;
    idMedicExam5: string;
    idMedicExam6: string;
    idMedicExam7: string;
    idMedicExam8: string;
    idMedicExam9: string;
    idMedicExam10: string;
    numLote: number;
    state: string;
    urlResultado: string;
  },
  lotesWithFails: string[],
  urlResultado: string,
  userResultado: string
) => {
  let today = new Date();
  let day = today.getDate();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();
  let fechaCompleta = `${day}-${month}-${year}`;
  return db
    .collection("lotes")
    .doc(lote.id)
    .update({
      state: "finalizado",
      urlResultado,
      fechaResultado: fechaCompleta,
      userResultado,
    })
    .then(() => {
      const promises = [];
      const loteKeys = [
        "idMedicExam1",
        "idMedicExam2",
        "idMedicExam3",
        "idMedicExam4",
        "idMedicExam5",
        "idMedicExam6",
        "idMedicExam7",
        "idMedicExam8",
        "idMedicExam9",
        "idMedicExam10",
      ];
      type IdMedicExamKeys = Omit<
        typeof lote,
        "id" | "numLote" | "state" | "urlResultado"
      >;
      for (const loteKey of loteKeys) {
        const idMedicExam = lote[loteKey as keyof IdMedicExamKeys];
        let promise;
        if (lotesWithFails.includes(idMedicExam)) {
          promise = saveState("esperandoTurno", userResultado, idMedicExam);
        } else {
          promise = saveState(
            "esperandoInterpretacion",
            userResultado,
            idMedicExam
          );
        }
        promises.push(
          promise.then((idState) => {
            return db.collection("medicExams").doc(idMedicExam).update({
              idState: idState,
            });
          })
        );
      }
      return Promise.all(promises);
    });
};

export const getLote = (loteId: string) => {
  return db
    .collection("lotes")
    .doc(loteId)
    .get()
    .then((doc) => {
      const lote = doc.data();
      return Promise.resolve({
        ...lote,
        id: doc.id,
      });
    });
};

export const getAllLotes = () => {
  return db
    .collection("lotes")
    .get()
    .then((doc) => {
      if (!doc.empty) {
        return Promise.resolve(
          doc.docs.map((docActual) => {
            const data = docActual.data();
            return {
              ...data,
              id: docActual.id,
            };
          })
        );
      }
      return Promise.resolve([]);
    });
};
