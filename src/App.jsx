//import React, { useState, useRef, useEffect } from "react";
import { useEffect, useRef, useState } from "react";

import "./App.css";

const App = () => {
  const [drawing, setDrawing] = useState(false);
  const [erasing, SetEraser] = useState(false);

  const [brushColor, SetBrushColor] = useState("green");
  const [brushSize, SetBrushSize] = useState(5);
  const [eraserSize, SetEraserSize] = useState(5);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoine = "round";
    ctx.lineWidth = brushSize;
    ctxRef.current = ctx;
  }, [brushSize]);

  const startDraw = (e) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setDrawing(true);
  };
  const endDraw = (e) => {
    ctxRef.current.closePath();
    setDrawing(false);
  };
  const draw = ({ nativeEvent }) => {
    if (!drawing) return;
    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.strokeStyle = erasing ? "white" : brushColor;
    ctxRef.current.lineWidth = erasing ? eraserSize : brushSize;
    ctxRef.current.stroke();
  };
  const handleEraseMode = () => {
    SetEraser(!erasing);
  };
  const handleSizeChange = (e) => {
    const newSize = Number(e.target.value);
    if (erasing) {
      SetEraserSize(newSize);
    } else {
      SetBrushSize(newSize);
    }
  };
  return (
    <div className="App">
      <h1>Paint App</h1>
      <div className="draw-area">
        <button onClick={handleEraseMode}>
          {erasing ? "Switch to Draw Mode" : "Switch to Erase Mode"}
        </button>
        <div className="menu">
          <label htmlFor="brush">Brush Color</label>
          <input
            disabled={erasing ? "disabled" : ""}
            type="color"
            onChange={SetBrushColor}
          />
          <label htmlFor="brush-size">
            {erasing ? "Eraser Size" : "Brush Size"}
          </label>

          <input
            type="range"
            value={erasing ? eraserSize : brushSize}
            min="3"
            max="50"
            onChange={handleSizeChange}
          />
        </div>
        <canvas
          width="1200px"
          height="500px"
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseUp={endDraw}
          onMouseMove={draw}
        ></canvas>
      </div>
    </div>
  );
};

export default App;
