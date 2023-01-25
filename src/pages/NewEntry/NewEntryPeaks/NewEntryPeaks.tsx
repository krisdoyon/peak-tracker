import styles from "./NewEntryPeaks.module.scss";
import formStyles from "../NewEntry.module.scss";
import sprite from "assets/img/sprite.svg";
import { useEffect } from "react";
import {
  NewEntryActionType,
  useNewEntryContext,
} from "context/newEntryContext";
import { sortPeaks, SortType } from "utils/sortPeaks";
import { MapActionType, useMapContext } from "context/mapContext";
import { usePeakList } from "hooks/usePeakList";
import { useGetListsQuery } from "features/apiSlice";

export const NewEntryPeaks = () => {
  const {
    state: { listID, checkedPeaks },
    dispatch,
  } = useNewEntryContext();
  const { dispatch: mapDispatch } = useMapContext();

  const { data: allPeakLists = [] } = useGetListsQuery();
  const { data: peakList } = usePeakList(listID);

  const sortedPeaks = sortPeaks(peakList?.peaks, SortType.NAME);

  useEffect(() => {
    if (listID && peakList) {
      mapDispatch({ type: MapActionType.SET_LIST_ID, payload: listID });
      mapDispatch({
        type: MapActionType.SET_PEAK_IDS,
        payload: peakList.peaks.map((peak) => peak.id),
      });
    }
  }, [listID, peakList]);

  const handleListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: NewEntryActionType.SET_LIST_ID,
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

      {sortedPeaks.length > 0 && (
        <ul className={styles["checkbox-grid"]}>
          {sortedPeaks.map((peak) => {
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
                        type: NewEntryActionType.TOGGLE_CHECKED_PEAK,
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
