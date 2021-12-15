import React from "react";
import { User } from "./Auth";

export type AuthContextInterface = {
  setUserFromFirestore: (user: User) => any;
};

export const AuthContext = React.createContext<AuthContextInterface>({
  setUserFromFirestore: () => {},
});
