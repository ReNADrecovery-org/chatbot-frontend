import React from "react";
import { environment } from "environment";
import { useNavigate } from "react-router-dom";
import { useAuth } from "components/Auth/AuthContext";
import httpClient from "components/Auth/httpClient";

function SignInForm() {
  const { dispatch } = useAuth();
  const navigate = useNavigate();
  const BASE_URL = environment.BASE_URL;
  console.log(BASE_URL);
  const [state, setState] = React.useState({
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

    const { email, password } = state;
    const res = await httpClient.post(`${BASE_URL}/api/login`, {
      email,
      password,
    });
    if (res.status === 200) {
      const user = { id: res.data.id, email: res.data.email };
      dispatch({ type: "LOGIN", user });
      navigate("/admin");
    }

    for (const key in state) {
      setState({
        ...state,
        [key]: "",
      });
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Sign in</h1>
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
        <span>or use your account</span>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={state.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
        />
        <a href="#">Forgot your password?</a>
        <button>Sign In</button>
      </form>
    </div>
  );
}

export default SignInForm;
