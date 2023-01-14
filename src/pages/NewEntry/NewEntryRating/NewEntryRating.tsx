import styles from "./NewEntryRating.module.scss";
import formStyles from "../NewEntry.module.scss";
import sprite from "assets/img/sprite.svg";
import { useState } from "react";

export const NewEntryRating = () => {
  const [starNumHover, setStarNumHover] = useState(0);
  const [rating, setRating] = useState(0);

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
                starNumHover >= i + 1 ? styles.full : ""
              }`}
              onMouseOver={() => {
                setStarNumHover(i + 1);
              }}
              onMouseOut={() => {
                setStarNumHover(rating);
              }}
              onClick={(e) => {
                e.preventDefault();
                setRating(i + 1);
              }}
            >
              <svg className={styles["star-icon"]}>
                <use
                  href={`${sprite}${
                    starNumHover >= i + 1 ? "#icon-star-solid" : "#icon-star"
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
