import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ListPage from "../pages/ListPage";
import ItemPage from "../pages/ItemPage";
import StatsPage from "../pages/StatsPage";
import Home from "../pages/Home";

const AppRouter = () => {
  return (
    <div className="appRouter">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/item/:id" element={<ItemPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="*" element={<Navigate to="/list" />} />
      </Routes>
    </div>
  );
};

export default AppRouter;
