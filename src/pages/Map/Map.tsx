import styles from "./Map.module.scss";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { PeakLayer } from "./PeakLayer/PeakLayer";

export const Map = () => {
  return (
    <MapContainer
      center={[39.402244340292775, -108.45703125000001]}
      zoom={4}
      scrollWheelZoom={true}
      className={styles.map}
    >
      <ZoomControl position="bottomright" />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <PeakLayer />
    </MapContainer>
  );
};
