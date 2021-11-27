import { db } from "../shared/utils/Firebase";
import saveState from "../shared/helpers/saveState";

export const updateLotes = (
	lote: Record<any, any>,
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
			for (let id = 1; id <= 10; id++) {
				promises.push(
					saveState(
						"esperandoInterpretacion",
						userResultado,
						lote[`idMedicExam${id}`]
					).then((idState) => {
						return db
							.collection(
								"medicExams"
							)
							.doc(
								lote[
									`idMedicExam${id}`
								]
							)
							.update({
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
