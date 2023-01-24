import styles from "./PeakMarker.module.scss";
import mtnIconGreen from "assets/img/mtn-icon-green.png";
import mtnIconRed from "assets/img/mtn-icon-red.png";
import { LogTripButton } from "components/Buttons";
import { usePeak } from "hooks/usePeak";
import { useMapContext } from "context/mapContext";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

interface Props {
  peakID: number;
}

export const PeakMarker = ({ peakID }: Props) => {
  const {
    state: { listID },
  } = useMapContext();

  const { peak, isCompleted, completedDate } = usePeak(peakID);

  const icon = new L.Icon({
    iconUrl: isCompleted ? mtnIconGreen : mtnIconRed,
    iconSize: [25, 20],
  });

  if (peak) {
    return (
      <Marker
        key={peak.id}
        position={[peak.lat, peak.long]}
        icon={icon}
        eventHandlers={{
          mouseover: (e) => e.target.openPopup(),
          click: (e) => e.target.openPopup(),
        }}
      >
        <Popup>
          <div className={styles["peak-popup"]}>
            <span className={styles.name}>{peak.name}</span>
            <span className={styles.elevation}>
              {`${peak.elevation.toLocaleString()} ft.`}
            </span>
            {isCompleted ? (
              <span className={styles.date}>
                <strong>Hiked On:</strong>
                <br />
                {completedDate}
              </span>
            ) : (
              <LogTripButton listID={listID} peakID={peak.id} />
            )}
          </div>
        </Popup>
      </Marker>
    );
  }
  return <></>;
};
