import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './header/Header';
import Footer from './footer/Footer';
import RootPage from './home/RootPage';
import Home from './home/Home';
import Threads from './threads/Threads';
import Destinations from './destinations/Destinations';
import PlanningItinerary from './planItinerary/PlanningItinerary';
const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<RootPage />} />
        <Route path="home" element={<Home />} />
        <Route path="destinations" element={<Destinations />} />
        <Route path="threads" element={<Threads />} />
        <Route path="planningitinerary" element={<PlanningItinerary />} />
      </Route>
    </Routes>
  );
};

export default App;
