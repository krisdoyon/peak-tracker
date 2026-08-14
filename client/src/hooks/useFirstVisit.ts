import { ModalType, openModal } from "features/modalSlice";
import { useEffect } from "react";
import { useAppDispatch } from "./reduxHooks";

export const useFirstVisit = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const firstVisitTimestamp = localStorage.getItem("firstVisit");
    const now = Date.now();

    const openWelcomeModal = () => {
      dispatch(openModal(ModalType.WELCOME));
      localStorage.setItem("firstVisit", JSON.stringify(now));
    };

    if (!firstVisitTimestamp) {
      openWelcomeModal();
      return;
    }

    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    const timeDiff = now - +firstVisitTimestamp;

    if (firstVisitTimestamp && timeDiff > oneWeek) {
      openWelcomeModal();
    }
  }, []);
};
