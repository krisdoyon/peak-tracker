import styles from "./NewEntryRating.module.scss";
import formStyles from "../NewEntry.module.scss";
import sprite from "assets/img/sprite.svg";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { updateFilledStar, updateRating } from "features/newEntrySlice";

export const NewEntryRating = () => {
  const { rating, filledStar } = useAppSelector((state) => state.newEntry);
  const dispatch = useAppDispatch();

  return (
    <div className={`${formStyles.row} ${styles["row-rating"]}`}>
      <div className={formStyles["heading-wrapper"]}>
        <svg className={formStyles.icon}>
          <use href={`${sprite}#icon-star-solid`}></use>
        </svg>

        <label className={formStyles.heading}>Rating</label>
      </div>
      <div className={styles["wrapper-stars"]}>
        {Array.from({ length: 5 }, (_, i) => {
          return (
            <button
              key={i}
              className={`${styles["btn-star"]} ${
                filledStar >= i + 1 ? styles.full : ""
              }`}
              onMouseOver={() => {
                dispatch(updateFilledStar(i + 1));
              }}
              onMouseOut={() => {
                dispatch(updateFilledStar(rating));
              }}
              onClick={(e) => {
                e.preventDefault();
                dispatch(updateRating(i + 1));
              }}
            >
              <svg className={styles["star-icon"]}>
                <use
                  href={`${sprite}${
                    filledStar >= i + 1 ? "#icon-star-solid" : "#icon-star"
                  }`}
                ></use>
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
};
