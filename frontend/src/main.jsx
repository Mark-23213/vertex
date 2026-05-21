import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider, ProtectedRoute } from "./auth.jsx";
import { FavoritesProvider } from "./favorites.jsx";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Expeditions from "./pages/Expeditions.jsx";
import ExpeditionDetail from "./pages/ExpeditionDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import About from "./pages/About.jsx";
import Support from "./pages/Support.jsx";
import Profile from "./pages/Profile.jsx";
import NotFound from "./pages/NotFound.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <FavoritesProvider>
        <BrowserRouter>
        <Routes>
          {/* Публичные страницы входа */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Весь сайт — только после входа */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="expeditions" element={<Expeditions />} />
              <Route path="expeditions/:id" element={<ExpeditionDetail />} />
              <Route path="about" element={<About />} />
              <Route path="support" element={<Support />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </AuthProvider>
  </React.StrictMode>
);
