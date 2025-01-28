import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom"
import AddTemplate from "./pages/AddTemplate.tsx";
import ListTemplates from "./pages/ListTemplates.tsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/addTemplate" element={<AddTemplate/>} />
        <Route path="/" element={<ListTemplates/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
