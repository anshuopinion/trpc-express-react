import { Cookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { baseURl } from "../src/constant";
export const refreshHeaderToken = async () => {
  const cookies = new Cookies();
  const user = cookies.get("user");
  const accessToken = user?.access_token ?? null;
  const refreshToken = user?.refresh_token ?? null;

  if (!accessToken) {
    return {};
  }

  const userId = user?.id ?? "";
  const decodedToken: any = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;
  if (decodedToken.exp < currentTime) {
    const rsp = await fetch(`${baseURl}/auth.refreshToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken, userId }),
    });
    if (rsp.ok) {
      const response = await rsp.json();
      if (response.result.data) {
        cookies.set("user", response.result.data);
      }
    }
  }
  return {
    authorization: `Bearer ${accessToken}`,
  };
};
