import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


// Routers
import About from './components/Navbar/about';
import Homepage from './components/Navbar/Homepage';

// The Main Component
function App() {
  return (
    <Router>
      
     
      <Routes>
      <Route path="/bankapp" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        {/* Add other routes here */}
      </Routes>
    
    </Router>
  );
}

export default App;
