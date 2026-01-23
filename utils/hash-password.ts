import { hashSync } from "bcryptjs";

const converter = (password: string) => {
  const hashed = hashSync(password);
  return hashed;
};

export default converter;
