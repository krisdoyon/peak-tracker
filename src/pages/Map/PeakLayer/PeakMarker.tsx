import styles from "./PeakMarker.module.scss";
import mtnIconGreen from "assets/img/mtn-icon-green.png";
import mtnIconRed from "assets/img/mtn-icon-red.png";
import { LogTripButton } from "components/Buttons";
import { usePeak } from "hooks/usePeak";
import { useMapContext } from "context/mapContext";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { IPeak } from "models/interfaces";
import { getCompletedDate, isPeakCompleted } from "utils/peakUtils";
import { useGetLogEntriesQuery } from "features/apiSlice";
import { useEffect, useRef } from "react";

const USER_ID = "abc123";

export const PeakMarker = ({ id, lat, long, name, elevation }: IPeak) => {
  const {
    state: { listID, openPopupId },
  } = useMapContext();

  const ref = useRef<L.Marker | null>(null);

  const { data: allLogEntries = [] } = useGetLogEntriesQuery(USER_ID);
  const isCompleted = isPeakCompleted(id, allLogEntries);
  const completedDate = getCompletedDate(id, allLogEntries);

  const icon = new L.Icon({
    iconUrl: isCompleted ? mtnIconGreen : mtnIconRed,
    iconSize: [25, 20],
  });

  useEffect(() => {
    if (openPopupId === id) {
      ref.current?.openPopup();
    }
    if (openPopupId === null) {
      ref.current?.closePopup();
    }
  }, [openPopupId]);

  return (
    <Marker
      key={id}
      position={[lat, long]}
      icon={icon}
      ref={ref}
      eventHandlers={{
        mouseover: (e) => e.target.openPopup(),
        click: (e) => e.target.openPopup(),
      }}
    >
      <Popup>
        <div className={styles["peak-popup"]}>
          <span className={styles.name}>{name}</span>
          <span className={styles.elevation}>
            {`${elevation.toLocaleString()} ft.`}
          </span>
          {isCompleted ? (
            <span className={styles.date}>
              <strong>Hiked On:</strong>
              <br />
              {completedDate}
            </span>
          ) : (
            <LogTripButton listID={listID} peakID={id} />
          )}
        </div>
      </Popup>
    </Marker>
  );
};
