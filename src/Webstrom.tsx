import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { MenuMain } from "./components/MenuMain/";
import { MenuSeminars } from "./components/MenuSeminars";
import { MainContentRouter } from "./pages/MainContentRouter";
import { Footer } from "./components/Footer";

export const Webstrom: React.FC = () => {
  const seminarId = getSeminarId();

  // V prípade, že sa dá zmeniť subdoména bez reloadnutia prehliadača, môžeme zmeniť
  // seminar id z konštanty na state ako na riadkoch nižšie.

  // const [seminarId, setSeminarId] = useState(getSeminarId());

  // const updateSeminarId = () => {
  //   /**
  //    * Táto funkcia updatne state seminarId podľa aktuálnej subdomény
  //    * na ktorej sa nachádzame. Defaultné id je 1 (id Stromu).
  //    */
  //   setSeminarId(getSeminarId());
  // };

  return (
    <Router>
      <div id="page-container">
        {/* <MenuSeminars updateSeminarId={updateSeminarId} /> */}
        <MenuSeminars seminarId={seminarId} />
        <MenuMain seminarId={seminarId} />
        <MainContentRouter seminarId={seminarId} />
        <Footer />
      </div>
    </Router>
  );
};

const getSeminarId = () => {
  /**
   * Táto funkcia vráti id seminára podľa subdomény vo window.location.host
   * pre potreby routovania a načítania menu z api.
   */
  let seminarId = 1;
  switch (window.location.host.split(".")[0]) {
    case "strom":
      seminarId = 1;
      break;
    case "matik":
      seminarId = 2;
      break;
    case "malynar":
      seminarId = 3;
      break;
    case "zdruzenie":
      seminarId = 4; // zatiaľ neexistujú žiadne menu itemy v api
      break;
    case "admin":
      seminarId = 5; // zatiaľ neexistujú žiadne menu itemy v api
      break;
    default:
      seminarId = 1;
      break;
  }
  return seminarId;
};
