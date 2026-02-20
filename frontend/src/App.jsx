import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Services from "./pages/Services";
import Appointments from "./pages/Appointments";
import Contact from "./pages/Contact";

function App() {
  return (
    <div>
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/doctors" element={<Doctors />} />
      <Route path="/services" element={<Services />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/contact" element={<Contact />} /> */}
    </Routes>
    </div>
  );
}

export default App;
