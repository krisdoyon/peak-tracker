import styles from "./NewEntryRating.module.scss";
import formStyles from "../NewEntry.module.scss";
import sprite from "assets/img/sprite.svg";
import {
  NewEntryActionKind,
  useNewEntryContext,
} from "context/newEntryContext";

export const NewEntryRating = () => {
  const {
    state: { rating, filledStar },
    dispatch,
  } = useNewEntryContext();

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
                dispatch({
                  type: NewEntryActionKind.SET_FILLED_STAR,
                  payload: i + 1,
                });
              }}
              onMouseOut={() => {
                dispatch({
                  type: NewEntryActionKind.SET_FILLED_STAR,
                  payload: rating,
                });
              }}
              onClick={(e) => {
                e.preventDefault();
                dispatch({
                  type: NewEntryActionKind.SET_RATING,
                  payload: i + 1,
                });
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
