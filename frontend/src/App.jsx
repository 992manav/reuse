import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import AdminPanel from "./components/AdminPanel";
import BrowseItems from "./components/BrowseItems";
import AddItem from "./components/AddItem";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import ItemDetail from "./components/ItemDetail";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/browse" element={<BrowseItems />} />
        <Route path="/list-item" element={<AddItem />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/item/:id" element={<ItemDetail />} />

        {/* Optional routes for future features */}
        {/* <Route path="/profile" element={<Profile />} />
        <Route path="/swaps" element={<MySwaps />} />
        <Route path="/redeems" element={<MyRedeems />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} /> */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
