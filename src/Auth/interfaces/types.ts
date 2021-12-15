export type User = {
  id: string;
  email: string;
  username: string;
  pass: string;
  role: "patient" | "admin";
};

export const emptyUser: User = {
  id: "",
  email: "",
  username: "",
  pass: "",
  role: "patient",
};
