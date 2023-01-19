import styles from "./NewEntryPeaks.module.scss";
import formStyles from "../NewEntry.module.scss";
import sprite from "assets/img/sprite.svg";
import { usePeakListContext } from "context/peakListContext";
import React, { useEffect, useState } from "react";
import { IPeak } from "models/interfaces";
import {
  NewEntryActionKind,
  useNewEntryContext,
} from "context/newEntryContext";
import { sortPeaks, SortType } from "utils/sortPeaks";
import { useMapContext } from "context/mapContext";

export const NewEntryPeaks = () => {
  const {
    state: { allPeakLists },
    getPeakListById,
  } = usePeakListContext();
  const [peaks, setPeaks] = useState<IPeak[]>([]);
  const {
    state: { listID, checkedPeaks },
    dispatch,
  } = useNewEntryContext();
  const { plotPeakList } = useMapContext();

  useEffect(() => {
    const listMatch = getPeakListById(listID);
    if (listMatch) {
      const sortedPeaks = sortPeaks(listMatch.peaks, SortType.NAME);
      setPeaks(sortedPeaks);
    } else {
      setPeaks([]);
    }
    if (listID) {
      plotPeakList(listID);
    }
  }, [listID]);

  const handleListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: NewEntryActionKind.SET_LIST_ID,
      payload: e.target.value,
    });
  };

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
          onChange={handleListChange}
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
            const isChecked = checkedPeaks.some((peakID) => peakID === peak.id);
            return (
              <li key={peak.id}>
                <label className={styles["checkbox-container"]}>
                  {peak.name}
                  <input
                    type="checkbox"
                    value={peak.id}
                    onChange={(e) =>
                      dispatch({
                        type: NewEntryActionKind.TOGGLE_CHECKED_PEAK,
                        payload: { checked: e.target.checked, peakID: peak.id },
                      })
                    }
                    checked={isChecked}
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
