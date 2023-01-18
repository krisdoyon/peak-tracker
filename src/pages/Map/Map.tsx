import styles from "./Map.module.scss";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  ZoomControl,
} from "react-leaflet";
import { useMapContext } from "context/mapContext";
import mtnIconGreen from "assets/img/mtn-icon-green.png";
import mtnIconRed from "assets/img/mtn-icon-red.png";
import L from "leaflet";
import { usePeakListContext } from "context/peakListContext";

export const Map = () => {
  const {
    state: { peaks },
  } = useMapContext();

  const { isPeakCompleted } = usePeakListContext();

  return (
    <MapContainer
      center={[39.402244340292775, -108.45703125000001]}
      zoom={4}
      scrollWheelZoom={true}
      className={styles.map}
    >
      <ZoomControl position="bottomright" />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {peaks.map((peak) => {
        const isCompleted = isPeakCompleted(peak.id);
        const icon = new L.Icon({
          iconUrl: isCompleted ? mtnIconGreen : mtnIconRed,
          iconSize: [25, 20],
        });

        return (
          <Marker
            key={peak.id}
            position={[peak.lat, peak.long]}
            icon={icon}
            // iconUrl={peak.completed ? mtnIconGreen : mtnIconRed}
          />
        );
      })}
      {/* <Marker position={[51.505, -0.09]} icon={}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker> */}
    </MapContainer>
  );
};
