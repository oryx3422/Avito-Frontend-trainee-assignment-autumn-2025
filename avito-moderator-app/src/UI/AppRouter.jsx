import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ListPage from "../pages/ListPage";
import ItemPage from "../pages/ItemPage";
import StatsPage from "../pages/StatsPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/list"
        element={
          <>
            <ListPage />
          </>
        }
      />

      <Route
        path="/ItemPage"
        element={
          <>
            <ItemPage />
          </>
        }
      />

      <Route
        path="/StatsPage"
        element={
          <>
            <StatsPage />
          </>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;
