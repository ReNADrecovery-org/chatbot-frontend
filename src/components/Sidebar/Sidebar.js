import React, {
  Component,
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import classNames from 'classnames';
import { Nav } from "react-bootstrap";
import axios from "axios";
import { DataContext } from "layouts/Admin";
import { environment } from "environment";

function Sidebar({ color, image, routes }) {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const ref = useRef();
  const BASE_URL = environment.BASE_URL;

  const { data, setData } = useContext(DataContext);
  const [text, setText] = useState("");

  const [messages, setMessages] = useState([
    {
      message: "Hello, I am your ReNAD assistant bot. How can I help you?",
      sender: "ChatGPT",
    },
  ]);
  const messageClasses = (message) => classNames(
    'd-flex m1-2 mr-2 mb-1 p-3 rounded-top',
    {
      'rounded-right': message.sender === 'ChatGPT',
      'rounded-left': message.sender !== 'ChatGPT',
      'justify-content-end': message.sender !== 'ChatGPT',
      'chat-gpt-message': message.sender === 'ChatGPT', // new class for bot messages
      'chat-user-message': message.sender !== 'ChatGPT', // new class for user messages
    }
  );

  const messageStyle = (message) => ({
    backgroundColor: message.sender === 'ChatGPT' ? '#D3D3D3' : 'grey',
    color: message.sender === 'ChatGPT' ? '#2c2c2c' : 'white',
    maxWidth: '80%',
    alignSelf: message.sender === 'ChatGPT' ? 'start' : 'end',
  });

  const handleSend = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      return; // Ignore empty messages
    }
    scrollToBottom();
    setMessages([
      ...messages,
      {
        message: question,
        sender: "user",
      },
    ]);
    setQuestion("");

    navigate("/admin/dashboard");

    await processMessageToChatGPT(question);
  };

  async function processMessageToChatGPT(message) {
    const query = new FormData();
    query.append("query", message);
    try {
      // // Using XMLHttpRequest for the first request
      // const xhr = new XMLHttpRequest();
      // xhr.open("POST", `${BASE_URL}/generic/`);
      // // xhr.open('POST', `${BASE_URL}/query_pdf/`);
      // xhr.responseType = "text";

      // xhr.onprogress = (event) => {
      //   // Handle the progress response here
      //   const responseData = event.target.responseText;

      //   setData({
      //     type: responseData.type,
      //     content: responseData.content,
      //   });

      // };

      // xhr.onerror = (error) => {
      //   console.error(error);
      // };

      // xhr.send(query);

      // const axiosResponse = await axios.post(`${BASE_URL}/generic/`, query);
      // const axiosResponse = await axios.post(`${BASE_URL}/query_csv/`, query);
      // const axiosResponse = await axios.post(
      //   `${BASE_URL}/get_medical_necessity/`,
      //   query
      // );

      const axiosResponse = await axios.post(
        `${BASE_URL}/v2/query_pdf/`,
        query
      );
      const responseData = axiosResponse.data;
      console.log(responseData);
      setData(responseData);
    } catch (error) {
      console.error(error);
    }
  }

  const location = useLocation();
  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };

  const scrollToBottom = () => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="sidebar w-25" data-image={image} data-color={color}>
      <div
        className="sidebar-background"
        style={{
          backgroundImage: "url(" + image + ")",
        }}
      />
      <div className="sidebar-wrapper w-100">
        <div className="logo d-flex align-items-center justify-content-start">
          <a href="https://www.gabeo.ai" className="simple-text logo-mini mx-1">
            <div className="logo-img">
              <img src={require("assets/img/logo.png")} alt="..." />
            </div>
          </a>
          <a className="simple-text ml-3" href="https://gabeo.ai/">
            ReNAD +
          </a>
        </div>
        <Nav>
          {routes.map((prop, key) => {
            if (!prop.redirect)
              return (
                <li
                  className={
                    prop.upgrade
                      ? "active active-pro"
                      : activeRoute(prop.layout + prop.path)
                  }
                  key={key}
                >
                  <NavLink
                    to={prop.layout + "/" + prop.path}
                    className="nav-link"
                    activeclassname="active"
                  >
                    <i className={prop.icon} />
                    <p>{prop.name}</p>
                  </NavLink>
                </li>
              );
            return null;
          })}
        </Nav>
        <div
          className="chat position-absolute w-100 align-items-center justify-center d-flex my-3"
          style={{ bottom: 0 }}
        >
          <textarea
            rows="2"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-75 ml-3 mr-auto p-3 positive t-0 r-0"
            placeholder="Ask me questions you have"
            style={{ borderRadius: "12px" }}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleSend(event);
              }
            }}
          />
          <button
            onClick={handleSend}
            className="mr-3 rounded-circle"
            style={{
              background: "linear-gradient(135deg, #f68234, #f21565)",
              width: "50px",
              height: "50px",
              border: "none",
            }}
          >
            <i>
              <svg
                id="ic_send"
                fill="rgb(255, 141, 168)"
                height="30"
                viewBox="0 0 23 23"
                width="30"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                <path d="M0 0h24v24H0z" fill="none"></path>
              </svg>
            </i>
          </button>
        </div>
        <div className="chat-history d-flex flex-column overflow-auto pb-5 p-3">
              {messages.map((message, index) => {
                return (
                  <div
                    className={messageClasses(message)}
                    style={messageStyle(message)}
                    key={index}
                  >
                    {message.message}
                  </div>
                );
              })}
          {/* {text} */}
          <div ref={ref}></div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
