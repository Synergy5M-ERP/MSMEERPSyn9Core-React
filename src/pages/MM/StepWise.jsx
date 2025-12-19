// src/components/studentProfile/StepWise.jsx
import React, { useState } from "react";
import StepIndicator from "./StepIndicator";
import { steps } from "./stepsConfig";
import pp from './PP'
const CreateEnquiry = () => <div>Address Information Form</div>;
const QuotationForm = () => <div>Other Information Form</div>;
const PriceComparison = () => <div>Current Course Details (AY 2025–2026)</div>;
const SelectSeller = () => <div>Past Qualification Form</div>;
const PurchaseOrder = () => <div>Hostel Details Form</div>;

const stepComponents = {
  pp: pp,
  CreateEnquiry: CreateEnquiry,
  QuotationForm: QuotationForm,
  PriceComparison: PriceComparison,
  SelectSeller: SelectSeller,
  PurchaseOrder: PurchaseOrder,
};

const StepWise = () => {
  const [currentStep, setCurrentStep] = useState(1); // 4 = "Current Course"

  const activeStep = steps.find((s) => s.id === currentStep);
  const ActiveComponent = stepComponents[activeStep.key];

  const goNext = () => {
    setCurrentStep((prev) =>
      prev < steps.length ? prev + 1 : prev
    );
  };

  const goPrev = () => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  return (
    <div className="container my-4">
      <StepIndicator currentStep={currentStep} />

      <h5 className="mt-3 mb-3 text-primary">
        {activeStep.title} (AY 2025–2026)
      </h5>

      <div className="card mb-3">
        <div className="card-body">
          <ActiveComponent />
        </div>
      </div>

      <div className="d-flex justify-content-between">
        <button
          className="btn btn-outline-secondary"
          onClick={goPrev}
          disabled={currentStep === 1}
        >
          Previous
        </button>
        <button
          className="btn btn-primary"
          onClick={goNext}
          disabled={currentStep === steps.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StepWise;
