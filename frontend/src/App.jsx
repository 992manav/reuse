import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import AdminPanel from "./components/AdminPanel";
import BrowseItems from "./components/BrowseItems";
import AddItem from "./components/AddItem";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/browse" element={<BrowseItems />} />
        <Route path="/list-item" element={<AddItem />} />
      </Routes>
    </Router>
  );
}

export default App;
