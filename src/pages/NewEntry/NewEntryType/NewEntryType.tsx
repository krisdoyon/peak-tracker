import styles from "./NewEntryType.module.scss";
import formStyles from "../NewEntry.module.scss";
// import sprite from "assets/img/sprite.svg";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { updateDate, updateTripType } from "features/newEntrySlice";

export enum TripType {
  COMPLETED = "Completed",
  PLANNED = "Planned",
}

export const NewEntryType = () => {
  const dispatch = useAppDispatch();
  const { tripType } = useAppSelector((state) => state.newEntry);

  const handleTripTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTripType = e.target.value as TripType;

    if (newTripType === TripType.PLANNED) {
      dispatch(updateDate(""));
    }

    dispatch(updateTripType(newTripType));
  };
  return (
    <div className={formStyles.row}>
      <div className={styles.grid}>
        <label
          htmlFor="choose-trip-type-new-entry"
          className={formStyles["label-secondary"]}
        >
          Is this a planned or completed trip?
        </label>
        <select
          id="choose-trip-type-new-entry"
          onChange={handleTripTypeChange}
          value={tripType}
        >
          {Object.values(TripType).map((type) => {
            return (
              <option key={type} value={type}>
                {type}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};
