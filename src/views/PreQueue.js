import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { environment } from "environment";
import "./custom.scss";
// react-bootstrap components
import { Card, Table, Container, Row, Col } from "react-bootstrap";
import VerticalLinearStepper from "components/Stepper/Stepper";

function PreQueue() {
  const [isDetail, setIsDetail] = useState(false);
  const [referencePolicy, setReferencePolicy] = useState();
  const [icdCode, setIcdCode] = useState();
  const [denialCode, setDenialCode] = useState();
  const [denialReason, setDenialReason] = useState();
  const [dayToAppeal, setDayToAppeal] = useState();
  const [appeal, setAppeal] = useState(false);
  const [claimNumber, setClaimNumber] = useState();
  const [denialInfo, setDenialInfo] = useState();

  const BASE_URL = environment.BASE_URL;
  const checkClaim = (claim) => {
    setClaimNumber(claim);
    var query = new FormData();
    query.append("query", claim);
    axios.post(`${BASE_URL}/v2/query_start/`, query).then((res) => {
      console.log(res.data);
      setIsDetail(true);
    });
  };
  useEffect(() => {
    console.log(referencePolicy, icdCode, denialCode);
  }, [referencePolicy, icdCode, denialCode]);

  useEffect(() => {
    console.log(denialInfo);
  }, [denialInfo]);

  const formatResponse = (inputText) => {
    const sections = [];
    console.log(inputText);
    const paragraphs = inputText.split("\n").filter((p) => p.trim() !== ""); // split by newline and filter out any empty paragraphs
    paragraphs.forEach((paragraph, index) => {
      sections.push({
        content: paragraph,
      });
    });
    return sections;
  };

  return (
    <>
      <Container fluid>
        {!isDetail && (
          <Row>
            <Col md="12" className="d-flex mb-5 justify-content-around">
              <button
                className="bg-primary px-2 py-3 border-0 text-white rounded"
                onClick={() => checkClaim(4945929)}
              >
                Claim 4945929
              </button>
              <button
                className="bg-primary px-2 py-3 border-0 text-white rounded"
                onClick={() => checkClaim(3825286)}
              >
                Claim 3825286
              </button>
              <button
                className="bg-primary px-2 py-3 border-0 text-white rounded"
                onClick={() => checkClaim(3828296)}
              >
                Claim 3828296
              </button>
              <button
                className="bg-primary px-2 py-3 border-0 text-white rounded"
                onClick={() => checkClaim(3829046)}
              >
                Claim 3829046
              </button>
              <button
                className="bg-primary px-2 py-3 border-0 text-white rounded"
                onClick={() => checkClaim(4737213)}
              >
                Claim 4737213
              </button>
            </Col>
            <Col md="12" className="d-flex mb-5 justify-content-around">
              <button
                className="bg-primary px-2 py-3 border-0 text-white rounded"
                onClick={() => checkClaim(3824540)}
              >
                Claim 3824540
              </button>
              <button
                className="bg-primary px-2 py-3 border-0 text-white rounded"
                onClick={() => checkClaim(3824604)}
              >
                Claim 3824604
              </button>
              <button
                className="bg-primary px-2 py-3 border-0 text-white rounded"
                onClick={() => checkClaim(3824932)}
              >
                Claim 3824932
              </button>
              <button
                className="bg-primary px-2 py-3 border-0 text-white rounded"
                onClick={() => checkClaim(3827504)}
              >
                Claim 3827504
              </button>
              <button
                className="bg-primary px-2 py-3 border-0 text-white rounded"
                onClick={() => checkClaim(2313209876)}
              >
                Claim 2313209876
              </button>
            </Col>
          </Row>
        )}
        {isDetail && (
          <>
            <Row>
              <Col md="12">
                <h2 style={{ textAlign: "center", color: "green" }}>
                  <b>Claim Number - {claimNumber}</b>
                </h2>
                <br />
              </Col>
              <Col
                md="6"
                className="d-flex flex-column mb-5 justify-content-around"
              >
                <h2>
                  <b>ReNAD Insight</b>
                </h2>
                <div
                  className="insights"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <p>
                    <b>Payer Guidelines:</b>
                  </p>
                  <p>Reference Policy: {referencePolicy}</p>
                  <p>
                    <b>Denial Incomplete Report:</b>
                  </p>
                  <p>
                    <b>Denial Type:</b>
                    {denialInfo && denialInfo.denied_type}
                  </p>
                  <p>
                    ICD-10: {icdCode && icdCode.map((icdCode) => icdCode + ",")}
                  </p>
                  <p>Denial Code: {denialCode}</p>
                  <br />
                  <p>
                    <b>Action Required:</b> {denialReason}
                  </p>
                  <br />
                  <p>
                    <b>Days to Appeal: </b>
                    {dayToAppeal}
                  </p>
                </div>
              </Col>
              <Col md="6" className="d-flex flex-column mb-5">
                <h2>
                  <b>ReNAD Predictor</b>
                </h2>
                <div
                  className="insights"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <p>
                    <b>
                      Overturn Amount YTD:{" "}
                      {denialInfo && denialInfo.charged_amount}
                    </b>
                  </p>
                  <p>
                    <b>Overturn Claim Count YTD: 3514</b>
                  </p>
                  <br />
                  <p>Probability of Success: 90.1%</p>
                  <p>
                    Reimbursement Amount: {denialInfo && denialInfo.paid_amount}
                  </p>
                  <p>
                    Expected reimbursement days:{" "}
                    {denialInfo && denialInfo.filing_limit}
                  </p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="12" className="d-flex flex-column mb-5">
                <h2>
                  <b>ReNAD Recommendations</b>
                </h2>
                <div className="insights">
                  <div className="stepper">
                    <VerticalLinearStepper
                      claimID={claimNumber}
                      setReferencePolicy={setReferencePolicy}
                      setDenialCode={setDenialCode}
                      setIcdCode={setIcdCode}
                      setDenialReason={setDenialReason}
                      setDayToAppeal={setDayToAppeal}
                      setAppeal={setAppeal}
                      setDenialInfo={setDenialInfo}
                      denialCode
                      icdCode
                      denialReason
                    />
                  </div>
                  {appeal && (
                    <div className="appeal">
                      <p className="px-3">
                        {formatResponse(appeal).map((section, index) => (
                          <div key={index}>
                            <p>{section.content}</p>
                          </div>
                        ))}
                      </p>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </>
  );
}

export default PreQueue;
