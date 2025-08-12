import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FirstBlock from "./Components/Header/First-Block/firstBlock";
import Nav from "./Components/Header/Nav/nav";
import UserChoice from "./Components/Cohice/user-choice.js"; // Corrected path and spelling
import Header from "./Components/Header/header";
import DonationProcess from "./Components/process/process";
import FindBloodDrive from "./Components/bloodDrive/find-blood-drive";
import FAQ from './Components/FAQ/faq.js';
import Footer from './Components/Footer/footer.js';

function Home() {
  return (
    <Router> {/* Place Router at the top level */}
      <FirstBlock />
      <div className="bg-[#eaeaee] py-2">
        <Routes>
          <Route path="/" element={<Nav />} /> {/* Home route for Nav */}
          <Route path="/user-choice" element={<UserChoice />} /> {/* Corrected path */}
          {/* Add other routes here as needed */}
        </Routes>
      </div>
      <Header />
      <DonationProcess />
      <FindBloodDrive />
      <FAQ />
      <Footer />
    </Router>
  );
}

export default Home;
