import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateItem from './pages/CreateItem';
import ItemDetails from './pages/ItemDetails';
import MyItems from './pages/MyItems';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateItem />} />
      <Route path="/items/:id" element={<ItemDetails />} />
      <Route path="/my-items" element={<MyItems />} />
    </Routes>
  );
};

export default AppRoutes;
