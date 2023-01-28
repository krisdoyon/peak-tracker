import {
  NewEntryActionType,
  useNewEntryContext,
} from "context/newEntryContext";
import {
  useAddLogEntryMutation,
  useGetLogEntriesQuery,
} from "features/apiSlice";
import { ILogEntry } from "models/interfaces";
import { useNavigate } from "react-router-dom";
import { getLogStats, setLogEntryId } from "utils/peakUtils";

const USER_ID = "abc123";

export const useAddLogEntry = () => {
  const navigate = useNavigate();
  const { data: allLogEntries = [] } = useGetLogEntriesQuery(USER_ID);
  const [addLogEntry] = useAddLogEntryMutation();
  const {
    state: {
      distance,
      elevation,
      hours,
      minutes,
      checkedPeaks,
      rating,
      notes,
      date,
    },
    dispatch: newEntryDispatch,
  } = useNewEntryContext();

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
    const logID = setLogEntryId(allLogEntries);
    const { time, avgElevation, avgSpeed } = getLogStats({
      distance,
      elevation,
      hours,
      minutes,
    });
    const newEntry: ILogEntry = {
      logID,
      peakIds: checkedPeaks,
      stats: {
        elevation,
        distance,
        minutes,
        hours,
        time,
        avgSpeed,
        avgElevation,
      },
      notes: notes,
      rating: rating || "",
      date: new Intl.DateTimeFormat("en-CA", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      }).format(new Date(`${date}T00:00`)),
    };
    addLogEntry({ userId: USER_ID, newEntry });
    navigate(`/log/${logID}`);
    newEntryDispatch({ type: NewEntryActionType.RESET_FORM });
  };

  return { handleAdd };
};
