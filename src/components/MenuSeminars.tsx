import React from "react";
import { Link } from "react-router-dom";

export const MenuSeminars: React.FC = () => (
  <div id="menu-seminars">
    <div className="menu-seminars-item">
      <Link to={"/malynar"}>Malynár</Link>
    </div>
    <div className="menu-seminars-item">
      <Link to={"/matik"}>Matik</Link>
    </div>
    <div className="menu-seminars-item">
      <Link to={"/strom"}>Strom</Link>
    </div>
    <div className="menu-seminars-item active">
      <Link to={"/zdruzenie"}>Združenie</Link>
    </div>
  </div>
)
