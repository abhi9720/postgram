import "./register.css";
import { useRef, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useAlert, positions } from "react-alert";
import { CircularProgress } from "@material-ui/core";
const Login = () => {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();
  const history = useHistory();
  const [loading, setloading] = useState(false);
  const alert = useAlert();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.current.value !== confirmPassword.current.value) {
      
      password.current.setCustomValidity("password donot match");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        setloading(true);
        await axios.post("/auth/register", user);
        history.push("/login");
      } catch (err) {
        alert.error(
          <div
            style={{
              color: "red",
            }}
          >
            Username or emailid already exits
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

  return (
    <>
      <div className="register">
        <div className="registerWrapper">
          <div className="registerLeft">
            <h3 className="registerLogo">Postgram</h3>
            <span className="registerDesc">
              Connect with friends and the world around you on Lampsocial.com
            </span>
          </div>
          <div className="registerRight">
            <form className="registerBox" onSubmit={handleSubmit}>
              <input
                type="text"
                className="registerInput"
                placeholder="Username"
                ref={username}
                required
                minLength="3"
              />
              <input
                type="email"
                className="registerInput"
                placeholder="Email"
                ref={email}
                required
              />
              <input
                type="password"
                className="registerInput"
                placeholder="Password"
                ref={password}
                minLength="6"
                required
              />
              <input
                type="password"
                className="registerInput"
                placeholder="Confirm Password"
                ref={confirmPassword}
                minLength="6"
                required
              />
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
