import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

import { environment } from "environment";
import "./custom.scss";
// react-bootstrap components
import {
  Card,
  Table,
  Container,
  Row,
  Col,
  Button,
  Modal,
} from "react-bootstrap";
import BillingProvider from "../components/CLAIM/BillingProvider";
import Diagnosis from "../components/CLAIM/Diagnosis";
import Service from "../components/CLAIM/Service";
import Patient from "../components/CLAIM/Patient";
import BilledAmount from "components/CLAIM/BilledAmount";
import Flags from "components/CLAIM/Flags";
import ClaimID from "components/CLAIM/ClaimID";


function MainSearch() {
  const [billing, setBilling] = useState(false);
  const [billingData, setBillingData] = useState({});
  const [patient, setPatient] = useState(false);
  const [patientData, setPatientData] = useState({});
  const [diagnosis, setDiagnosis] = useState(false);
  const [diagnosisData, setDiagnosisData] = useState({});
  const [service, setService] = useState(false);
  const [serviceData, setServiceData] = useState({});

  const [keyword, setKeyword] = useState("");
  const [mainData, setMainData] = useState([]);
  const [summary, setSummary] = useState("");
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState();

  const [tableview, setTableView] = useState(true);

  const BASE_URL = environment.BASE_URL;

  const openBillingDialog = (e) => setBilling(e);
  const openPatientDialog = (e) => setPatient(e);
  const openDiagnosisDialog = (e) => setDiagnosis(e);
  const openServiceDialog = (e) => setService(e);
  const handleSend = () => {
    if (!question.trim()) {
      return; // Ignore empty messages
    }
    var query = new FormData();
    query.append("query", question);

    axios
      .post(`${BASE_URL}/query_main/`, query)
      .then((res) => {
        setSummary(res.data.summary);
        // setData(res.data);
      })
      .catch((error) => {
        console.error("An error occurred while sending the request:", error);
        // Handle the error appropriately, such as displaying an error message to the user or taking corrective actions
      });
    setQuestion("");
  };
  useEffect(() => {
    const data = {
      keyword: keyword,
    };
    const timer = setTimeout(() => {
      axios.post(`${BASE_URL}/v2/get_main/`, data).then((res) => {
        console.log(res.data);
        setMainData(res.data);
        console.log(mainData);
        setAnswer(JSON.stringify(res.data));
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword]);
  const getSummary = () => {
    setSummary("");
    const requestData = new FormData();
    requestData.append(
      "query",
      `This data is about Main Data from 2020 to 2022 filtered by keyword:${keyword}`
    );
    requestData.append("answer", answer);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE_URL}/get_summary/`);
    xhr.responseType = "text";
    xhr.send(requestData);

    xhr.onprogress = (event) => {
      const responseData = event.target.responseText;
      setSummary(responseData);
    };

    xhr.onerror = (error) => {
      console.error(error);
    };
  };

  return (
    <>
      <Container fluid>
        <Modal show={billing} onHide={() => openBillingDialog(false)}>
          <Modal.Header>
            <Modal.Title>Billing Provider</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <span>BUSINESS NAME:</span>
              {billingData.bus_name}
            </div>
            <div>
              <span>NPI:</span>
              {billingData.NPI}
            </div>
            <div>
              <span>ADDRESS:</span>
              {billingData.addr}
            </div>
          </Modal.Body>
        </Modal>
        <Modal show={diagnosis} onHide={() => openDiagnosisDialog(false)}>
          <Modal.Header>
            <Modal.Title>Principal Diagnosis</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <span>CODE:</span>
              {diagnosisData.code}
            </div>
            <div>
              <span>DESCRIPTION:</span>
              {diagnosisData.desc}
            </div>
          </Modal.Body>
        </Modal>
        <Modal show={patient} onHide={() => openPatientDialog(false)}>
          <Modal.Header>
            <Modal.Title>Subscriber</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <span>NAME:</span>
              {patientData.name}
            </div>
            <div>
              <span>MEMBER ID:</span>
              {patientData.memberid}
            </div>
            <div>
              <span>DATE OF BIRTH:</span>
              {patientData.birth}
            </div>
            <div>
              <span>GENDER:</span>
              {patientData.gender}
            </div>
            <div>
              <span>ADDRESS:</span>
              {patientData.addr}
            </div>
          </Modal.Body>
        </Modal>
        <Modal show={service} onHide={() => openServiceDialog(false)}>
          <Modal.Header>
            <Modal.Title>Revenue Code</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <span>CODE:</span>
              {serviceData.code}
            </div>
            <div>
              <span>DESCRIPTION:</span>
              {serviceData.desc}
            </div>
            <div>
              <span>CODE VALID SINCE:</span>
              {serviceData.since}
            </div>
            <div>
              <span>CODE VALID UNTIL:</span>
              {serviceData.until}
            </div>
          </Modal.Body>
        </Modal>
        {
          <Row style={{ width: "fit-content", minWidth: "100%" }}>
            <Col md="12" className="mb-2">
              <div className="d-flex justify-content-md-between align-center">
                <h4>Claims</h4>
              </div>
              <input
                className="w-100 p-2 rounded-lg"
                type="text"
                placeholder="search ... "
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    handleSend(event);
                  }
                }}
              />
            </Col>
            <Col md="9"></Col>
            <Col md="12" className="mb-3 summary">
              {summary}
            </Col>

            <Col md="12" className="mb-5 overflow-auto">
              <Card className="strpied-tabled-with-hover w-100 m-0">
                <Card.Body className="table-full-width table-responsive px-0">
                  <div className="main-table">
                    <Table className="table-hover table-striped">
                      <thead>
                        <tr>
                          <th>ClaimID</th>
                          <th>Billing Provider</th>
                          <th>Patient</th>
                          <th>Diagnosis</th>
                          <th>Dates</th>
                          <th>Services</th>
                          <th>Billed Amt</th>
                          <th>Flags</th>
                        </tr>
                      </thead>

                      <tbody>
                        {mainData != undefined &&
                          mainData.map((row, index) => (
                            <tr
                              key={index}
                              onClick={() => setTableView(!tableview)}
                            >
                              <td>
                                <ClaimID
                                  data={{
                                    date: row.DateOfService,
                                    cid: row.ClaimID,
                                  }}
                                />
                              </td>
                              <td>
                                <BillingProvider
                                  setData={setBillingData}
                                  openDialog={openBillingDialog}
                                  data={{
                                    NPI: row.ProviderNPI,
                                    bus_name:
                                      row.ProviderFirstName +
                                      " " +
                                      row.ProviderLastName +
                                      " " +
                                      row.ProviderMiddleName,
                                    detail: "Inst, Hospital, outpatient",
                                    addr: row.ProviderAddress,
                                  }}
                                />
                              </td>
                              <td>
                                <Patient
                                  setData={setPatientData}
                                  openDialog={openPatientDialog}
                                  data={{
                                    name: "DOE, JOHN T",
                                    memberid: "030005074",
                                    birth: "11/11/1968",
                                    gender: "Male",
                                    addr: "ANYWHERE, PA 17111",
                                  }}
                                />
                              </td>
                              <td>
                                <Diagnosis
                                  setData={setDiagnosisData}
                                  openDialog={openDiagnosisDialog}
                                  data={[
                                    {
                                      code: "F41.9",
                                      desc: "Anxiety disorder, unspecified",
                                    },
                                    {
                                      code: "F41.9",
                                      desc: "Anxiety disorder, unspecified",
                                    },
                                    {
                                      code: "F41.9",
                                      desc: "Anxiety disorder, unspecified",
                                    },
                                  ]}
                                />
                              </td>
                              <td>4/1/05</td>
                              <td>
                                <Service
                                  setData={setServiceData}
                                  openDialog={openServiceDialog}
                                  data={[
                                    { code: "0300", desc: "" },
                                    { code: "84087", desc: "" },
                                  ]}
                                />
                              </td>
                              <td>
                                <BilledAmount
                                  data={{ amount: "50", line_amt: "100" }}
                                />
                              </td>
                              <td>
                                <Flags
                                  data={{ d1: "1 (High)", d2: "1 (All)" }}
                                />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <div>
                <textarea
                  rows="2"
                  type="text"
                  value={question}
                  onChange={(e) => {
                    if (e.target.value.trim()) {
                      setQuestion(e.target.value);
                    } else if (e.target.value === "") {
                      setQuestion(e.target.value);
                    }
                  }}
                  className="w-100 p-3 positive t-0 r-0"
                  placeholder="Ask me questions you have about any of these claims"
                  style={{ borderRadius: "12px" }}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      handleSend(event);
                    }
                  }}
                />
              </div>
            </Col>
          </Row>
        }
      </Container>
    </>
  );
}

export default MainSearch;
