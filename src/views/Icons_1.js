import axios from "axios";
import { DataContext } from "layouts/Admin";
import React, { useContext, useEffect, useState } from "react";
import "./custom.scss";

// react-bootstrap components
import { Card, Table, Container, Row, Col } from "react-bootstrap";

function TableList() {
  const [generic, setGeneric] = useState();
  const [denialSummary, setDenialSummary] = useState();
  const { data } = useContext(DataContext);
  useEffect(() => {
    if (data.content !== null && data.type === "generic")
      setGeneric(formatResponse(data.content));
    if (data.content !== null && data.type === "details") {
      let temp = {};
      let denialCount = 0;
      data.content.map((row) => {
        if (row["FirstDeniedReasonCode"] !== "") {
          denialCount += 1;
          temp = {
            DenialReasonCode: row["FirstDeniedReasonCode"],
            DenialReasonDescription: row["FirstDeniedReasonDescription"],
            PrimaryPayer: row["FirstDeniedPayerName"],
            LastDenial: row["LastDeniedDate"],
            DenialType: row["FirstDeniedType"],
            DenialCount: denialCount,
          };
        }
      });
      setDenialSummary(temp);
    }
  }, [data]);
  useEffect(() => {
    console.log(generic);
  }, [generic]);

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
      <Container fluid className="insights">
        <h3>ReNAD Generative Insights</h3>
        {data.type === "details" && (
          <h5>Claim #{data.content[0]["Claim Number"]}</h5>
        )}
        {data.type === "root_cause" && <h5>Claim #{data.claim_number}</h5>}
        <Row style={{ width: "fit-content", minWidth: "100%" }}>
          <Col md="12" className="mb-5">
            {data.type === "generic" && (
              <Card
                className="strpied-tabled-with-hover w-100 m-0 p-5"
                style={{ minHeight: "60vh" }}
              >
                <div>
                  {generic &&
                    generic.map((section, index) => (
                      <div key={index}>
                        <p>{section.content}</p>
                      </div>
                    ))}
                </div>
              </Card>
            )}
            {data.type === "root_cause" && (
              <Card
                className="strpied-tabled-with-hover w-100 m-0 px-5"
                style={{ minHeight: "60vh" }}
              >
                <Card.Header>
                  <Card.Title as="h4">Root Cause Analysis by AI</Card.Title>
                </Card.Header>
                <div>
                  {data &&
                    data.content.map((section, index) => (
                      <ul>
                        <li key={index}>{section}</li>
                      </ul>
                    ))}
                </div>
              </Card>
            )}
            {data.type === "details" && (
              <div>
                <Card className="strpied-tabled-with-hover w-100 m-0 mb-5">
                  <Card.Header>
                    <Card.Title as="h4">Claim Details</Card.Title>
                  </Card.Header>
                  <Card.Body className="table-full-width table-responsive px-0">
                    <Table className="table-hover table-striped">
                      <thead>
                        <tr>
                          <th>DOS</th>
                          <th>CPT</th>
                          <th>Provider</th>
                          <th>Payer</th>
                          <th>Sec Payer</th>
                          <th>DX Codes</th>
                          <th>Modifier</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.content != undefined &&
                          data.content.map((row, index) => (
                            <tr key={index}>
                              <td>{row["DOS"]}</td>
                              <td>{row["CPT"]}</td>
                              <td>{row["Provider"]}</td>
                              <td>{row["FirstDeniedPayerName"]}</td>
                              <td>{row["LastDeniedPayerName"]}</td>
                              <td>
                                {row["DX1_Codes"] && `${row["DX1_Codes"]}, `}
                                {row["DX2_Codes"] && `${row["DX2_Codes"]}, `}
                                {row["DX3_Codes"] && `${row["DX3_Codes"]}, `}
                                {row["DX4_Codes"] && row["DX4_Codes"]}
                              </td>
                              <td>
                                {row["Mod1"] && `${row["Mod1"]}, `}
                                {row["Mod2"] && `${row["Mod2"]}, `}
                                {row["Mod3"] && `${row["Mod3"]}, `}
                                {row["Mod4"] && row["Mod4"]}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
                <Card className="strpied-tabled-with-hover w-100 m-0 mb-5">
                  <Card.Header>
                    <Card.Title as="h4">Billing Details</Card.Title>
                  </Card.Header>
                  <Card.Body className="table-full-width table-responsive px-0">
                    <Table className="table-hover table-striped">
                      <thead>
                        <tr>
                          <th>CPT</th>
                          <th>Charge/Billed</th>
                          <th>Allowed</th>
                          <th>Paid</th>
                          <th>Adjusted</th>
                          <th>Refund</th>
                          <th>Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.content != undefined &&
                          data.content.map((row, index) => (
                            <tr key={index}>
                              <td>{row["CPT"]}</td>
                              <td>{row["Charge"]}</td>
                              <td>{row["Allowed"]}</td>
                              <td>{row["Paid"]}</td>
                              <td>{row["Adjusted"]}</td>
                              <td>{row["Refund"]}</td>
                              <td>{row["Balance"]}</td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
                <Card className="strpied-tabled-with-hover w-100 m-0 mb-5">
                  <Card.Header>
                    <Card.Title as="h4">Denial Summary</Card.Title>
                  </Card.Header>
                  <Card.Body className="table-full-width table-responsive px-0">
                    <ul>
                      <li>
                        Denial Reason{" "}
                        {denialSummary && denialSummary.DenialReasonCode}-{" "}
                        {denialSummary && denialSummary.DenialType}
                      </li>
                      <li>
                        Denial Count -{" "}
                        {denialSummary && denialSummary.DenialCount}
                      </li>
                      <li>
                        Last Denial -{" "}
                        {denialSummary && denialSummary.LastDenial}
                      </li>
                      <li>
                        {denialSummary && denialSummary.DenialReasonDescription}
                      </li>
                    </ul>
                  </Card.Body>
                </Card>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default TableList;
