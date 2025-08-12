import React from 'react';
import FirstBlock from "../Components/Header/First-Block/firstBlock";
import Nav from "../Components/Header/Nav/nav";
import UserChoice from "../Components/Cohice/user-choice.js";
import Header from "../Components/Header/header";
import DonationProcess from "../Components/process/process";
import FindBloodDrive from "../Components/bloodDrive/find-blood-drive";
import FAQ from '../Components/FAQ/faq.js';
import Footer from '../Components/Footer/footer.js';

function HomePage() {
  return (
    <>
      <FirstBlock />
      <div className="bg-[#eaeaee] py-2">
        <Nav />
      </div>
      <Header />
      <DonationProcess />
      <FindBloodDrive />
      <FAQ />
      <Footer />
    </>
  );
}

export default HomePage;