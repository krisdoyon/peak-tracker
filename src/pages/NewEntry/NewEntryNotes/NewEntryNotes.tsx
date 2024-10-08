import styles from "./NewEntryNotes.module.scss";
import formStyles from "../NewEntry.module.scss";
import sprite from "assets/img/sprite.svg";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { updateNotes } from "features/newEntrySlice";
import { TripType } from "../NewEntryType/NewEntryType";

export const NewEntryNotes = () => {
  const dispatch = useAppDispatch();
  const { tripType, notes } = useAppSelector((state) => state.newEntry);

  const placeholder =
    tripType === TripType.COMPLETED
      ? "Record details about the weather, wildlife, trail conditions or anything else!"
      : "Add notes for your upcoming trip plans!";

  return (
    <div className={formStyles.row}>
      <div className={formStyles["heading-wrapper"]}>
        <svg className={formStyles.icon}>
          <use href={`${sprite}#icon-pencil`}></use>
        </svg>
        <label htmlFor="notes" className={formStyles["label-primary"]}>
          Notes
        </label>
      </div>

      <textarea
        id="notes"
        name="notes"
        className={styles.notes}
        placeholder={placeholder}
        onChange={(e) => dispatch(updateNotes(e.target.value))}
        value={notes}
      ></textarea>
    </div>
  );
};
