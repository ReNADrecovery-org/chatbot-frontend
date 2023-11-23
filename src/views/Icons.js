import axios from "axios";
import Appeal from "components/Appeal/Appeal";
import { DataContext } from "layouts/Admin";
import React, { useContext, useEffect, useState } from "react";

// react-bootstrap components
import { Card, Table, Container, Row, Col } from "react-bootstrap";

function TableList() {
  const { data } = useContext(DataContext);
  return (
    <>
      <Container fluid>
        <Row style={{ width: "fit-content", minWidth: "100%" }}>
          <Col md="12" className="mb-5">
            <Card className="strpied-tabled-with-hover w-100 m-0">
              <Card.Header>
                <Card.Title as="h4">Chat</Card.Title>
                <p className="card-category">Chat</p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                {data.content != null && (
                  <p className="px-3">
                    {/* {formatResponse(data.content).map((section, index) => (
                      <div key={index}>
                        <p>{section.content}</p>
                      </div>
                    ))} */}
                    {data.content}
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default TableList;
