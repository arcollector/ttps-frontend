import { db } from "../shared/utils/Firebase";

export const getPathologies = () => {
  return db
    .collection("medicExams")
    .get()
    .then((doc) => {
      let sumExoma = 0;
      let sumGenoma = 0;
      let sumCarrier = 0;
      let sumCariotipo = 0;
      let sumArray = 0;
      if (!doc.empty) {
        doc.docs.forEach((docActual) => {
          switch (docActual.data().examSelected) {
            case "exoma":
              sumExoma++;
              break;
            case "genoma":
              sumGenoma++;
              break;
            case "carrier":
              sumCarrier++;
              break;
            case "cariotipo":
              sumCariotipo++;
              break;
            case "array":
              sumArray++;
          }
        });
      }
      return Promise.resolve({
        sumExoma,
        sumGenoma,
        sumCarrier,
        sumCariotipo,
        sumArray,
      });
    });
};

export const getYearTimes = () => {
  return db
    .collection("states")
    .get()
    .then((doc) => {
      let añoTiempo: Record<any, any> = {};
      if (!doc.empty) {
        doc.docs.forEach((docActual) => {
          if (docActual.data().name === "resultadoEntregado") {
            let fechaFin = new Date();
            fechaFin.setDate(docActual.data().day);
            fechaFin.setMonth(docActual.data().month);
            fechaFin.setFullYear(docActual.data().year);
            let idActual = docActual.data().idMedicExam;
            let fechaInicio = new Date();
            doc.docs.forEach((docActual2) => {
              if (
                docActual2.data().idMedicExam === idActual &&
                docActual2.data().name === "esperandoRetiroDeMuestra"
              ) {
                fechaInicio.setDate(docActual2.data().day);
                fechaInicio.setMonth(docActual2.data().month);
                fechaInicio.setFullYear(docActual2.data().year);
              }
            });
            let diferencia = Math.abs(
              fechaFin.valueOf() - fechaInicio.valueOf()
            );
            let dias = diferencia / (1000 * 3600 * 24);
            if (añoTiempo[docActual.data().year]) {
              añoTiempo[docActual.data().year] += dias;
            } else {
              añoTiempo[docActual.data().year] = dias;
            }
          }
        });
      }
      return Promise.resolve(añoTiempo);
    });
};

export const getMonthStudies = () => {
  return db
    .collection("medicExams")
    .get()
    .then((doc) => {
      let estudiosMes: Record<any, any> = {};
      if (!doc.empty) {
        doc.docs.forEach((docActual) => {
          if (estudiosMes[docActual.data().month]) {
            estudiosMes[docActual.data().month]++;
          } else {
            estudiosMes[docActual.data().month] = 1;
          }
        });
      }
      return Promise.resolve(estudiosMes);
    });
};
