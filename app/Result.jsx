import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 50px;
  /* background-color: rgb(245, 245, 245); */
`;

const Result = ({ loading, result }) => {
  return (
    <Wrapper>
      {loading && <h4>Loading...</h4>}
      {result && (
        <h3>
          Predicted Digit: {result.class} - Probablity:{" "}
          {(result.probability * 100).toFixed(4)} %
        </h3>
      )}
    </Wrapper>
  );
};

export default Result;
