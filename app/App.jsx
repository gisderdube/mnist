import React, { useState, useRef } from "react";
import styled from "styled-components";
import axios from "axios";

import GlobalStyles from "./GlobalStyles";
import Drawer from "./Drawer";
import Result from "./Result";

import { dataURItoBlob } from "./utils";

const Container = styled.div`
  padding: 25px calc((100vw - 860px) / 2);

  @media (max-width: 900px) {
    padding: 25px 20px;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const Image = styled.img`
  height: 150px;
  margin: 15px;
  cursor: ${(props) => (props.isLoading ? "progress" : "pointer")};
`;

const App = () => {
  const [state, setState] = useState({
    loading: false,
    result: null,
  });

  async function classify(file) {
    setState({
      loading: true,
    });

    const blob = dataURItoBlob(file);
    const formData = new FormData();
    formData.append("file", blob);

    const result = await axios.post(
      `${process.env.SERVER_URL || ""}/classify`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    setState({
      loading: false,
      result: result.data,
    });
  }

  return (
    <Container>
      <GlobalStyles></GlobalStyles>
      <h1>Dube.io MNIST Detector</h1>
      <p>
        Draw a single digit in the field below and see if the classifier
        correctly detects it!
      </p>
      <Drawer
        setImage={classify}
        resetResult={() => setState({ ...state, result: null })}
      ></Drawer>
      <Result loading={state.loading} result={state.result}></Result>
      <br />
      <br />
      <br />

      <hr />
      <p style={{ textAlign: "center" }}>
        Read the corresponding&nbsp;
        <a href="https://github.com/gisderdube" target="_blank">
          article on Medium
        </a>{" "}
      </p>
      <p style={{ textAlign: "center" }}>
        Built by{" "}
        <a href="https://github.com/gisderdube" target="_blank">
          Lukas Gisder-Dubé
        </a>{" "}
        with the help of{" "}
        <a href="https://www.fast.ai/" target="_blank">
          fast.ai
        </a>
      </p>
    </Container>
  );
};

export default App;
