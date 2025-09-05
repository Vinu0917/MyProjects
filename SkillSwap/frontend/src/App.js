import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProfileForm from "./components/ProfileForm";
import MatchList from "./components/MatchList";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProfileForm />} />
        <Route path="/matches/:userId" element={<MatchList />} />
      </Routes>
    </Router>
  );
}

export default App;
