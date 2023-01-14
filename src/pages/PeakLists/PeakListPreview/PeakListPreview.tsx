import styles from "components/PreviewList/PreviewListItem/PreviewListItem.module.scss";
import { PreviewListItem } from "components/PreviewList";
import { IconButton, ViewButton } from "components/Buttons";
import { ProgressBar } from "components/ProgressBar/ProgressBar";
import { usePeakListContext } from "context/peakListContext";

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
  const { savedListIds, toggleSavedList } = usePeakListContext();
  const isSaved = savedListIds.some((savedID) => savedID === listID);

  return (
    <PreviewListItem>
      <IconButton
        icon={isSaved ? "remove" : "add"}
        onClick={() => toggleSavedList(listID)}
      ></IconButton>
      <div className={styles.info}>
        <h2 className={styles.heading}>
          <strong>{title}</strong>
        </h2>
        <span>{`${numCompleted} of ${peakCount} peaks`}</span>
        <ProgressBar numCompleted={numCompleted} peakCount={peakCount} />
      </div>
      <ViewButton to={`/peak-lists/${listID}`} />
    </PreviewListItem>
  );
};
