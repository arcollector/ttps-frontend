import { Crud } from "../../shared/firebase";
import { User } from "../interfaces";
import firebase from "../../shared/utils/Firebase";

export class UsersService {
  public static async existsUsername(username: string): Promise<boolean> {
    const items = await Crud.getAllBy<User>("users", ["username", username]);
    return items.length !== 0;
  }

  public static async create(formData: User): Promise<boolean> {
    const existsDni = await UsersService.existsUsername(formData.username);
    if (!existsDni) {
      await Crud.create("users", formData);
      return true;
    }
    return false;
  }

  public static async getAllAsItemsByUsername(
    username: string
  ): Promise<User[]> {
    return await Crud.getAllBy<User>("users", ["username", username]);
  }

  public static async registerFirebaseAuth(
    email: string,
    pass: string
  ): Promise<void> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, pass)
      .then((response) => {
        return response.user?.sendEmailVerification();
      });
  }

  public static async loginFirebaseAuth(
    email: string,
    pass: string
  ): Promise<void> {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .then((response) => {
        if (!response.user?.emailVerified) {
          return Promise.reject("EMAIL_NOT_VERIFIED");
        }
      })
      .catch((err) => {
        return Promise.reject(
          typeof err === "object" && "code" in err ? err.code : err
        );
      });
  }
}
