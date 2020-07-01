import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import moment from "moment";

import { useInterval } from "./utils";

const StyledDrawer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 25px 0;
`;

let lastX, lastY, lastDraw, shouldReset;

const Drawer = ({ setImage, resetResult }) => {
  const width = 280;
  const height = width;

  const [mouseDown, setMouseDown] = useState(false);

  const ref = useRef(null);

  useInterval(() => {
    const millisDiff = moment().diff(moment(lastDraw), "millis");
    if (millisDiff > 1250) {
      const image = ref.current.toDataURL("image/png");
      setImage(image);
      lastDraw = undefined;
      shouldReset = true;
    }
  }, 1000);

  useEffect(() => {
    reset();
  }, []);

  function reset() {
    const ctx = ref.current.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    shouldReset = false;
    resetResult();
  }

  useEffect(() => {
    if (!mouseDown) return;
    const draw = (x, y) => {
      const ctx = ref.current.getContext("2d");
      if (lastX && lastY) {
        ctx.beginPath();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 25;
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
      }
      lastX = x;
      lastY = y;
      lastDraw = new Date().getTime();
    };

    const mouseMoveListener = (evt) => {
      draw(
        evt.pageX - ref.current.getBoundingClientRect().left,
        evt.pageY - ref.current.getBoundingClientRect().top
      );
    };

    const mouseUpListener = (evt) => {
      setMouseDown(false);
    };

    ref.current.addEventListener("mousemove", mouseMoveListener);
    window.addEventListener("mouseup", mouseUpListener);

    return () => {
      lastX = undefined;
      lastY = undefined;
      ref.current.removeEventListener("mousemove", mouseMoveListener);
      window.removeEventListener("mouseup", mouseUpListener);
    };
  }, [mouseDown]);

  useEffect(() => {
    const mouseDownListener = (e) => {
      setMouseDown(true);
      if (shouldReset) reset();
    };

    ref.current.addEventListener("mousedown", mouseDownListener);

    return () =>
      ref.current.removeEventListener("mousedown", mouseDownListener);
  }, []);

  return (
    <StyledDrawer>
      <canvas ref={ref} width={width} height={height}></canvas>
      <button onClick={reset} style={{ marginTop: 10 }}>
        Clear
      </button>
    </StyledDrawer>
  );
};

export default Drawer;
