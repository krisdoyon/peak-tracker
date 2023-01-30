import styles from "./ControlPanel.module.scss";
import { Button } from "components/Buttons";
import {
  useGetListsQuery,
  useGetLogEntriesQuery,
  useSetTestLogEntriesMutation,
} from "features/apiSlice";
import { clearMap, plotLogEntry } from "features/mapSlice";
import { useAppDispatch } from "hooks/reduxHooks";
import { useNavigate } from "react-router-dom";
import { getAllUniquePeaks, isPeakCompleted } from "utils/peakUtils";

const USER_Id = "abc123";

export const LoadTestButton = () => {
  const [setTestLogEntries] = useSetTestLogEntriesMutation();
  const navigate = useNavigate();

  const handleLoad = () => {
    if (
      confirm("This action will overwrite all existing log entries. Continue?")
    ) {
      setTestLogEntries(USER_Id);
      navigate("/log");
    }
  };

  return (
    <Button className={styles.btn} onClick={handleLoad}>
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
  const { data: allPeakLists = [] } = useGetListsQuery();
  const { data: logEntries = [] } = useGetLogEntriesQuery("abc123");
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
