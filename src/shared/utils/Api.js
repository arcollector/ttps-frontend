import firebaseApp from "./Firebase";
import 'firebase/compat/firestore';
const db = firebaseApp.firestore(firebaseApp);

export async function isUserAdmin(uid){
    const response= 
        await db.collection("admins")
        .doc(uid)
        .get();
    return response.exists;
}


