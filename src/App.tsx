import { Routes, Route, useParams } from "react-router-dom";
import { Layout } from "./layout/Layout/Layout";
import { PeakLists, Log, Stats, NewEntry } from "./pages";
import { SinglePeakList } from "pages/SinglePeakList/SinglePeakList";
import { SingleLogEntry } from "pages/SingleLogEntry/SingleLogEntry";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MapActionType, useMapContext } from "context/mapContext";

function App() {
  const { pathname } = useLocation();

  const { dispatch: mapDispatch } = useMapContext();

  useEffect(() => {
    if (!pathname.includes("/peak-lists/") && !pathname.includes("/log/"))
      mapDispatch({ type: MapActionType.CLEAR_MAP });
    // newEntryDispatch({ type: NewEntryActionType.RESET_FORM });
    // If form is not empty, confirm navigate away
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/peak-lists" element={<PeakLists />} />
        <Route path="/peak-lists/:listID" element={<SinglePeakList />} />
        <Route path="/log" element={<Log />} />
        <Route path="/log/:logID" element={<SingleLogEntry />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/new-entry" element={<NewEntry />} />
      </Route>
    </Routes>
  );
}

export default App;
