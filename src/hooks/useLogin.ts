import { useEffect } from "react";
import { useAppSelector } from "./reduxHooks";

export const useLogin = () => {
  const { isLoggedIn, userId, token, expirationTime } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isLoggedIn && userId && token && expirationTime) {
      localStorage.setItem("userId", userId);
      localStorage.setItem("token", token);
      localStorage.setItem("expirationTime", expirationTime.toString());
      return;
    }
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
  }, [isLoggedIn]);
};
