import styles from "./ProgressBar.module.scss";

interface Props {
  peakCount: number;
  numCompleted: number;
}

export const ProgressBar = ({ peakCount, numCompleted }: Props) => {
  const width = (numCompleted / peakCount) * 100;
  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>{`${Math.round(width * 10) / 10}%`}</div>
      <div className={styles.progress} style={{ width: `${width}%` }}></div>
    </div>
  );
};
