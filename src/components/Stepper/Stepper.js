import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import axios, { all } from "axios";
import { environment } from "environment";
import LinearWithValueLabel from "components/ProgressBar/ProgressBar";
import "./stepper.scss";

const BASE_URL = environment.BASE_URL;
var allInfo = "";

export default function VerticalLinearStepper({
  claimID,
  setReferencePolicy,
  setDenialCode,
  setIcdCode,
  setDenialReason,
  setDayToAppeal,
  setAppeal,
  setDenialInfo,
  denialCode,
  icdCode,
  denialReason,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [steps, setSteps] = useState([
    {
      label: "Confirmed Payer",
      description: ``,
      status: "",
      editable: false,
    },
    {
      label: "Mapped Denial Reason",
      description: ``,
      status: "",
      editable: false,
    },
    {
      label: "Validated ICD & CPT code",
      description: ``,
      status: "",
      editable: false,
    },
    {
      label: "Applied Payer Policy",
      description: ``,
      status: "",
      editable: false,
    },
    {
      label: "Gathered Documentation",
      description: ``,
      status: "",
      editable: false,
    },
    {
      label: "Prepared Appeal Letter",
      description: ``,
      status: "",
      editable: false,
    },
  ]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [denialInfoStepper, setDenialInfoStepper] = useState();

  const handleRegenerateAppeal = async () => {
    setAppeal(false);
    await generateAppealLetter(allInfo);
  };

  const handleNext = async (index) => {
    setSteps((prevSteps) =>
      prevSteps.map((step, idx) =>
        idx === index
          ? {
              ...step,
              editable: false,
            }
          : step
      )
    );
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setIsSubmitted(false);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleReject = () => {
    setSteps([
      {
        label: "Confirmed Payer",
        description: ``,
        status: "",
      },
      {
        label: "Mapped Denial Reason",
        description: ``,
        status: "",
      },
      {
        label: "Validated CPT code",
        description: ``,
        status: "",
      },
      {
        label: "Applied Payer Policy",
        description: ``,
        status: "",
      },
      {
        label: "Gathered Documentation",
        description: ``,
        status: "",
      },
      {
        label: "Prepared Appeal Letter",
        description: ``,
        status: "",
      },
    ]);
  };

  const handleEdit = (index) => {
    setSteps((prevSteps) =>
      prevSteps.map((step, idx) =>
        idx === index
          ? {
              ...step,
              editable: true,
            }
          : step
      )
    );
  };

  useEffect(() => {
    procedures();
  }, []);

  useEffect(() => {
    if (denialInfoStepper !== undefined)
      allInfo = `
      Insurance_Company_Name: '${steps[0].description}',
      Claim_Number: ${claimID}
      Denial_Code: ${denialInfoStepper.denialCode},
      CPT_and_ICD_codes: ${steps[2].description},
      Denial_Reason: ${denialInfoStepper.denialReason},
      Applied_Payer_Policy: ${steps[3].description},
    `;
  }, [steps, denialInfoStepper]);

  const procedures = async () => {
    const payer = await confirmPayer(claimID);
    console.log("Payer", payer);
    const denial_info = await mapDenialReason(claimID);
    setDenialInfo(denial_info);
    setDenialInfoStepper(denial_info);
    const codingInfo = await validateCPT(claimID, payer);
    const appliedPolicy = codingInfo.applied_payer_policy;
    const icd_code = codingInfo.icd_code;
    await appliedPayerPolicy(appliedPolicy);
    setDenialCode(denial_info.denialCode);
    setDenialReason(denial_info.denialReason);
    const day_to_appeal = await getDayToAppeal(claimID);
    setDayToAppeal(`${day_to_appeal} days`);
    await getNecessaryDocuments(denial_info.denialCode);
    console.log(steps);
    console.log(allInfo);
    await generateAppealLetter(allInfo);
  };

  const getDayToAppeal = async (claimID) => {
    const ClaimID = new FormData();
    ClaimID.append("ClaimID", claimID);
    const result = await axios.post(
      `${BASE_URL}/v2/get_day_to_appeal/`,
      ClaimID
    );
    return result.data.days;
  };

  const generateAppealLetter = async (allInfo) => {
    const all_Info = new FormData();
    all_Info.append("all_Info", allInfo);
    const result = await axios.post(
      `${BASE_URL}/v2/generate_appeal/`,
      all_Info
    );
    if (result.data.status === "success") {
      setActiveStep(6);
      setAppeal(result.data.appeal);
    }
  };

  const getNecessaryDocuments = async (denial_codes) => {
    try {
      const denialCode = new FormData();
      denialCode.append("denialCode", denial_codes);
      const result = await axios.post(
        `${BASE_URL}/v2/get_document/`,
        denialCode
      );
      if (result.data.status === "success") {
        setActiveStep(5);
        setSteps((prevSteps) =>
          prevSteps.map((step, index) =>
            index === 4
              ? {
                  ...step,
                  description: `Document Name(s): ${result.data.documents.map(
                    (document) => document.document_names + ","
                  )}\nLink(s): ${result.data.documents.map(
                    (document) => document.links + ","
                  )}`,
                  status: "success",
                }
              : step
          )
        );
      } else {
        setSteps((prevSteps) =>
          prevSteps.map((step, index) =>
            index === 4
              ? {
                  ...step,
                  status: "error",
                }
              : step
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const appliedPayerPolicy = async (policy) => {
    setActiveStep(4);
    setSteps((prevSteps) =>
      prevSteps.map((step, index) =>
        index === 3
          ? {
              ...step,
              description: policy.content,
              status: "success",
            }
          : step
      )
    );
  };

  const validateCPT = async (claimNumber, payer) => {
    const ClaimID = new FormData();
    ClaimID.append("ClaimID", claimNumber);
    ClaimID.append("payer", payer);
    const result = await axios.post(`${BASE_URL}/v2/validate_cpt/`, ClaimID);
    console.log(result);
    if (result.data.status === "success") {
      setIcdCode(result.data.ICD_Codes);
      setReferencePolicy(result.data.policy_title.content);
      setActiveStep(3);
      if (result.data.CPT_Validation === "TRUE")
        setSteps((prevSteps) =>
          prevSteps.map((step, index) =>
            index === 2
              ? {
                  ...step,
                  description: `CPT Code(s): ${result.data.CPT_Codes.map(
                    (cpt_code, index) =>
                      cpt_code +
                      ":" +
                      result.data.cpt_descriptions[index] +
                      "\n"
                  )}\nICD Code(s): ${result.data.ICD_Codes.map(
                    (icd_code, index) =>
                      icd_code +
                      ":" +
                      result.data.icd_descriptions[index] +
                      "\n"
                  )}`,
                  status: "success",
                }
              : step
          )
        );
      else {
        setSteps((prevSteps) =>
          prevSteps.map((step, index) =>
            index === 2
              ? {
                  ...step,
                  description: result.data.recommendation.content,
                  status: "success",
                }
              : step
          )
        );
      }
      return {
        applied_payer_policy: result.data.applied_payer_policy,
        icd_code: result.data.ICD_Codes,
      };
    } else {
      setSteps((prevSteps) =>
        prevSteps.map((step, index) =>
          index === 2
            ? {
                ...step,
                status: "error",
              }
            : step
        )
      );
    }
  };

  const mapDenialReason = async (claimNumber) => {
    const ClaimID = new FormData();
    ClaimID.append("ClaimID", claimNumber);
    const result = await axios.post(
      `${BASE_URL}/v2/map_denial_reason/`,
      ClaimID
    );
    if (result.data.status === "success") {
      setActiveStep(2);
      setSteps((prevSteps) =>
        prevSteps.map((step, index) =>
          index === 1
            ? {
                ...step,
                description: `Original: ${result.data.original_reason[0].description}\n\nCurrent: ${result.data.current_reason}`,
                status: "success",
              }
            : step
        )
      );
      return {
        deniedPayer: result.data.denied_payer,
        denialCode: result.data.denied_rarc,
        denialReason: result.data.current_reason,
        charged_amount: result.data.charged_amount,
        paid_amount: result.data.paid_amount,
        filing_limit: result.data.filing_limit,
        denied_type: result.data.denied_type,
      };
    } else {
      setSteps((prevSteps) =>
        prevSteps.map((step, index) =>
          index === 1
            ? {
                ...step,
                status: "error",
              }
            : step
        )
      );
    }
  };

  const confirmPayer = async (claimNumber) => {
    const ClaimID = new FormData();
    ClaimID.append("ClaimID", claimNumber);
    const result = await axios.post(`${BASE_URL}/v2/confirm_payer/`, ClaimID);
    if (result.data.status === "success") {
      setActiveStep(1);
      setSteps((prevSteps) =>
        prevSteps.map((step, index) =>
          index === 0
            ? {
                ...step,
                description: result.data.denied_payer,
                status: "success",
              }
            : step
        )
      );
      return result.data.denied_payer;
    } else {
      setSteps((prevSteps) =>
        prevSteps.map((step, index) =>
          index === 0
            ? {
                ...step,
                status: "error",
              }
            : step
        )
      );
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 5 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
              error={step.status === "error"}
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography sx={{ whiteSpace: "pre-line" }}>
                {/* {step.description} */}
                <div>
                  <div
                    className="step-content"
                    value={step.description}
                    onInput={(e) => {
                      const updatedSteps = steps;
                      updatedSteps[index].description = e.target.innerText;
                      console.log(updatedSteps, e.target.innerText);
                      setSteps(updatedSteps);
                    }}
                    contentEditable={step.editable}
                    suppressContentEditableWarning={true}
                  >
                    {step.description}
                  </div>
                </div>
              </Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={() => handleNext(index)}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Next
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                  {index !== steps.length - 1 && (
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => handleEdit(index)}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Edit
                    </Button>
                  )}
                  {index === steps.length - 1 && (
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => handleRegenerateAppeal()}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Regenerate Appeal
                    </Button>
                  )}
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <>
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>All steps completed. Submit?</Typography>
            <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
              Back
            </Button>
            <Button onClick={handleSubmit} sx={{ mt: 1, mr: 1 }}>
              Submit
            </Button>
            <Button onClick={handleReject} sx={{ mt: 1, mr: 1 }}>
              Reject
            </Button>
          </Paper>
          {isSubmitted && <LinearWithValueLabel />}
        </>
      )}
    </Box>
  );
}
