import { toast } from "react-toastify";

import { db } from "../shared/utils/Firebase";

export const getPatientMedixExams = (patientId: string) => {
	const refMedicExams = db
		.collection("medicExams")
		.where("idPatient", "==", patientId);
	return refMedicExams.get().then((doc) => {
		let arrayExams: any[] = [];
		if (!doc.empty) {
			doc.docs.forEach((docActual) => {
				const data = docActual.data();
				data.id = docActual.id;
				arrayExams.push(data);
			});
			return Promise.resolve(arrayExams);
		}
	});
};

export const createAppointment = (
	idMedicExam: string,
	date: string,
	hour: string,
	idPatient: string
) => {
	return db.collection("shifts").add({
		idMedicExam,
		date,
		hour,
		idPatient,
	});
};

export const getAllPatients = () => {
	return db
		.collection("patients")
		.get()
		.then((doc) => {
			if (doc.empty) {
				return Promise.resolve({});
			}
			return Promise.resolve(
				doc.docs.reduce((acc, docActual) => {
					const data = docActual.data();
					const id = docActual.id;
					return {
						...acc,
						[id]: {
							...data,
							id,
							nombreCompleto: `${data.nombre} ${data.apellido}`,
						},
					};
				}, {})
			);
		});
};

export const getAllShifts = () => {
	return db
		.collection("shifts")
		.get()
		.then((doc) => {
			if (doc.empty) {
				return Promise.resolve([]);
			}
			return Promise.resolve(
				doc.docs.map((docActual) => {
					const data = docActual.data();
					return {
						...data,
						id: docActual.id,
					};
				})
			);
		});
};
