import axios from "axios";
import { DataContext } from "layouts/Admin";
import React, { useContext, useEffect, useState } from "react";
import { environment } from "environment";
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";

function ICDSearch() {
  const { data } = useContext(DataContext);
  const [keyword, setKeyword] = useState("");
  const [icdData, setIcdData] = useState([]);
  const [summary, setSummary] = useState("");
  const [answer, setAnswer] = useState("");
  const BASE_URL = environment.BASE_URL;
  const [question, setQuestion] = useState();
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
  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  useEffect(() => {
    const data = {
      keyword: keyword,
    };
    const timer = setTimeout(() => {
      axios.post(`${BASE_URL}/v2/icd/`, data).then((res) => {
        console.log(res.data);
        setIcdData(res.data);
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
      `This data is about ICD9 and ICD10 filtered by ${keyword}`
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
        <Row style={{ width: "fit-content", minWidth: "100%" }}>
          <Col md="12" className="mb-2">
            <h4>ICD9 and ICD10</h4>
            <input
              className="w-100 p-2 rounded-lg"
              type="text"
              placeholder="search ... "
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </Col>

          <Col md="12" className="mb-3">
            {summary}
          </Col>

          <Col md="12" className="mb-5 overflow-auto">
            <Card className="strpied-tabled-with-hover w-100 m-0">
              <Card.Body className="table-full-width table-responsive px-0">
                <div className="main-table">
                  <Table className="table-hover table-striped">
                    <thead>
                      <tr>
                        <th>CODE</th>
                        <th>DESCRIPTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {icdData != undefined &&
                        icdData.map((row, index) => (
                          <tr key={index}>
                            <td>{row.CODE}</td>
                            <td>{row.DESCRIPTION}</td>
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
                placeholder="Ask me questions you have about any of these ICD codes"
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
      </Container>
    </>
  );
}

export default ICDSearch;
