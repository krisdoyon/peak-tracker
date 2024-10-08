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
  Planner,
  Tools,
} from "./pages";
import { useFirstVisit } from "hooks/useFirstVisit";
import { useClearMap } from "hooks/useClearMap";
import { useLogin } from "hooks/useLogin";
import { useToken } from "hooks/useToken";
import Modals from "components/Modals/Modals";
import { useActiveNav } from "hooks/useActiveNav";

function App() {
  useClearMap();
  useFirstVisit();
  useToken();
  useLogin();
  useActiveNav();

  return (
    <>
      <Modals />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/peak-lists" element={<PeakLists />} />
          <Route path="/peak-lists/:listId" element={<SinglePeakList />} />
          <Route path="/log" element={<Log />} />
          <Route path="/log/:logId" element={<SingleLogEntry />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/new-entry" element={<NewEntry />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/planner/:logId" element={<SingleLogEntry />} />
            <Route path="/tools" element={<Tools />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
