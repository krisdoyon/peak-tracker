import styles from "./PreviewListItem.module.scss";
import { Button, IconButton } from "components/Buttons";
import { ProgressBar } from "components/ProgressBar/ProgressBar";

interface Props {
  variant: "peak-list" | "log-entry";
  heading: string;
  peakCount: number;
  numCompleted?: number;
}

export const PreviewListItem = (props: Props) => {
  if (props.variant === "peak-list") {
    const { peakCount, numCompleted, heading } = props;
    return (
      <li className={styles.item}>
        <IconButton icon="add"></IconButton>
        <div className={styles.info}>
          <h2 className={styles.heading}>
            <strong>{heading}</strong>
          </h2>
          <span>{`${numCompleted} of ${peakCount} peaks`}</span>
          <ProgressBar numCompleted={numCompleted!} peakCount={peakCount} />
        </div>
        <Button variant="view" />
      </li>
    );
  }

  if (props.variant === "log-entry") {
    const { peakCount } = props;
    return <li className={styles.item}></li>;
  }

  return <></>;
};
