import React from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Header from './header/Header';
import Footer from './footer/Footer';
import RootPage from './home/RootPage';
import Home from './home/Home';
import Threads from './threads/Threads';
import Destinations from './destinations/Destinations';
import PlanningItinerary from './planItinerary/PlanningItinerary';
import PrePlanningItinerary from './planItinerary/prePlanningItinerary';
import Register from './authentication/Register';
import Login from './authentication/Login';
import Profile from './header/profile/Profile';
import ProtectedRoute from './ProtectedRoute';

const Layout = () => {
  const location = useLocation();
  const isPlanningItinerary = location.pathname.startsWith('/PlanningItinerary');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Conditionally render the Header */}
      {!isPlanningItinerary && <Header />}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<RootPage />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route
          path="home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="destinations"
          element={
            <ProtectedRoute>
              <Destinations />
            </ProtectedRoute>
          }
        />
        <Route
          path="threads"
          element={
            <ProtectedRoute>
              <Threads />
            </ProtectedRoute>
          }
        />
        <Route
          path="planningitinerary"
          element={
            <ProtectedRoute>
              <PlanningItinerary />
            </ProtectedRoute>
          }
        />
        <Route
          path="preplanningitinerary"
          element={
            <ProtectedRoute>
              <PrePlanningItinerary />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
    </Routes>
  );
};

export default App;