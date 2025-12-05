// src/components/studentProfile/StepIndicator.jsx
import React from "react";
import { steps } from "./stepsConfig";


const StepIndicator = ({ currentStep }) => {
  const totalSteps = steps.length;
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="wizard-wrapper mb-4">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <div className="text-end w-100">
          <span className="profile-label">Profile Completeness</span>
          <span className="badge bg-success ms-2">100%</span>
        </div>
      </div>

      <div className="wizard-progress-bar position-relative mb-4">
        <div
          className="wizard-progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="wizard-steps d-flex justify-content-between align-items-center">
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          const Icon = step.icon;

          return (
            <div key={step.id} className="wizard-step text-center flex-fill position-relative">
              {isActive && (
                <div className="wizard-active-label">
                  {step.title.split(" ")[0]} <br />
                  {step.title.split(" ").slice(1).join(" ")}
                </div>
              )}

              <div
                className={
                  "wizard-icon-circle mx-auto mb-1 " +
                  (isCompleted ? "completed" : "") +
                  (isActive ? " active" : "")
                }
              >
                <Icon size={22} />
              </div>

              <div className="wizard-step-text small">
                {step.title.split(" ")[0]}
                <br />
                {step.title.split(" ").slice(1).join(" ")}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-end mt-2 small text-danger">
        All * marks fields are mandatory
      </div>
    </div>
  );
};

export default StepIndicator;
