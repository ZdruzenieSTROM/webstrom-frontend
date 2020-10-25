import React from "react";
import { useEffect } from "react";
import axios from "axios";

export const ApiTest: React.FC = () => {
  useEffect(() => {
    // Všetky cesty typu "/api/*" sú presmerované na "localhost:8000/*" kde beží náš django server
    // spustený pomocou python manage.py runserver. Api z cesty je odstránené.
    // "/api/cms/menu-item/on_site/1/" z príkladu nižšie načíta položky menu pre podstránku Stromu
    axios.get("/api/cms/menu-item/on_site/1/").then((res) => {
      console.log(res.data);
    });
  }, []);

  return <></>;
};
