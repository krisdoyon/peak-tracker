import { toggleCheckedPeak, updateListId } from "features/newEntrySlice";
import { useAppDispatch } from "hooks/reduxHooks";
import { useNavigate } from "react-router-dom";
import { TextButton } from "../TextButton/TextButton";

interface Props {
  listId: string;
  peakId: number;
}

export const LogTripButton = ({ listId, peakId }: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogTrip = () => {
    dispatch(toggleCheckedPeak({ peakId, checked: true }));
    dispatch(updateListId(listId));
    navigate("/new-entry");
  };

  return (
    <TextButton color="green" onClick={handleLogTrip}>
      Log trip
    </TextButton>
  );
};
