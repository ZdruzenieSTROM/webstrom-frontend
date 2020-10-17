import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as CgIcons from "react-icons/cg";
import { Link } from "react-router-dom";

function MenuMain() {
  const [isVisible, setIsVisible] = useState(true);

  const toggleMenu = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div id="menu-main" className={isVisible ? "visible" : ""}>
      {!isVisible && (
        <div id="menu-main-open-button">
          <FaIcons.FaBars className="icon-bars" onClick={toggleMenu} />
        </div>
      )}
      <div id="menu-main-close-button">
        <CgIcons.CgClose className="icon-close-menu" onClick={toggleMenu} />
      </div>
      <div id="menu-main-items">
        <div className="menu-main-item">
          <Link to="/">Domov</Link>
        </div>
        <div className="menu-main-item active">
          <Link to="/competitions/series/latest-problems">Úlohy</Link>
        </div>
        <div className="menu-main-item">
          <Link to="/archive">Archív</Link>
        </div>
        <div className="menu-main-item">
          <Link to="/">Domov</Link>
        </div>
        <div className="menu-main-item">
          <Link to="/competitions/series/latest-problems">Úlohy</Link>
        </div>
        <div className="menu-main-item">
          <Link to="/archive">Archív</Link>
        </div>
      </div>
    </div>
  );
}

export default MenuMain;
