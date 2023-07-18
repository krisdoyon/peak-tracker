import {
  useAddLogEntryMutation,
  useGetLogEntriesQuery,
} from "features/apiSlice";
import { resetForm } from "features/newEntrySlice";
import { ILogEntry } from "models/interfaces";
import { getLogStats, setLogEntryId } from "utils/peakUtils";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { useAppNavigate } from "./useAppNaviage";
import { useNavigate } from "react-router-dom";

export const useAddLogEntry = () => {
  const { userId, isLoggedIn, token } = useAppSelector((state) => state.auth);

  const navigate = useNavigate();
  const { data: allLogEntries = [] } = useGetLogEntriesQuery(
    { userId, token },
    { skip: userId === null || !isLoggedIn || token === null }
  );

  const [addLogEntry] = useAddLogEntryMutation();

  const {
    date,
    checkedPeaks,
    stats: { elevation, distance, hours, minutes },
    rating,
    notes,
    isEditing,
    editLogId,
  } = useAppSelector((state) => state.newEntry);

  const dispatch = useAppDispatch();

  const handleAdd = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userId === null || !isLoggedIn || token === null) {
      alert("You must be logged in to add a new entry.");
      return;
    }
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
    const logId =
      isEditing && editLogId
        ? editLogId.toString()
        : setLogEntryId(allLogEntries);

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
    addLogEntry({ userId, newEntry, token });
    dispatch(resetForm());
    navigate(`/log/${logId}`);
  };

  return { handleAdd };
};
