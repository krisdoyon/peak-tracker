import { useMapContext } from "context/mapContext";
import { useEffect, useRef } from "react";
import { FeatureGroup, useMap } from "react-leaflet";
import L from "leaflet";
import { useGetListsQuery } from "features/apiSlice";
import { PeakMarker } from "./PeakMarker";

export const PeakLayer = () => {
  const {
    state: { peaks },
  } = useMapContext();

  const map = useMap();

  const { isLoading } = useGetListsQuery();

  useEffect(() => {
    if (peaks.length > 0 && featureGroupRef.current && !isLoading) {
      const padding = window.matchMedia("(max-width: 800px)").matches
        ? new L.Point(0, 0)
        : new L.Point(650, 0);
      map.fitBounds(featureGroupRef.current.getBounds(), {
        paddingTopLeft: padding,
        maxZoom: 10,
      });
    }
  }, [peaks, isLoading]);

  const featureGroupRef = useRef<L.FeatureGroup | null>(null);

  return (
    <FeatureGroup ref={featureGroupRef}>
      {peaks.length > 0 &&
        !isLoading &&
        peaks.map((peak) => {
          return <PeakMarker key={peak.id} {...peak} />;
        })}
    </FeatureGroup>
  );
};
