import { db, storage } from "../shared/utils/Firebase";
import saveState from "../shared/helpers/saveState";
import pdfService from "../pdfservice";

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
		today.getFullYear() +
		"-" +
		(today.getMonth() + 1) +
		"-" +
		today.getDate();
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
