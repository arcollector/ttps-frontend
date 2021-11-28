import { db } from "../shared/utils/Firebase";

export const getExamsWithExtractions = () => {
  return db
    .collection("medicExams")
    .where("extraccion", "==", true)
    .get()
    .then((result) => {
      return Promise.resolve(
        result.docs.reduce<Record<string, string>[]>((acc, doc) => {
          if (!doc.data().pago) {
            let exam;
            exam = doc.data();
            return [
              ...acc,
              {
                ...exam,
                id: doc.id,
              },
            ];
          }
          return acc;
        }, [])
      );
    });
};

export const confirmPayment = (examId: string) => {
  return db.collection("medicExams").doc(examId).update({
    pago: true,
  });
};
