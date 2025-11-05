// QuotationLayout.jsx
import React from "react";
import "./quotation.css";
import ATSLogo from '../../assets/images/alphatechLogo.jpg'
import AmaraRaja from '../../assets/images/amara raja.png'
import Vertiv from '../../assets/images/vertiv.png'
import TSI from '../../assets/images/tsi.png'
import Eternity from '../../assets/images/eternity.png'
import vGuard from '../../assets/images/v guard logo golden.png'

const QuotationLayout = ({ children }) => {
  return (
    <div className="quotation-container p-4">
      {/* HEADER */}
      <div className="quotation-header text-center mb-4">
        <div className="d-flex justify-content-center align-items-center mb-2">
          <img src={ATSLogo} alt="Logo" className="company-logo me-3" />
          <h3 className="mb-0 fw-bold text-uppercase">Alphatech Systems</h3>
        </div>

        {/* Product Category List with Horizontal Line */}
        <hr className="m-2" />
        <div className=" fw-semibold small">
          🔶  UPS 🔶 Batteries 🔶 Inverters 🔶 Battery Charger 🔶 Stabilizers 🔶 SMPS 🔶 Smart Cabinets 🔶 PAC
        </div>
        <hr className="m-2" />

        {/* Address Block */}
        <div className="address-text  mt-2">
          <strong>   Regd. Off.:</strong> 1, Chaitanya Plaza, Sharanpur Link Road, Canada Corner, Nashik - 422 002 (Maharashtra, India) <br />
          ☎ 0253-2313344 | 0253-2572521  | ✉ ats@alphatechsystems.co.in
        </div>
      </div>

      {/* BODY (Dynamic Content) */}
      <div className="quotation-body">
        {children}
      </div>

      {/* FOOTER */}
      <div className="quotation-footer text-center mt-4 pt-3 border-top">
        <div className="alliance-divider mb-3">
          <span className="line"></span>
          <span className="title">Authorised Alliance Partners</span>
          <span className="line"></span>
        </div>
        <div className="d-flex justify-content-center align-items-center flex-wrap gap-3 mb-2">
          <img src={AmaraRaja} alt="Amara Raja" className="partner-logo" />
          <img src={Vertiv} alt="Vertiv" className="partner-logo" />
          <img src={TSI} alt="TS Power" className="partner-logo" />
          <img src={Eternity} alt="Eternity" className="partner-logo" />
          <img src={vGuard} alt="V-Guard" className="partner-logo" />
        </div>

      </div>
    </div>
  );
};

export default QuotationLayout;
