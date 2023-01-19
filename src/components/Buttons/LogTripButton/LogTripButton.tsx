import {
  NewEntryActionKind,
  useNewEntryContext,
} from "context/newEntryContext";
import { useNavigate } from "react-router-dom";
import { TextButton } from "../TextButton/TextButton";

interface Props {
  listID: string;
  peakID: number;
}

export const LogTripButton = ({ listID, peakID }: Props) => {
  const { dispatch } = useNewEntryContext();
  const navigate = useNavigate();

  const handleLogTrip = () => {
    dispatch({
      type: NewEntryActionKind.TOGGLE_CHECKED_PEAK,
      payload: { checked: true, peakID },
    });
    dispatch({
      type: NewEntryActionKind.SET_LIST_ID,
      payload: listID,
    });
    navigate("/new-entry");
  };

  return (
    <TextButton color="green" onClick={handleLogTrip}>
      Log trip
    </TextButton>
  );
};