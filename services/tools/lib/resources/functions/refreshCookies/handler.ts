import { getCookie } from "../utils/getCookie";

export const handler = async (event: unknown) => {
  await getCookie();
};
