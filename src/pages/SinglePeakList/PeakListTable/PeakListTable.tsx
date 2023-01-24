import styles from "./PeakListTable.module.scss";
import { IPeak } from "models/interfaces";
import { PeakListTableRow } from "./PeakListTableRow";

interface Props {
  peaks: IPeak[];
  listID: string;
}

export const PeakListTable = ({ listID, peaks }: Props) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.number}>#</th>
          <th className={styles.name}>Name</th>
          <th className={styles.state}>State</th>
          <th className={styles.elevation}>Elevation (ft)</th>
          <th className={styles.date}>Hiked On</th>
        </tr>
      </thead>
      <tbody>
        {peaks.map((peak, i) => {
          return (
            <PeakListTableRow
              key={peak.id}
              num={i}
              listID={listID}
              peakID={peak.id}
            />
          );
        })}
      </tbody>
    </table>
  );
};
