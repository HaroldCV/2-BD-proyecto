import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyComponent from './components/component';
import DataCargada from './components/data_cargada';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MyComponent />} />
        <Route path="/data_cargada/:docsToRead/:c" element={<DataCargada />} />
      </Routes>
    </Router>
  );
}

export default App;
