import { login } from "features/authSlice";
import { useEffect } from "react";
import { useAppDispatch } from "./reduxHooks";

export const useToken = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const expirationTime = localStorage.getItem("expirationTime")
      ? +localStorage["expirationTime"]
      : null;
    if (!expirationTime) return;
    const remainingTime = +expirationTime - Date.now();
    if (remainingTime <= 0) {
      localStorage.removeItem("token");
      localStorage.removeItem("expirationTime");
      localStorage.removeItem("userId");
      return;
    }
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (userId && token) {
      dispatch(login({ userId, token, expirationTime }));
    }
  }, []);
};
