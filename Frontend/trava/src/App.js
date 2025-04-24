import React from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Header from './header/Header';
import Footer from './footer/Footer';
import RootPage from './home/RootPage';
import Home from './home/Home';
import Threads from './threads/Threads';
import Destinations from './destinations/Destinations';
import PlanningItinerary from './planItinerary/PlanningItinerary';
import PrePlanningItinerary from './planItinerary/PrePlanningItinerary';
import Register from './authentication/Register';
import Login from './authentication/Login';
import Profile from './header/profile/Profile';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import CategorySelector from './authentication/CategorySelector';
import ThreadsPage from './threads/threadsComponent/ThreadsPage'; // Import ThreadsPage
import TrendingMore from './destinations/destinationComponent/TrendingMore'; // Import TrendingMore
import PopularDestinationsMore from './home/homeComponent/PopularDestinationsMore';
import RecommendedDestinationsMore from './home/homeComponent/RecommendedDestinationsMore';
import HiddenGemsMore from './home/homeComponent/HiddenGemsMore';
const Layout = () => {
  const location = useLocation();
  const isPlanningItinerary = location.pathname.startsWith('/PlanningItinerary');

  return (
    <div className="flex flex-col min-h-screen">
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
        <Route
          path="/"
          element={
            <PublicRoute>
              <RootPage />
            </PublicRoute>
          }
        />
        
        {/* Public Routes */}
        <Route
          path="register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        
        {/* Protected Routes */}
        <Route
          path="preference"
          element={
              <CategorySelector />
          }
        />
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
          path="threads/details"
          element={
            <ProtectedRoute>
              <ThreadsPage />
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
          path="PrePlanningItinerary"
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
        <Route
          path="trendingmore"
          element={
            <ProtectedRoute>
              <TrendingMore />
            </ProtectedRoute>
          }
        />
        <Route
          path="populardestinationsmore"
          element={
            <ProtectedRoute>
              <PopularDestinationsMore />
            </ProtectedRoute>
          }
        />
        <Route
          path="recommendeddestinationsmore"
          element={
            <ProtectedRoute>
              <RecommendedDestinationsMore />
            </ProtectedRoute>
          }
        />
        <Route
          path="hiddengemsmore"
          element={
            <ProtectedRoute>
              <HiddenGemsMore />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
    </Routes>
  );
};

export default App;