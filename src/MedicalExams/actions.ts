import { db, storage } from "../shared/utils/Firebase";
import saveState from "../shared/helpers/saveState";
import pdfService from "../pdfservice";
import { BACKEND_URL } from "../httpservices";

export const getMedicosInformantes = () => {
  return db
    .collection("medicosInformantes")
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

export const setResultadoEntregado = (
  examId: string,
  displayName: string,
  descripcion: string,
  idDoctorInf: string,
  result: string
) => {
  let today = new Date();
  let fechaCompleta =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  return saveState("resultadoEntregado", displayName, examId).then(
    (idState) => {
      return db.collection("medicExams").doc(examId).update({
        dateResult: fechaCompleta,
        idDoctorInf,
        result,
        idState: idState,
        descripcion,
      });
    }
  );
};

export const enviarConsentimiento = (examId: string, displayName: string) => {
  return saveState("esperandoConsentimiento", displayName, examId).then(
    (idState) => {
      return db.collection("medicExams").doc(examId).update({
        idState: idState,
      });
    }
  );
};

export const enviarPrespuesto = (examId: string, displayName: string) => {
  return saveState("esperandoComprobante", displayName, examId).then(
    (idState) => {
      return db.collection("medicExams").doc(examId).update({
        idState: idState,
      });
    }
  );
};

export const enviarPresupestoPdf = (examId: string, targetEmail: string) => {
  return storage
    .ref(`presupuestosPdf/${examId}.pdf`)
    .getDownloadURL()
    .then((url) => {
      const html = `<p>Acceda a esta direccion para descargar el presupuesto de su estudio medico ${url}</p>`;
      return pdfService.sendUsingSendgrid(
        targetEmail,
        "Presupuesto del estudio medico",
        html
      );
    });
};

export const enviarResultado = (examId: string, displayName: string) => {
  return saveState("finalizado", displayName, examId).then((idState) => {
    return db.collection("medicExams").doc(examId).update({
      idState: idState,
    });
  });
};

export const getExams = () => {
  return db
    .collection("medicExams")
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

export const getExam = (examId: string) => {
  return db
    .collection("medicExams")
    .doc(examId)
    .get()
    .then((doc) => {
      const examen = doc.data();
      return Promise.resolve({
        ...examen,
        id: doc.id,
      });
    });
};

export const getDoctors = () => {
  return db
    .collection("doctors")
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

export const getDoctor = (doctorId: string) => {
  return db
    .collection("doctors")
    .doc(doctorId)
    .get()
    .then((doc) => {
      return Promise.resolve(doc.data());
    });
};

export const getPatientsAsDict = () => {
  return db
    .collection("patients")
    .get()
    .then((doc) => {
      if (!doc.empty) {
        return Promise.resolve(
          doc.docs.reduce(
            (acc, docActual) => ({
              ...acc,
              [docActual.id]: {
                ...docActual.data(),
                id: docActual.id,
              },
            }),
            {}
          )
        );
      }
      return Promise.resolve(null);
    });
};

export const getPatient = (patientId: string) => {
  return db
    .collection("patients")
    .doc(patientId)
    .get()
    .then((doc) => {
      return Promise.resolve(doc.data());
    });
};

export const getState = (stateId: string) => {
  return db
    .collection("states")
    .doc(stateId)
    .get()
    .then((doc) => {
      return Promise.resolve(doc.data());
    });
};

export const getStatesAsDict = () => {
  return db
    .collection("states")
    .get()
    .then((doc) => {
      if (!doc.empty) {
        return Promise.resolve(
          doc.docs.reduce((acc, docActual) => {
            const data = docActual.data();
            return {
              ...acc,
              [docActual.id]: data,
            };
          }, {})
        );
      }
      return Promise.resolve({});
    });
};

export const getHistorial = (examId: string) => {
  return db
    .collection("states")
    .where("idMedicExam", "==", examId)
    .get()
    .then((result) => {
      return Promise.resolve(
        result.docs.reduce((acc, doc) => {
          const data = doc.data();
          return {
            ...acc,
            [data.name]: {
              ...data,
              id: data.id,
            },
          };
        }, {})
      );
    });
};

export const getMedicalSample = (examId: string) => {
  return db
    .collection("medicalSamples")
    .where("idMedicExam", "==", examId)
    .get()
    .then((doc) => {
      return Promise.resolve(doc.docs[0].data());
    });
};

export const updateMedicalSample = (id: string, data: Record<string, any>) => {
  return db.collection("medicalSamples").doc(id).update(data);
};

export const getShiftsReserved = () => {
  return db
    .collection("shifts")
    .get()
    .then((doc) => {
      if (!doc.empty) {
        return Promise.resolve(
          doc.docs.reduce((acc, docActual) => {
            const data = docActual.data();
            return {
              [`${data.hour}${data.date}`]: true,
            };
          }, {})
        );
      }
      return Promise.resolve({});
    });
};

export const getShift = (examId: string) => {
  return db
    .collection("shifts")
    .where("idMedicExam", "==", examId)
    .get()
    .then((doc) => {
      return Promise.resolve(doc.docs[0].data());
    });
};

export const getUrlComprobante = (examId: string) => {
  return storage.ref(`comprobante/${examId}`).getDownloadURL();
};

export const getUrlConsentimiento = (examId: string) => {
  return storage.ref(`consentimiento/${examId}`).getDownloadURL();
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

export const getPrices = () => {
  return db
    .collection("pricesMedicExams")
    .get()
    .then((doc) => {
      if (!doc.empty) {
        return Promise.resolve(
          doc.docs.reduce((acc, docActual) => {
            const data = docActual.data();
            return {
              ...acc,
              [data.exam]: data.price,
            };
          }, {})
        );
      }
      return Promise.resolve([]);
    });
};

export const createMedicExam = (medicExam: {
  idPatient: string;
  idEmployee: string;
  idMedic: string;
  patology: string;
  exomaSelected: boolean;
  genomaSelected: boolean;
  carrierSelected: boolean;
  cariotipoSelected: boolean;
  arraySelected: boolean;
  price: string;
  examSelected: string;
}) => {
  let today = new Date(),
    date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
  let day = today.getDate();
  let month = today.getUTCMonth() + 1;
  let year = today.getFullYear();
  return db.collection("medicExams").add({
    ...medicExam,
    fechaCompleta: date,
    day: day,
    month: month,
    year: year,
    idState: "",
    pago: false,
    extraccion: false,
  });
};

export const setStateEnviarPresupuesto = (
  displayName: string,
  idMedicExam: string
) => {
  return saveState("enviarPresupuesto", displayName, idMedicExam).then(
    (idState) => {
      return db.collection("medicExams").doc(idMedicExam).update({
        idState: idState,
      });
    }
  );
};

export const downloadInformePdf = (paciente: Record<string, any>) => {
  return pdfService.downloadPDF(
    `${BACKEND_URL}/pdf/informe?usuario=${paciente.nombre}`,
    paciente
  );
};

export const setPresupuestoPdf = (
  idMedicExam: string,
  file: Blob,
  metadata: Record<string, string>
) => {
  return storage
    .ref()
    .child(`presupuestosPdf/${idMedicExam}.pdf`)
    .put(file, metadata);
};

export const createShift = (shift: {
  idMedicExam: string;
  date: string;
  hour: string;
  idPatient: string;
}) => {
  return db.collection("shifts").add(shift);
};

export const setStateEsperandoTomaDeMuestra = (
  examId: string,
  displayName: string
) => {
  return saveState("esperandoTomaDeMuestra", displayName, examId).then(
    (idState) => {
      return db.collection("medicExams").doc(examId).update({
        idState,
      });
    }
  );
};

export const setStateEsperandoLote = (examId: string, displayName: string) => {
  return saveState("esperandoLote", displayName, examId).then((idState) => {
    return db.collection("medicExams").doc(examId).update({
      idState,
    });
  });
};

export const setStateEnLote = (displayName: string) => {
  const req1 = (arrayStates: Record<string, string>[]): Promise<void>[] => {
    const promises = [];
    for (let id = 0; id <= 9; id++) {
      promises.push(
        saveState("enLote", displayName, arrayStates[id].idMedicExam).then(
          (idState) => {
            return db
              .collection("medicExams")
              .doc(arrayStates[id].idMedicExam)
              .update({
                idState,
              });
          }
        )
      );
    }
    return promises;
  };

  const req2 = (arrayStates: Record<string, string>[]): Promise<any> => {
    return db
      .collection("lotes")
      .get()
      .then((result) => {
        let idLote = result.docs.length;
        return db.collection("lotes").add({
          numLote: idLote + 1,
          idMedicExam1: arrayStates[0].idMedicExam,
          idMedicExam2: arrayStates[1].idMedicExam,
          idMedicExam3: arrayStates[2].idMedicExam,
          idMedicExam4: arrayStates[3].idMedicExam,
          idMedicExam5: arrayStates[4].idMedicExam,
          idMedicExam6: arrayStates[5].idMedicExam,
          idMedicExam7: arrayStates[6].idMedicExam,
          idMedicExam8: arrayStates[7].idMedicExam,
          idMedicExam9: arrayStates[8].idMedicExam,
          idMedicExam10: arrayStates[9].idMedicExam,
          state: "esperandoResultado",
          urlResultado: "",
        });
      })
      .then((e) => {
        return Promise.all(
          arrayStates.map((state) => {
            return db.collection("medicExams").doc(state.idMedicExam).update({
              idLote: e.id,
            });
          })
        );
      });
  };

  return db
    .collection("states")
    .where("name", "==", "esperandoLote")
    .get()
    .then((result): Promise<any> => {
      if (result.docs.length < 10) {
        return Promise.all([]);
      }
      const arrayStates = result.docs.map((docActual, i) => {
        const data = docActual.data();
        return {
          ...data,
          id: docActual.id,
        };
      });
      return Promise.all([...req1(arrayStates), req2(arrayStates)]);
    });
};

export const uploadComprobanteImage = (file: Blob, fileName: string) => {
  return storage.ref().child(`comprobante/${fileName}`).put(file);
};

export const setStateEnviarConsentimiento = (
  examId: string,
  displayName: string
) => {
  return saveState("enviarConsentimiento", displayName, examId).then(
    (idState) => {
      return db.collection("medicExams").doc(examId).update({
        idState,
      });
    }
  );
};

export const uploadConcentimientoImage = (file: Blob, fileName: string) => {
  return storage.ref().child(`consentimiento/${fileName}`).put(file);
};

export const setStateEsperandoTurno = (examId: string, displayName: string) => {
  return saveState("esperandoTurno", displayName, examId).then((idState) => {
    return db.collection("medicExams").doc(examId).update({
      idState,
    });
  });
};

export const createMedicalSample = (data: {
  idMedicExam: string;
  cantMl: string;
  freezer: string;
}) => {
  return db.collection("medicalSamples").add(data);
};

export const setStateEsperandoRetiroDeMuestra = (
  examId: string,
  displayName: string
) => {
  return saveState("esperandoRetiroDeMuestra", displayName, examId).then(
    (idState) => {
      return db.collection("medicExams").doc(examId).update({
        idState,
        extraccion: true,
      });
    }
  );
};
