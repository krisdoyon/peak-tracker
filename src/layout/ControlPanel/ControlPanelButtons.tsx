import styles from "./ControlPanel.module.scss";
import { Button } from "components/Buttons";
import {
  useGetLogEntriesQuery,
  useGetPeaksQuery,
  useSetTestLogEntriesMutation,
} from "features/apiSlice";
import { clearMap, plotLogEntry } from "features/mapSlice";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { useNavigate } from "react-router-dom";
import { isPeakCompleted } from "utils/peakUtils";
import { ModalType, openModal } from "features/modalSlice";
import { logout } from "features/authSlice";
import { TripType } from "pages/NewEntry/NewEntryType/NewEntryType";

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
  const { data: allPeaks = [] } = useGetPeaksQuery();
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

  const { data: allPeaks = [] } = useGetPeaksQuery();

  const { data: logEntries = [] } = useGetLogEntriesQuery(
    { userId, token, tripType: TripType.COMPLETED },
    { skip: userId === null || !isLoggedIn || token === null }
  );
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
