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
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { clearMap } from "features/mapSlice";
import { WelcomeModal } from "components/WelcomeModal/WelcomeModal";
import { ModalType } from "features/modalSlice";

function App() {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const { listId } = useAppSelector((state) => state.newEntry);
  const { openModal } = useAppSelector((state) => state.modal);

  useEffect(() => {
    if (pathname.includes("/new-entry") && listId) return;
    if (!pathname.includes("/peak-lists/") && !pathname.includes("/log/"))
      dispatch(clearMap());
  }, [pathname]);

  return (
    <>
      {openModal === ModalType.WELCOME && <WelcomeModal />}
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
    </>
  );
}

export default App;
