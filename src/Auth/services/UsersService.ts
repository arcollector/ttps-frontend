import { Crud } from "../../shared/firebase";
import { User } from "../interfaces";

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
}
