import styles from "./NewEntryPeaks.module.scss";
import formStyles from "../NewEntry.module.scss";
import sprite from "assets/img/sprite.svg";
import { useEffect } from "react";
import { sortPeaks, SortType } from "utils/sortPeaks";
import { usePeakList } from "hooks/usePeakList";
import { useGetListsQuery } from "features/apiSlice";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { closePopup, openPopup, plotList } from "features/mapSlice";
import { toggleCheckedPeak, updateListId } from "features/newEntrySlice";

export const NewEntryPeaks = () => {
  const dispatch = useAppDispatch();
  const { listId, checkedPeaks } = useAppSelector((state) => state.newEntry);
  const { data: allPeakLists = [] } = useGetListsQuery();
  const { data: peakList } = usePeakList(listId);

  const sortedPeaks = sortPeaks(peakList?.peaks, SortType.NAME);

  useEffect(() => {
    if (listId && peakList) {
      dispatch(plotList({ listId, peaks: peakList.peaks }));
    }
  }, [listId, peakList]);

  const handleListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateListId(e.target.value));
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
          value={listId}
        >
          <option value="" disabled>
            Choose a list
          </option>
          {allPeakLists.map((list) => {
            return (
              <option key={list.listId} value={list.listId}>
                {list.title}
              </option>
            );
          })}
        </select>
      </div>

      {sortedPeaks.length > 0 && (
        <ul className={styles["checkbox-grid"]}>
          {sortedPeaks.map((peak) => {
            const isChecked = checkedPeaks.some((peakId) => peakId === peak.id);
            return (
              <li
                key={peak.id}
                onMouseEnter={() => dispatch(openPopup(peak.id))}
                onMouseLeave={() => dispatch(closePopup())}
              >
                <label className={styles["checkbox-container"]}>
                  {peak.name}
                  <input
                    type="checkbox"
                    value={peak.id}
                    onChange={(e) =>
                      dispatch(
                        toggleCheckedPeak({
                          peakId: peak.id,
                          checked: e.target.checked,
                        })
                      )
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
