import React from 'react'
import ChatUI from './pages/ChatUI'
import Home from './pages/Home'
import {  Routes, Route } from "react-router";

function App() {
  return (
    <div>
     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat/:name" element={<ChatUI />} />
      </Routes>

    </div>
  )
}

export default App