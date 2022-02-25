import Auth from 'pages/Auth';
import Home from 'pages/Home';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/auth' element={<Auth />} />
      </Routes>
    </div>
  );
};

export default App;