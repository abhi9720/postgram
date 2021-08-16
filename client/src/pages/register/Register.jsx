import "./register.css";
import { useState } from "react";
import axios from "axios";
import React from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useAlert, positions } from "react-alert";
import { CircularProgress, TextField } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const Login = () => {
  const [field, setField] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const status = React.useRef(false);

  const history = useHistory();
  const [loading, setloading] = useState(false);
  const alert = useAlert();
  const [values, setValues] = React.useState({
    showPassword: false,
  });

  const inputEvent = (event) => {
    const { value, name } = event.target;
    setField((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: field.username,
      email: field.email,
      password: field.password,
    };
    const confirmPassword = field.confirmPassword;

    if (user.password === "undefined" || user.password !== confirmPassword) {
      alert.error(
        <div
          style={{
            color: "red",
          }}
        >
          Password mismatch
        </div>,
        {
          position: positions.TOP_CENTER,
          containerStyle: {
            backgroundColor: "white",
          },
        }
      );
    } else {
      try {
        setloading(true);
        await axios.post("/auth/register", user);
        history.push("/login");
      } catch (err) {
        console.log(err);
        alert.error(
          <div
            style={{
              color: "red",
            }}
          >
            Username or email id already exits
          </div>,
          {
            position: positions.TOP_RIGHT,
            containerStyle: {
              backgroundColor: "white",
            },
          }
        );

        console.log(err);
      } finally {
        setloading(false);
      }
    }
  };

  const handleClickShowPassword = () => {
    setValues({ showPassword: !values.showPassword });
  };

  return (
    <>
      <div className="register">
        <div className="registerWrapper">
          <div className="registerLeft">
            <h3 className="registerLogo">Postgram</h3>
            <span className="registerDesc">
              Connect with friends and the world around you on
              postgram-social.herokuapp.com
            </span>
          </div>
          <div className="registerRight">
            <form className="registerBox" onSubmit={handleSubmit}>
              <TextField
                type="text"
                id="filled-basic"
                name="username"
                variant="filled"
                onChange={inputEvent}
                value={field.username}
                required
                label="Username"
              />

              <TextField
                id="filled-email-input"
                label="Email"
                type="email"
                name="email"
                variant="filled"
                onChange={inputEvent}
                value={field.email}
                required
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
              <TextField
                id="filled-password-input"
                label="Confirm Password"
                variant="filled"
                name="confirmPassword"
                type={values.showPassword ? "text" : "password"}
                onChange={inputEvent}
                value={field.confirmPassword}
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
              {status.current && (
                <small style={{ color: "red" }}>* Password not match </small>
              )}
              <button type="submit" className="registerButton">
                {loading ? (
                  <CircularProgress color="primary" size="24px" />
                ) : (
                  "Register"
                )}
              </button>
            </form>

            <span className="registerAccount">
              Having an account ?
              <Link
                to="/login"
                style={{ textDecoration: "none" }}
                className="registerRegisterButton"
              >
                Sign In
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
