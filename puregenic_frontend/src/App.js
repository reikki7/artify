import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Login from "./components/Login";
import Home from "./container/Home";
import { gapi } from "gapi-script";

const clientId =
  "924070860016-basb2cuoqn1rrda2lv3npfv4bh5d3ap3.apps.googleusercontent.com";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const User =
      localStorage.getItem("user") !== "undefined"
        ? JSON.parse(localStorage.getItem("user"))
        : // If user is not logged in, clear local storage
          localStorage.clear();

    // If user is not logged in, redirect to login page
    if (!User) navigate("/login");
  }, []);

  // Initialize Google API
  useEffect(() => {
    function start() {
      gapi.auth2.init({
        clientId: clientId,
        scope: "",
      });
    }

    // Load the API and make the call
    gapi.load("client:auth2", start);
  });

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/*" element={<Home />} />
    </Routes>
  );
};

export default App;
