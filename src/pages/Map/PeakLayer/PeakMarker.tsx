import styles from "./PeakMarker.module.scss";
import mtnIconGreen from "assets/img/mtn-icon-green.png";
import mtnIconRed from "assets/img/mtn-icon-red.png";
import { LogTripButton } from "components/Buttons";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { IPeak } from "models/interfaces";
import { getCompletedDate, isPeakCompleted } from "utils/peakUtils";
import { useGetLogEntriesQuery } from "features/apiSlice";
import React, { useEffect, useRef } from "react";
import { useAppSelector } from "hooks/reduxHooks";
import { TripType } from "pages/NewEntry/NewEntryType/NewEntryType";

interface Props extends IPeak {
  isPopupOpen: boolean;
}

export const PeakMarker = React.memo(
  ({ id, lat, long, name, elevation, isPopupOpen }: Props) => {
    const listId = useAppSelector((state) => state.map.listId);
    const { userId, token, isLoggedIn } = useAppSelector((state) => state.auth);

    const ref = useRef<L.Marker | null>(null);

    const { data: allLogEntries = [] } = useGetLogEntriesQuery(
      { userId, token, tripType: TripType.COMPLETED },
      { skip: userId === null || !isLoggedIn || token === null }
    );
    const isCompleted = isPeakCompleted(id, allLogEntries);
    const completedDate = getCompletedDate(id, allLogEntries);

    const icon = new L.Icon({
      iconUrl: isCompleted ? mtnIconGreen : mtnIconRed,
      iconSize: [25, 20],
    });

    useEffect(() => {
      if (isPopupOpen) {
        ref.current?.openPopup();
      } else {
        ref.current?.closePopup();
      }
    }, [isPopupOpen]);

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
              <LogTripButton listId={listId || ""} peakId={id} />
            )}
          </div>
        </Popup>
      </Marker>
    );
  }
);
