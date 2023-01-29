import { useEffect, useRef } from "react";
import { FeatureGroup, useMap } from "react-leaflet";
import L from "leaflet";
import { useGetListsQuery } from "features/apiSlice";
import { PeakMarker } from "./PeakMarker";
import { useAppSelector } from "hooks/reduxHooks";

export const PeakLayer = () => {
  const peaks = useAppSelector((state) => state.map.peaks);
  const openPopupId = useAppSelector((state) => state.map.openPopupId);
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
          const isPopupOpen = peak.id === openPopupId;
          return (
            <PeakMarker key={peak.id} {...peak} isPopupOpen={isPopupOpen} />
          );
        })}
    </FeatureGroup>
  );
};
