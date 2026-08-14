import styles from "./NewEntryStats.module.scss";
import formStyles from "../NewEntry.module.scss";
import { IconButton } from "components/Buttons";
import sprite from "assets/img/sprite.svg";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { toggleStatOpen, updateStat } from "features/newEntrySlice";

export const NewEntryStats = () => {
  const { isStatOpen, stats } = useAppSelector((state) => state.newEntry);

  const dispatch = useAppDispatch();

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
          icon={isStatOpen.elevation ? "remove" : "add"}
          className={styles["btn-stat"]}
          aria-label="Toggle elevation input"
          onClick={(e) => {
            e.preventDefault();
            dispatch(toggleStatOpen("elevation"));
          }}
        ></IconButton>
        {isStatOpen.elevation && (
          <div className={styles["stat-row"]}>
            <input
              id="elevation"
              name="elevation"
              min="0"
              max="99999"
              type="number"
              onChange={(e) =>
                dispatch(
                  updateStat({
                    stat: "elevation",
                    value: e.target.valueAsNumber,
                  })
                )
              }
              value={stats.elevation}
            />
            <span>ft</span>
          </div>
        )}
        <label htmlFor="distance" className={formStyles["label-secondary"]}>
          Distance:
        </label>
        <IconButton
          icon={isStatOpen.distance ? "remove" : "add"}
          className={styles["btn-stat"]}
          aria-label="Toggle distance input"
          onClick={(e) => {
            e.preventDefault();
            dispatch(toggleStatOpen("distance"));
          }}
        ></IconButton>
        {isStatOpen.distance && (
          <div className={styles["stat-row"]}>
            <input
              id="distance"
              name="distance"
              min="0"
              max="9999"
              type="number"
              step="0.01"
              onChange={(e) =>
                dispatch(
                  updateStat({
                    stat: "distance",
                    value: e.target.valueAsNumber,
                  })
                )
              }
              value={stats.distance}
            />
            <span>mi</span>
          </div>
        )}
        <label className={formStyles["label-secondary"]}>Time:</label>
        <IconButton
          icon={isStatOpen.time ? "remove" : "add"}
          className={styles["btn-stat"]}
          aria-label="Toggle time input"
          onClick={(e) => {
            e.preventDefault();
            dispatch(toggleStatOpen("time"));
          }}
        ></IconButton>
        {isStatOpen.time && (
          <div className={styles["stat-row"]}>
            <input
              id="hours"
              name="hours"
              min="0"
              max="99"
              type="number"
              onChange={(e) =>
                dispatch(
                  updateStat({
                    stat: "hours",
                    value: e.target.valueAsNumber,
                  })
                )
              }
              value={stats.hours}
            />
            <span>hrs</span>
            <input
              id="minutes"
              name="minutes"
              min="0"
              max="59"
              type="number"
              onChange={(e) =>
                dispatch(
                  updateStat({
                    stat: "minutes",
                    value: e.target.valueAsNumber,
                  })
                )
              }
              value={stats.minutes}
            />
            <span>min</span>
          </div>
        )}
      </div>
    </div>
  );
};
