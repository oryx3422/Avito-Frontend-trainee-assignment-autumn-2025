import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ListPage from "../pages/ListPage/ListPage";
import ItemPage from "../pages/ItemPage/ItemPage";
import StatsPage from "../pages/StatsPage/StatsPage";

const AppRouter = () => {
  return (
    <div className="appRouter">
      <Routes>
        <Route path="/" element={<Navigate to="/list" />} />
        <Route path="/list" element={<Navigate to="/list/1" replace />} />
        <Route path="/list/:page" element={<ListPage />} />
        <Route path="/item/:id" element={<ItemPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="*" element={<Navigate to="/list" />} />
      </Routes>
    </div>
  );
};

export default AppRouter;
