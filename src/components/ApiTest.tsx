import React from "react";
import { useEffect } from "react";
import axios from "axios";

export const ApiTest: React.FC = () => {
  useEffect(() => {
    // Any /api/* path is redirected to localhost:8000/* where the api is running
    // /api/cms/menu-item/on_site/1/ return a json with all the menu items for Strom sub-page
    axios.get("/api/cms/menu-item/on_site/1/").then((res) => {
      console.log(res.data);
    });
  }, []);

  return <></>;
};
