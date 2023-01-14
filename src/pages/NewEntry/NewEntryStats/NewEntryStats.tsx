import styles from "./NewEntryStats.module.scss";
import formStyles from "../NewEntry.module.scss";
import { IconButton } from "components/Buttons";
import sprite from "assets/img/sprite.svg";
import { useState } from "react";
import {
  NewEntryActionKind,
  useNewEntryContext,
} from "context/newEntryContext";

export const NewEntryStats = () => {
  const [elevationOpen, setElevationOpen] = useState<boolean>(false);
  const [distanceOpen, setDistanceOpen] = useState<boolean>(false);
  const [timeOpen, setTimeOpen] = useState<boolean>(false);

  const {
    state: { elevation, distance, hours, minutes },
    dispatch,
  } = useNewEntryContext();

  return (
    <div className={formStyles.row}>
      <div className={formStyles["heading-wrapper"]}>
        <svg className={formStyles.icon}>
          <use href={`${sprite}#icon-chart`}></use>
        </svg>
        <h3 className={formStyles.heading}>Add stats</h3>
      </div>
      <div className={styles["stats-grid"]}>
        <label htmlFor="elevation" className={formStyles["label-secondary"]}>
          Elevation:
        </label>
        <IconButton
          icon={elevationOpen ? "remove" : "add"}
          className={styles["btn-stat"]}
          aria-label="Toggle elevation input"
          onClick={(e) => {
            e.preventDefault();
            setElevationOpen(!elevationOpen);
          }}
        ></IconButton>
        {elevationOpen && (
          <div className={styles["stat-row"]}>
            <input
              id="elevation"
              name="elevation"
              min="0"
              max="99999"
              type="number"
              onChange={(e) => {
                dispatch({
                  type: NewEntryActionKind.SET_ELEVATION,
                  payload: +e.target.value,
                });
              }}
            />
            <span>ft</span>
          </div>
        )}
        <label htmlFor="distance" className={formStyles["label-secondary"]}>
          Distance:
        </label>
        <IconButton
          icon={distanceOpen ? "remove" : "add"}
          className={styles["btn-stat"]}
          aria-label="Toggle distance input"
          onClick={(e) => {
            e.preventDefault();
            setDistanceOpen(!distanceOpen);
          }}
        ></IconButton>
        {distanceOpen && (
          <div className={styles["stat-row"]}>
            <input
              id="distance"
              name="distance"
              min="0"
              max="9999"
              type="number"
              step="0.01"
            />
            <span>mi</span>
          </div>
        )}
        <label className={formStyles["label-secondary"]}>Time:</label>
        <IconButton
          icon={timeOpen ? "remove" : "add"}
          className={styles["btn-stat"]}
          aria-label="Toggle time input"
          onClick={(e) => {
            e.preventDefault();
            setTimeOpen(!timeOpen);
          }}
        ></IconButton>
        {timeOpen && (
          <div className={styles["stat-row"]}>
            <input id="hours" name="hours" min="0" max="99" type="number" />
            <span>hrs</span>
            <input id="minutes" name="minutes" min="0" max="59" type="number" />
            <span>min</span>
          </div>
        )}
      </div>
    </div>
  );
};
