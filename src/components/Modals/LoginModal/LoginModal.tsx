import { Button, TextButton } from "components/Buttons";
import { Modal } from "components/Modals/Modal";
import { useState } from "react";
import styles from "./LoginModal.module.scss";
import { useSendAuthRequestMutation } from "features/apiSlice";
import { useAppDispatch } from "hooks/reduxHooks";
import {
  ModalType,
  closeModal,
  openModal,
  setError,
} from "features/modalSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { LoadingSpinner } from "components/LoadingSpinner/LoadingSpinner";
import { SerializedError } from "@reduxjs/toolkit";

type AuthError = {
  status: number;
  data: {
    error: {
      code: number;
      errors: any;
      message: string;
    };
  };
};

export const LoginModal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();

  const [sendRequest, { isLoading, isError, error }] =
    useSendAuthRequestMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const requestType = isLogin ? "login" : "signup";
    const test = await sendRequest({
      email,
      password,
      requestType,
    });

    dispatch(closeModal()); // TODO fix this problem, closing error modal before it loads
  };

  if (isError) {
    dispatch(setError(error));
    dispatch(openModal(ModalType.ERROR));
    return null;
  }

  return (
    <Modal className={styles.modal}>
      {isLoading && <LoadingSpinner />}
      {/* {error && <p>{error?.data?.error.message}</p>} */}
      {!isLoading && !isError && (
        <>
          <h2 className={styles.heading}>
            {isLogin ? "Log in" : "Create account"}
          </h2>
          <form id="login-form" className={styles.form} onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </form>
          <Button type="submit" form="login-form" className={styles.submit}>
            Submit
          </Button>
          <div>
            <p>{isLogin ? "New user?" : "Returning user?"}</p>
            <TextButton color="green" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Create an account" : "Sign in"}
            </TextButton>
          </div>
        </>
      )}
    </Modal>
  );
};
