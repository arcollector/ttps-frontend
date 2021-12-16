import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLjW-3g5O6-TzefgKjqc6Mqh9TOg-fJvo",
  authDomain: "facultadtp-2dd10.firebaseapp.com",
  projectId: "facultadtp-2dd10",
  storageBucket: "facultadtp-2dd10.appspot.com",
  messagingSenderId: "1079198003514",
  appId: "1:1079198003514:web:ca590dc26660ef36dce003",
  measurementId: "G-HLH6HGVFEB",
};

export default firebase.initializeApp(firebaseConfig);

export type FirebaseUser = firebase.User;

export const db = firebase.firestore(firebase as any);

type Collection = "patients" | "medicExams" | "insurers" | "tutors" | "users";

export const Crud = {
  create<T>(collection: Collection, formData: T): Promise<string> {
    return new Promise((resolve, reject) => {
      db.collection(collection)
        .add(formData)
        .then((res) => {
          resolve(res.id);
        })
        .catch((error) => {
          console.error(error);
          reject(`failure to create on ${collection}`);
        });
    });
  },

  getAllAsItems<T>(collection: Collection): Promise<T[]> {
    const items: T[] = [];
    return new Promise((resolve, reject) => {
      db.collection(collection)
        .get()
        .then((doc) => {
          if (!doc.empty) {
            doc.docs.forEach((doc) => {
              items.push({
                ...(doc.data() as T),
                id: doc.id,
              });
            });
          }
          resolve(items);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },

  getAsDoc(
    collection: Collection,
    id: string
  ): Promise<
    firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
  > {
    return new Promise((resolve, reject) => {
      db.collection(collection)
        .doc(id)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            reject(`${collection}/${id} not found`);
          } else {
            resolve(doc);
          }
        })
        .catch((error) => {
          console.error(error);
          reject(`${collection}/${id} failure to obtain`);
        });
    });
  },

  getAsItem<T>(collection: Collection, id: string): Promise<T> {
    return new Promise((resolve, reject) => {
      Crud.getAsDoc(collection, id)
        .then((doc) => {
          resolve(doc.data() as T);
        })
        .catch((error) => {
          console.error(error);
          reject(`${collection}/${id} failure to cast to item`);
        });
    });
  },

  update<T>(
    doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>,
    values: T
  ) {
    return new Promise((resolve, reject) => {
      doc.ref
        .set(values)
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },

  delete(
    doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
  ) {
    return new Promise((resolve, reject) => {
      doc.ref
        .delete()
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },

  getAllBy<T>(collection: Collection, tuple: [keyof T, string]): Promise<T[]> {
    return new Promise((resolve, reject) => {
      db.collection(collection)
        .where(tuple[0] as string, "==", tuple[1])
        .get()
        .then((doc) => {
          if (doc.empty) {
            resolve([]);
          } else {
            const items: T[] = [];
            doc.docs.forEach((doc) => {
              items.push(doc.data() as T);
            });
            resolve(items);
          }
        })
        .catch((error) => {
          console.error(error);
          reject(`fail to get all by in ${collection}`);
        });
    });
  },
};
