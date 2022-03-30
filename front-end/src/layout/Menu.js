import React from "react";
// Hamburger Menu when in mobile view
// Run 'npm install react-icons --save' to install the icons
import { FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./Menu.css";
/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

const navStyle = {
  background: "#000",
  height: "80px",
  display: "flex",
  width: "100%",
  justifyContent: "space-between",
  padding: "0.5rem calc((100vw - 1000px) / 2)",
  zIndex: "100",
  margin: "0 0 0.5% 0"
};


// Click handler for hamburger menu when in mobile view
function handleClick(e) {

  const hamburgerMenu = document.querySelector("#mobile-menu");
  const menuLinks = document.querySelector('.nav');

  e.preventDefault();

  hamburgerMenu.classList.toggle('is-active');
  menuLinks.classList.toggle('active')
}

function Menu() {
  return (
    <div style={{ width: "100%" }}className="nav-container">
      <nav style={navStyle} className="navbar">
        <NavLink style={{ textDecoration: "none", marginTop: "5px", marginLeft: "10px" }} to="/" className="link-style">
          <h1 style={{ color: "#15cdfc" }} id="logo">Periodic Tables</h1>
        </NavLink>
        <FaBars className="bars" id="mobile-menu" onClick={handleClick}>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </FaBars>
        <div className="nav-menu">
          <ul className="nav" id="accordionSidebar">
            <li>
              <NavLink
                activeStyle={{ color: "#15cdfc" }}
                className="link-style nav-link"
                to="/dashboard"
              >
                <span className="oi oi-home" />
                &nbsp;Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink activeStyle={{ color: "#15cdfc" }} className="link-style nav-link" to="/search">
                <span className="oi oi-magnifying-glass" />
                &nbsp;Search
              </NavLink>
            </li>
            <li>
              <NavLink activeStyle={{ color: "#15cdfc" }} className="link-style nav-link" to="/reservations/new">
                <span className="oi oi-plus" />
                &nbsp;New Reservation
              </NavLink>
            </li>
            <li>
              <NavLink activeStyle={{ color: "#15cdfc" }} className="link-style nav-link" to="/tables/new">
                <span className="oi oi-layers" />
                &nbsp;New Table
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Menu;
