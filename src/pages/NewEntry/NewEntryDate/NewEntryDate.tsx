import styles from "./NewEntryDate.module.scss";
import formStyles from "../NewEntry.module.scss";
import { Button } from "components/Buttons";
import sprite from "assets/img/sprite.svg";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { updateDate } from "features/newEntrySlice";

export const NewEntryDate = () => {
  const { date } = useAppSelector((state) => state.newEntry);
  const dispatch = useAppDispatch();
  const dateOptions = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  } as const;

  const setDate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const day = (e.target as HTMLElement).textContent?.toLowerCase();
    const now = new Date().getTime();
    if (day === "today") {
      const date = new Intl.DateTimeFormat("en-CA", dateOptions).format(now);
      dispatch(updateDate(date));
    }
    if (day === "yesterday") {
      const date = new Intl.DateTimeFormat("en-CA", dateOptions).format(
        now - 86400000
      );
      dispatch(updateDate(date));
    }
  };

  return (
    <div className={formStyles.row}>
      <div className={formStyles["heading-wrapper"]}>
        <svg className={formStyles.icon}>
          <use href={`${sprite}#icon-calendar`}></use>
        </svg>
        <label htmlFor="date" className={formStyles["label-primary"]}>
          When did you go?
        </label>
      </div>

      <div className={styles["date-grid"]}>
        <input
          id="date"
          name="date"
          type="date"
          onChange={(e) => {
            dispatch(updateDate(e.target.value));
          }}
          value={date}
          required
        />
        <Button
          className={`${styles["btn-date"]} ${styles["btn-today"]}`}
          onClick={setDate}
        >
          Today
        </Button>
        <Button className={styles["btn-date"]} onClick={setDate}>
          Yesterday
        </Button>
      </div>
    </div>
  );
};
