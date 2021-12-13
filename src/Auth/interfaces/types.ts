export type User = {
  id: string;
  username: string;
  pass: string;
  role: "patient" | "admin";
};

export const emptyUser: User = {
  id: "",
  username: "",
  pass: "",
  role: "patient",
};
