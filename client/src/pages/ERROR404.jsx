import React from "react";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";

const ERROR404 = () => {
  const history = useHistory();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        maxHeight: "90vh",
        flexDirection: "column",
      }}
    >
      <img src={"../assets/404.png"} alt="page not found" />
      <Button
        variant="contained"
        color="secondary"
        size="large"
        style={{ position: "absolute", top: "80%" }}
        onClick={() => history.push("/")}
      >
        BACK TO SAFTY
      </Button>
    </div>
  );
};

export default ERROR404;
