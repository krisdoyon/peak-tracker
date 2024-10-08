import {
  useAddLogEntryMutation,
  useGetLogEntriesQuery,
} from "features/apiSlice";
import { resetForm } from "features/newEntrySlice";
import { ILogEntry } from "models/interfaces";
import { setLogEntryId } from "utils/peakUtils";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { useNavigate } from "react-router-dom";
import { TripType } from "pages/NewEntry/NewEntryType/NewEntryType";

export const useAddLogEntry = () => {
  const { userId, isLoggedIn, token } = useAppSelector((state) => state.auth);

  const navigate = useNavigate();
  const { data: allLogEntries = [] } = useGetLogEntriesQuery(
    { userId, token },
    { skip: userId === null || !isLoggedIn || token === null }
  );

  const [addLogEntry] = useAddLogEntryMutation();

  const {
    tripType,
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
    if (tripType === TripType.COMPLETED) {
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
      tripType,
    };
    addLogEntry({ userId, newEntry, token });
    dispatch(resetForm());
    if (tripType === TripType.COMPLETED) {
      navigate(`/log/${logId}`);
    } else if (tripType === TripType.PLANNED) {
      navigate(`/planner/${logId}`);
    }
  };

  return { handleAdd };
};
