import styles from "./ControlPanel.module.scss";
import { Button } from "components/Buttons";
import {
  useGetListsQuery,
  useGetLogEntriesQuery,
  useSetTestLogEntriesMutation,
} from "features/apiSlice";
import { clearMap, plotLogEntry } from "features/mapSlice";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { useNavigate } from "react-router-dom";
import { getAllUniquePeaks, isPeakCompleted } from "utils/peakUtils";
import { ModalType, openModal } from "features/modalSlice";
import { logout } from "features/authSlice";

export const LoadTestButton = () => {
  const [setTestLogEntries] = useSetTestLogEntriesMutation();
  const navigate = useNavigate();

  const { userId, token, isLoggedIn } = useAppSelector((state) => state.auth);

  const handleLoad = () => {
    if (
      confirm("This action will overwrite all existing log entries. Continue?")
    ) {
      setTestLogEntries({ userId, token });
      navigate("/log");
    }
  };

  return (
    <Button className={styles.btn} onClick={handleLoad} disabled={true}>
      LOAD TEST ENTRIES
    </Button>
  );
};

export const PlotAllButton = () => {
  const { data: allPeakLists = [] } = useGetListsQuery();
  const allPeaks = getAllUniquePeaks(allPeakLists);
  const dispatch = useAppDispatch();

  return (
    <Button
      className={styles.btn}
      onClick={() => dispatch(plotLogEntry(allPeaks))}
    >
      PLOT ALL PEAKS
    </Button>
  );
};

export const ClearMapButton = () => {
  const dispatch = useAppDispatch();
  return (
    <Button className={styles.btn} onClick={() => dispatch(clearMap())}>
      CLEAR MAP
    </Button>
  );
};

export const PlotCompletedButton = () => {
  const dispatch = useAppDispatch();
  const { isLoggedIn, token, userId } = useAppSelector((state) => state.auth);

  const { data: allPeakLists = [] } = useGetListsQuery();
  const { data: logEntries = [] } = useGetLogEntriesQuery(
    { userId, token },
    { skip: userId === null || !isLoggedIn || token === null }
  );
  const allPeaks = getAllUniquePeaks(allPeakLists);
  const completedPeaks = allPeaks.filter((peak) =>
    isPeakCompleted(peak.id, logEntries)
  );
  return (
    <Button
      className={styles.btn}
      onClick={() => dispatch(plotLogEntry(completedPeaks))}
    >
      PLOT COMPLETED
    </Button>
  );
};

export const LoginButton = () => {
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAppSelector((state) => state.auth);

  const handleClick = () => {
    if (isLoggedIn) {
      dispatch(logout());
      return;
    }
    dispatch(openModal(ModalType.LOGIN));
  };

  return (
    <Button className={styles.btn} onClick={handleClick}>
      {isLoggedIn ? "LOG OUT" : "LOG IN"}
    </Button>
  );
};
