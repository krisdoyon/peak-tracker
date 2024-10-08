import styles from "./ProgressBar.module.scss";

interface Props {
  peakCount: number;
  numCompleted: number;
}

export const ProgressBar = ({ peakCount, numCompleted }: Props) => {
  const width = (numCompleted / peakCount) * 100;
  const isCompleted = width === 100;

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.label} ${
          isCompleted ? styles["label-complete"] : ""
        }`}
      >{`${Math.round(width * 10) / 10}%`}</div>
      <div
        className={`${styles.progress} ${isCompleted ? styles.complete : ""}`}
        style={{ width: `${width}%` }}
      ></div>
    </div>
  );
};
