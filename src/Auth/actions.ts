import { toast } from "react-toastify";

import { UsersService } from "./services";
import { User } from "./interfaces";

export const registerFirebaseAuth = async (email: string, pass: string) => {
  try {
    await UsersService.registerFirebaseAuth(email, pass);
    toast.success("Hemos enviado un correo para confirmar su cuenta");
    return true;
  } catch (error) {
    console.log(error);
    const e = error as any;
    if (typeof e === "object" && e.code === "auth/email-already-in-use") {
      toast.error("Ya existe el correo electronico en nuestro sistema");
    } else {
      toast.error("Ya existe un usuario con el mismo nombre de usuario");
    }
    return false;
  }
};

export const createUser = async (formData: User) => {
  let success = false;
  try {
    success = await UsersService.create(formData);
    if (success) {
      //toast.success("Usted se ha registrado con exito!");
    } else {
      //toast.error("Ya existe un usuario con el mismo nombre de usuario");
    }
  } catch (error) {
    console.error(error);
    toast.error("Error al crear su usuario");
  }
  return success;
};

export const loginFirebaseAuth = async (email: string, pass: string) => {
  try {
    await UsersService.loginFirebaseAuth(email, pass);
    return true;
  } catch (error) {
    console.error(error);
    if (error === "EMAIL_NOT_VERIFIED") {
      toast.error("Debe verificar su email para poder continuar");
    } else if (error === "auth/invalid-email") {
      toast.error("El email es invalido");
    } else if (error === "auth/wrong-password") {
      toast.error("El usuario o la contraseña son incorrectos");
    } else if (error === "auth/too-many-requests") {
      toast.error(
        "Has enviado demasiadas solicitudes de reenvio de email. Vuelve a intentarlo en unos minutos"
      );
    } else if (error === "auth/user-not-found") {
      toast.error("El usuario o la contraseña son incorrectos");
    } else {
      toast.error("no se pudo autenticar con firebase");
    }
    return false;
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    const users = await UsersService.getAllAsItemsByUsername(username);
    if (users.length === 0) {
      return null;
    }
    return users[0];
  } catch (error) {
    toast.error(`no se pudo obtener los datos del usuario ${username}`);
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const users = await UsersService.getAllAsItemsByEmail(email);
    if (users.length === 0) {
      return null;
    }
    return users[0];
  } catch (error) {
    toast.error(`no se pudo obtener los datos del usuario ${email}`);
    return null;
  }
};
