import styles from "./NewEntryDate.module.scss";
import formStyles from "../NewEntry.module.scss";
import { Button } from "components/Buttons";
import sprite from "assets/img/sprite.svg";
import {
  NewEntryActionKind,
  useNewEntryContext,
} from "context/newEntryContext";

export const NewEntryDate = () => {
  const {
    state: { date },
    dispatch,
  } = useNewEntryContext();
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
      dispatch({ type: NewEntryActionKind.SET_DATE, payload: date });
    }
    if (day === "yesterday") {
      const date = new Intl.DateTimeFormat("en-CA", dateOptions).format(
        now - 86400000
      );
      dispatch({ type: NewEntryActionKind.SET_DATE, payload: date });
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
            const date = new Intl.DateTimeFormat("en-CA", dateOptions).format(
              new Date(`${e.target.value}T00:00`)
            );
            dispatch({ type: NewEntryActionKind.SET_DATE, payload: date });
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
