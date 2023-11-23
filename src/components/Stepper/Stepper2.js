import React, { useContext, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { environment } from "environment";
import axios from "axios";
import { DataContext } from "layouts/Admin";

const BASE_URL = environment.BASE_URL;

const steps = [
  {
    label: "Confirmed Payer",
  },
  {
    label: "Mapped Denial Reason",
  },
  {
    label: "Validated CPT code",
  },
  {
    label: "Applied Payer Policy",
  },
  {
    label: "Gathered Documentation",
  },
  {
    label: "Updated Claims Notes",
  },
  {
    label: "Prepared Appeal Letter",
  },
];

export default function VerticalLinearStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [stepStatus, setStepStatus] = useState(
    steps.map((step) => ({ label: step.label, status: "step" }))
  );
  const [claimNumber, setClaimNumber] = useState();
  const [cptCodes, setCptCodes] = useState([]);
  const [denialCode, setDenialCode] = useState();
  const [stepDescriptions, setStepDescriptions] = useState(steps.map(() => ""));
  const { data } = useContext(DataContext);
  const [deniedPayer, setDeniedPayer] = useState();
  const [payerPolicy, setPayerPolicy] = useState();
  useEffect(() => {
    setClaimNumber(data.claim_id);
  }, [data.claim_id]);

  useEffect(() => {
    console.log(claimNumber);
    if (claimNumber !== undefined) procedures();
  }, [claimNumber]);
  const procedures = async () => {
    try {
      await confirmPayer(claimNumber);
      const denialInfo = await mapDenialReason(claimNumber);
      const appliedPolicy = await validateCPT(claimNumber);
      await appliedPayerPolicy(appliedPolicy);
      await getNecessaryDocuments(denialInfo.denialCode);
    } catch (error) {
      // Handle errors here, and update step status to "error" for failed steps
      setStepStatus((prevStatus) =>
        prevStatus.map((step) =>
          step.label === error.stepLabel ? { ...step, status: "error" } : step
        )
      );
    }
  };
  const getNecessaryDocuments = async (denial_codes) => {
    try {
      const denialCode = new FormData();
      denialCode.append("denialCode", denial_codes);
      const result = await axios.post(`${BASE_URL}/get_document/`, denialCode);
      console.log(result);
      if (result.data.status === "success") {
        setActiveStep(5);
        setStepStatus((prevStatus) =>
          prevStatus.map((step, index) =>
            index === 4 ? { ...step, status: "success" } : step
          )
        );
        setStepDescriptions((prevDescriptions) =>
          prevDescriptions.map((description, index) =>
            index === 4 ? result.data.documents : description
          )
        );
      } else {
        throw { stepLabel: "Gathered Documentation" };
      }
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmPayer = async (claimNumber) => {
    const ClaimID = new FormData();
    ClaimID.append("ClaimID", claimNumber);
    const result = await axios.post(`${BASE_URL}/confirm_payer/`, ClaimID);
    if (result.data.status === "success") {
      setActiveStep(1);
      setStepStatus((prevStatus) =>
        prevStatus.map((step, index) =>
          index === 0 ? { ...step, status: "success" } : step
        )
      );
      setStepDescriptions((prevDescriptions) =>
        prevDescriptions.map((description, index) =>
          index === 0 ? result.data : description
        )
      );
    } else {
      throw { stepLabel: "Confirmed Payer" }; // Throw an error for this failed step
    }
  };

  const mapDenialReason = async (claimNumber) => {
    const ClaimID = new FormData();
    ClaimID.append("ClaimID", claimNumber);
    const result = await axios.post(`${BASE_URL}/map_denial_reason/`, ClaimID);
    if (result.data.status === "success") {
      setActiveStep(2);
      setStepStatus((prevStatus) =>
        prevStatus.map((step, index) =>
          index === 1 ? { ...step, status: "success" } : step
        )
      );
      setStepDescriptions((prevDescriptions) =>
        prevDescriptions.map((description, index) =>
          index === 1 ? result.data : description
        )
      );
      setDeniedPayer(result.data.denied_payer);
      setDenialCode(result.data.denied_rarc);
      return {
        deniedPayer: result.data.denied_payer,
        denialCode: result.data.denied_rarc,
      };
      console.log(denialCode);
    } else {
      throw { stepLabel: "Mapped Denial Reason" }; // Throw an error for this failed step
    }
  };

  const validateCPT = async (claimNumber) => {
    const ClaimID = new FormData();
    ClaimID.append("ClaimID", claimNumber);
    const result = await axios.post(`${BASE_URL}/validate_cpt/`, ClaimID);
    console.log(result);
    if (result.data.status === "success") {
      setActiveStep(3);
      setStepStatus((prevStatus) =>
        prevStatus.map((step, index) =>
          index === 2 ? { ...step, status: "success" } : step
        )
      );
      setStepDescriptions((prevDescriptions) =>
        prevDescriptions.map((description, index) =>
          index === 2 ? result.data : description
        )
      );
      setCptCodes(result.data.CPT_Codes);
      return result.data.applied_payer_policy;
    } else {
      throw { stepLabel: "Validated CPT code" }; // Throw an error for this failed step
    }
  };

  const appliedPayerPolicy = async (policy) => {
    console.log(policy);
    setActiveStep(4);
    setStepStatus((prevStatus) =>
      prevStatus.map((step, index) =>
        index === 3 ? { ...step, status: "success" } : step
      )
    );
    setStepDescriptions((prevDescriptions) =>
      prevDescriptions.map((description, index) =>
        index === 3 ? policy.content : description
      )
    );
  };

  return (
    claimNumber && (
      <>
        <Box sx={{ maxWidth: 400 }} style={{ marginRight: "20px" }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel error={stepStatus[index].status === "error"}>
                  {step.label}
                </StepLabel>
                <StepContent>
                  <Typography>{<p>asdfasdfsadfsadf</p>}</Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography>
                All steps completed - you&apos;re finished
              </Typography>
            </Paper>
          )}
        </Box>
        <Box>
          {stepDescriptions[0] && (
            <>
              <h4>Payers</h4>
              <p>Primary Payer: {stepDescriptions[0].primary_payer}</p>
              <p>Secondary Payer: {stepDescriptions[0].secondary_payer}</p>
            </>
          )}
          {stepDescriptions[1] && (
            <>
              <h4>Denial Reasons</h4>
              <p>
                Original Reason:{" "}
                {stepDescriptions[1].original_reason[0].description}
              </p>
              <p>Current Reason: {stepDescriptions[1].current_reason}</p>
            </>
          )}
          {stepDescriptions[2] && (
            <>
              <h4>CPT codes valid?</h4>
              <p>{stepDescriptions[2].CPT_Validation}</p>
            </>
          )}
          {stepDescriptions[3] && (
            <>
              <h4>Applied Payer Policy</h4>
              <p>{stepDescriptions[3]}</p>
            </>
          )}

          {stepDescriptions[4] &&
            stepDescriptions[4].map((document, index) => (
              <div key={index}>
                <h4>Gathered Document</h4>
                <p>Title: {document.document_names}</p>
                <p>Links:</p>
                <p>{document.links}</p>
              </div>
            ))}
        </Box>
      </>
    )
  );
}
