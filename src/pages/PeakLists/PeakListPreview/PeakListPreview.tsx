import styles from "components/PreviewList/PreviewListItem/PreviewListItem.module.scss";
import { PreviewListItem } from "components/PreviewList";
import { IconButton, ViewButton } from "components/Buttons";
import { ProgressBar } from "components/ProgressBar/ProgressBar";
import {
  PeakListActionType,
  usePeakListContext,
} from "context/peakListContext";
import { useNavigate } from "react-router-dom";
import { MapActionType, useMapContext } from "context/mapContext";

interface Props {
  title: string;
  numCompleted: number;
  peakCount: number;
  listID: string;
}

export const PeakListPreview = ({
  title,
  numCompleted,
  peakCount,
  listID,
}: Props) => {
  const {
    state: { savedListIds },
    dispatch,
    getPeakListById,
  } = usePeakListContext();

  const { dispatch: mapDispatch } = useMapContext();

  const navigate = useNavigate();

  const isSaved = savedListIds.some((savedID) => savedID === listID);

  const onViewClick = () => {
    const peaksArr = getPeakListById(listID)?.peaks;
    mapDispatch({ type: MapActionType.PLOT_PEAKS, payload: peaksArr });
    navigate(`/peak-lists/${listID}`);
  };

  return (
    <PreviewListItem>
      <IconButton
        icon={isSaved ? "remove" : "add"}
        onClick={() =>
          dispatch({
            type: PeakListActionType.TOGGLE_SAVED_LIST,
            payload: listID,
          })
        }
      ></IconButton>
      <div className={styles.info}>
        <h2 className={styles.heading}>
          <strong>{title}</strong>
        </h2>
        <span>{`${numCompleted} of ${peakCount} peaks`}</span>
        <ProgressBar numCompleted={numCompleted} peakCount={peakCount} />
      </div>
      <ViewButton onClick={onViewClick} />
    </PreviewListItem>
  );
};
