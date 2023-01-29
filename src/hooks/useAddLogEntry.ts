import {
  useAddLogEntryMutation,
  useGetLogEntriesQuery,
} from "features/apiSlice";
import { resetForm } from "features/newEntrySlice";
import { ILogEntry } from "models/interfaces";
import { useNavigate } from "react-router-dom";
import { getLogStats, setLogEntryId } from "utils/peakUtils";
import { useAppDispatch, useAppSelector } from "./reduxHooks";

const USER_Id = "abc123";

export const useAddLogEntry = () => {
  const navigate = useNavigate();
  const { data: allLogEntries = [] } = useGetLogEntriesQuery(USER_Id);
  const [addLogEntry] = useAddLogEntryMutation();

  const {
    date,
    checkedPeaks,
    stats: { elevation, distance, hours, minutes },
    rating,
    notes,
  } = useAppSelector((state) => state.newEntry);

  const dispatch = useAppDispatch();

  const handleAdd = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!date) {
      alert("Please enter a complete date in the format MM-DD-YYY");
      return;
    }
    if (
      +date.slice(0, 4) < 1900 ||
      new Date(date).getTime() > new Date().getTime()
    ) {
      alert(`Please enter a date between 01-01-1900 and today`);
      return;
    }
    if (checkedPeaks.length === 0) {
      alert("Please choose at least one peak from a list");
      return;
    }
    const logId = setLogEntryId(allLogEntries);
    const newEntry: ILogEntry = {
      logId,
      peakIds: checkedPeaks,
      stats: {
        elevation,
        distance,
        minutes,
        hours,
      },
      notes: notes,
      rating: rating || "",
      date,
    };
    addLogEntry({ userId: USER_Id, newEntry });
    navigate(`/log/${logId}`);
    dispatch(resetForm());
  };

  return { handleAdd };
};
