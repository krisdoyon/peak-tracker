import styles from "./NewEntryPeaks.module.scss";
import formStyles from "../NewEntry.module.scss";
import sprite from "assets/img/sprite.svg";
import { usePeakListContext } from "context/peakListContext";
import { useEffect, useState } from "react";
import { IPeak } from "models/interfaces";
import {
  NewEntryActionKind,
  useNewEntryContext,
} from "context/newEntryContext";
import { sortPeaks, SortType } from "utils/sortPeaks";

export const NewEntryPeaks = () => {
  const { allPeakLists, getPeakListById } = usePeakListContext();
  const [peaks, setPeaks] = useState<IPeak[]>([]);
  const {
    state: { listID, checkedPeaks },
    dispatch,
  } = useNewEntryContext();

  useEffect(() => {
    const listMatch = getPeakListById(listID);
    if (listMatch) {
      const sortedPeaks = sortPeaks(listMatch.peaks, SortType.NAME);
      setPeaks(sortedPeaks);
    }
  }, [listID]);

  // const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.checked) {
  //     setCheckedPeaks([...checkedPeaks, +e.target.value]);
  //   } else {
  //     setCheckedPeaks((prevCheckedPeaks) =>
  //       prevCheckedPeaks.filter((peakID) => peakID !== +e.target.value)
  //     );
  //   }
  // };

  return (
    <div className={formStyles.row}>
      <div className={formStyles["heading-wrapper"]}>
        <svg className={formStyles.icon}>
          <use href={`${sprite}#icon-mountain`}></use>
        </svg>
        <h3 className={formStyles.heading}>Add peaks</h3>
      </div>

      <div className={styles.grid}>
        <label
          htmlFor="choose-list-new-entry"
          className={formStyles["label-secondary"]}
        >
          Choose a peak list:
        </label>
        <select
          id="choose-list-new-entry"
          onChange={(e) => {
            dispatch({
              type: NewEntryActionKind.SET_LIST_ID,
              payload: e.target.value,
            });
          }}
          value={listID}
        >
          <option value="" disabled>
            Choose a list
          </option>
          {allPeakLists.map((list) => {
            return (
              <option key={list.listID} value={list.listID}>
                {list.title}
              </option>
            );
          })}
        </select>
      </div>

      {peaks.length > 0 && (
        <ul className={styles["checkbox-grid"]}>
          {peaks.map((peak) => {
            // const isChecked = checkedPeaks.some((peakID) => peakID === peak.id);
            return (
              <li key={peak.id}>
                <label className={styles["checkbox-container"]}>
                  {peak.name}
                  <input
                    type="checkbox"
                    value={peak.id}
                    // onChange={handleCheck}
                    // checked={isChecked}
                  />
                  <span className={styles.checkmark}></span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
