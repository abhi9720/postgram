import { useContext, useState } from "react";
import "./login.css";
import React from "react";

import { Link } from "react-router-dom";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress, TextField } from "@material-ui/core";
import { useAlert, positions } from "react-alert";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const Login = () => {
  const [field, setField] = useState({
    email: "",
    password: "",
  });

  const [values, setValues] = React.useState({
    showPassword: false,
  });
  const inputEvent = (event) => {
    const { value, name } = event.target;
    console.log(value, name);
    setField((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const { isFetching, dispatch } = useContext(AuthContext);
  const alert = useAlert();
  const handleClick = async (e) => {
    e.preventDefault();
    console.log({ email: field.email, password: field.password });
    const res = await loginCall(
      { email: field.email, password: field.password },
      dispatch
    );
    if (res === 200) {
      alert.success(
        <div
          style={{
            color: "white",
            padding: "5px 5px",
          }}
        >
          Login Successfull
        </div>,
        { position: positions.BOTTOM_RIGHT }
      );
    } else {
      alert.error(
        <div
          style={{
            color: "red",
          }}
        >
          Invalid Email or password
        </div>,
        {
          position: positions.TOP_RIGHT,
          containerStyle: {
            backgroundColor: "white",
          },
        }
      );
    }
  };
  const handleClickShowPassword = () => {
    setValues({ showPassword: !values.showPassword });
  };

  return (
    <>
      <div className="login">
        <div className="loginWrapper">
          <div className="loginLeft">
            <h3 className="loginLogo">Postgram</h3>
            <span className="loginDesc">
              Connect with friends and the world around you on
              postgram-social.herokuapp.com
            </span>
          </div>
          <div className="loginRight">
            <form className="loginBox" onSubmit={handleClick}>
              <TextField
                id="filled-email-input"
                label="Email"
                type="email"
                name="email"
                variant="filled"
                onChange={inputEvent}
                value={field.email}
                validators={["required", "isEmail"]}
              />

              <TextField
                id="filled-password-input"
                label="Password"
                variant="filled"
                required
                name="password"
                type={values.showPassword ? "text" : "password"}
                onChange={inputEvent}
                value={field.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        // onMouseDown={handleMouseDownPassword}
                      >
                        {values.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <button
                type="submit"
                className="loginButton"
                disabled={isFetching}
              >
                {isFetching ? (
                  <CircularProgress color="primary" size="24px" />
                ) : (
                  "Log In"
                )}
              </button>
              {/* <span className="loginForget">Forgot Password</span> */}
            </form>
            <span className="registerNew">
              Don't have an account?
              <Link
                to="/register"
                style={{ textDecoration: "none" }}
                className="loginRegisterButton"
              >
                Sign Up
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
