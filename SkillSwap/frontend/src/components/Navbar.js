import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav style={{ padding: "10px", background: "#333", color: "#fff" }}>
    <Link to="/" style={{ marginRight: "10px", color: "#fff" }}>Profile</Link>
  </nav>
);

export default Navbar;
