import { toast } from "react-toastify";

import { UsersService } from "./services";
import { User, emptyUser } from "./interfaces";

export const createUser = async (formData: User) => {
  let success = false;
  try {
    success = await UsersService.create(formData);
    if (success) {
      toast.success("Usted se ha registrado con exito!");
    } else {
      toast.error("Ya existe un usuario con el mismo nombre de usuario");
    }
  } catch (error) {
    toast.error("Error al crear su usuario");
  }
  return success;
};

export const getUserByUsername = async (username: string) => {
  try {
    const users = await UsersService.getAllAsItemsByUsername(username);
    if (users.length === 0) {
      return emptyUser;
    }
    return users[0];
  } catch (error) {
    toast.error(`no se pudo obtener los datos del usuario ${username}`);
    return emptyUser;
  }
};
