import HeaderContainer from "containers/HeaderContainer";
import Home from "pages/Home";
import Login from "pages/Login";
import React from "react";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <div>
      <HeaderContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
