import React from "react";
import httpClient from "components/Auth/httpClient";
import { useNavigate } from "react-router-dom";
import { environment } from "environment";
import { useAuth } from "components/Auth/AuthContext";

function SignUpForm() {
  const BASE_URL = environment.BASE_URL;
  const { dispatch } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    name: "",
    email: "",
    password: "",
  });
  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    const { name, email, password } = state;
    console.log(name, email, password);
    const res = await httpClient.post(`${BASE_URL}/api/register`, {
      name,
      email,
      password,
    });
    if (res.status === 200) {
      const user = { id: res.data.id, email: res.data.email };
      dispatch({ type: "LOGIN", user });
      navigate("/admin");
    }

    alert(`You are sign up with email: ${email} and password: ${password}`);

    for (const key in state) {
      setState({
        ...state,
        [key]: "",
      });
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Create Account</h1>
        <div className="social-container">
          <a href="#" className="social">
            <i className="fab fa-facebook-f" />
          </a>
          <a href="#" className="social">
            <i className="fab fa-google-plus-g" />
          </a>
          <a href="#" className="social">
            <i className="fab fa-linkedin-in" />
          </a>
        </div>
        <span>or use your email for registration</span>
        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <button>Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;
