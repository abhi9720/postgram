import { useContext, useRef } from "react";
import "./login.css";
import { Link } from "react-router-dom";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import { useAlert, positions } from "react-alert";
const Login = () => {
  const email = useRef();
  const password = useRef();
  const { isFetching, dispatch } = useContext(AuthContext);
  const alert = useAlert();
  const handleClick = async (e) => {
    e.preventDefault();
    const res = await loginCall(
      { email: email.current.value, password: password.current.value },
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
          Invalid username or password
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

  return (
    <>
      <div className="login">
        <div className="loginWrapper">
          <div className="loginLeft">
            <h3 className="loginLogo">Postgram</h3>
            <span className="loginDesc">
              Connect with friends and the world around you on Lampsocial.com
            </span>
          </div>
          <div className="loginRight">
            <form className="loginBox" onSubmit={handleClick}>
              <input
                type="email"
                className="loginInput"
                placeholder="Email"
                ref={email}
                required
              />
              <input
                type="password"
                minLength="6"
                className="loginInput"
                placeholder="Enter your Password"
                ref={password}
                required
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
