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
    const resizeCanvas = () => {
      canvas.width = window.innerWidth - 400;
      canvas.height = window.innerHeight - 200;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const getTouchPos = (canvasDom, touchEvent) => {
    const rect = canvasDom.getBoundingClientRect();
    return {
      x: touchEvent.touches[0].clientX - rect.left,
      y: touchEvent.touches[0].clientY - rect.top,
    };
  };

  const isWithinBounds = (x, y) => {
    const canvas = canvasRef.current;
    return x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height;
  };

  const startTouchDrawing = (event) => {
    const touchPos = getTouchPos(canvasRef.current, event);
    if (isWithinBounds(touchPos.x, touchPos.y)) {
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(touchPos.x, touchPos.y);
      setDrawing(true);
    }
  };

  const drawTouch = (event) => {
    if (!drawing) return;
    const touchPos = getTouchPos(canvasRef.current, event);
    if (isWithinBounds(touchPos.x, touchPos.y)) {
      ctxRef.current.lineTo(touchPos.x, touchPos.y);
      ctxRef.current.strokeStyle = erasing ? "white" : brushColor;
      ctxRef.current.lineWidth = erasing ? eraserSize : brushSize;
      ctxRef.current.stroke();
    }
  };

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
  const handleSizeChange = (e) => {
    const newSize = Number(e.target.value);
    if (erasing) {
      SetEraserSize(newSize);
    } else {
      SetBrushSize(newSize);
    }
  };
  const handleColorChange = (e) => {
    SetBrushColor(e.target.value);
  };
  return (
    <div className="bg-blue-500 min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col">
        <div className="w-full flex justify-around items-center mb-2 bg-white p-5 rounded-xl sm:p-1">
          <div className="mr-5">
            <p className="p-3 rounded-xl ml-1 font-serif">Colors</p>
            <input
              className="mt-3 ml-4"
              disabled={erasing ? "disabled" : ""}
              type="color"
              onChange={handleColorChange}
            />
          </div>
          <div className="text-center mt-6">
            <div className="flex">
              <button
                className="p-2 font-serif"
                onClick={() => SetEraser(true)}
              >
                🧼 Eraser
              </button>
              <button
                className="p-2 font-serif"
                onClick={() => SetEraser(false)}
              >
                🖌️ Brush
              </button>
            </div>
            <input
              type="range"
              className="h-2 mt-5 mb-6 bg-gray-300 rounded-xl"
              value={erasing ? eraserSize : brushSize}
              min="3"
              max="40"
              onChange={handleSizeChange}
            />
          </div>
        </div>
        <canvas
          className=" bg-white rounded-xl"
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseUp={endDraw}
          onMouseMove={draw}
          onTouchStart={startTouchDrawing}
          onTouchEnd={endDraw}
          onTouchMove={drawTouch}
          style={{ touchAction: "none" }}
        />
      </div>
    </div>
  );
};

export default App;
