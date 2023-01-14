import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./layout/Layout/Layout";
import { PeakLists, Log, Stats, NewEntry } from "./pages";
import { SinglePeakList } from "pages/SinglePeakList/SinglePeakList";
import { SingleLogEntry } from "pages/SingleLogEntry/SingleLogEntry";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/peak-lists" element={<PeakLists />}></Route>
          <Route path="/peak-lists/:listID" element={<SinglePeakList />} />
          <Route path="/log" element={<Log />}></Route>
          <Route path="/log/:logID" element={<SingleLogEntry />} />
          <Route path="/stats" element={<Stats />}></Route>
          <Route path="/new-entry" element={<NewEntry />}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
