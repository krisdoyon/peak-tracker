import styles from "./PeakLayer.module.scss";
import { useMapContext } from "context/mapContext";
import { useEffect, useRef } from "react";
import { FeatureGroup, Marker, useMap, Popup } from "react-leaflet";
import L from "leaflet";
import { usePeakListContext } from "context/peakListContext";
import mtnIconGreen from "assets/img/mtn-icon-green.png";
import mtnIconRed from "assets/img/mtn-icon-red.png";
import { useLogContext } from "context/logContext";
import { LogTripButton } from "components/Buttons";

export const PeakLayer = () => {
  console.log("render");
  const {
    state: { peaks, listID },
  } = useMapContext();

  const map = useMap();

  useEffect(() => {
    if (peaks.length > 0 && featureGroupRef.current) {
      const padding = window.matchMedia("(max-width: 800px)").matches
        ? new L.Point(0, 0)
        : new L.Point(650, 0);
      map.fitBounds(featureGroupRef.current.getBounds(), {
        paddingTopLeft: padding,
        maxZoom: 10,
      });
    }
  }, [peaks]);

  const featureGroupRef = useRef<L.FeatureGroup | null>(null);

  const { isPeakCompleted } = usePeakListContext();
  const { getCompletedDate } = useLogContext();
  return (
    <FeatureGroup ref={featureGroupRef}>
      {peaks.map((peak) => {
        const isCompleted = isPeakCompleted(peak.id);
        const icon = new L.Icon({
          iconUrl: isCompleted ? mtnIconGreen : mtnIconRed,
          iconSize: [25, 20],
        });
        let completedDate;
        if (isCompleted) {
          completedDate = getCompletedDate(peak.id);
        }

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
      })}
    </FeatureGroup>
  );
};
