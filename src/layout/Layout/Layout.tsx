import { Outlet } from "react-router-dom";
import { Sidebar } from "layout/Sidebar/Sidebar";
import { Logo } from "components/Logo/Logo";
import { Map } from "pages/Map/Map";
import { LoadTestButton } from "./loadTestButton";
import { useGetListsQuery } from "features/apiSlice";
import { getAllUniquePeaks } from "utils/peakUtils";
import { Button } from "components/Buttons";
import { MapActionType, useMapContext } from "context/mapContext";

export const PlotAllButton = () => {
  const { data: allPeakLists = [] } = useGetListsQuery();
  const allPeaks = getAllUniquePeaks(allPeakLists);
  const { dispatch } = useMapContext();

  return (
    <Button
      style={{
        position: "absolute",
        right: "1.4rem",
        padding: "1rem 2rem",
        top: "20rem",
      }}
      onClick={() =>
        dispatch({ type: MapActionType.SET_PEAKS, payload: allPeaks })
      }
    >
      PLOT ALL
    </Button>
  );
};

export const Layout = () => {
  return (
    <main>
      <Logo />
      <Map />
      <LoadTestButton />
      <PlotAllButton />
      <Sidebar />
      <Outlet />
    </main>
  );
};
