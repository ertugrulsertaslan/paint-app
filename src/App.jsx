import Paint from "./paint.jsx";
import React, { useState } from "react";

const App = () => {
  const [drawingDataURL, setDrawingDataURL] = useState("");

  const handleDrawingChange = (dataURL) => {
    setDrawingDataURL(dataURL);
  };

  return (
    <div className="flex">
      <Paint value={drawingDataURL} onChange={handleDrawingChange} />
      <Paint value={drawingDataURL} onChange={handleDrawingChange} />
    </div>
  );
};

export default App;
