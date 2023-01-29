import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Layout } from "./layout/Layout/Layout";
import {
  PeakLists,
  Log,
  Stats,
  NewEntry,
  SingleLogEntry,
  SinglePeakList,
} from "./pages";
import { useAppDispatch } from "hooks/reduxHooks";
import { clearMap } from "features/mapSlice";

function App() {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // if (!pathname.includes("/peak-lists/") && !pathname.includes("/log/"))
    dispatch(clearMap());
    // newEntryDispatch({ type: NewEntryActionType.RESET_FORM });
    // If form is not empty, confirm navigate away
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/peak-lists" element={<PeakLists />} />
        <Route path="/peak-lists/:listId" element={<SinglePeakList />} />
        <Route path="/log" element={<Log />} />
        <Route path="/log/:logId" element={<SingleLogEntry />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/new-entry" element={<NewEntry />} />
      </Route>
    </Routes>
  );
}

export default App;
