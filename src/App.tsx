import "./App.module.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Layout } from "./layout/Layout/Layout";
import { PeakLists, Log, Stats, NewEntry } from "./pages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/peak-lists" element={<PeakLists />}></Route>
          <Route path="/log" element={<Log />}></Route>
          <Route path="/stats" element={<Stats />}></Route>
          <Route path="/new-entry" element={<NewEntry />}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
