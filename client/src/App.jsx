import React from 'react'
import ChatUI from './pages/ChatUI'
import Auth from './pages/Auth'
import Home from './pages/Home'
import ChatList from './pages/ChatList';
import { Routes, Route } from "react-router";

function App() {
  return (
    <div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        {/* <Route path="/chats" element={<ChatList />} /> */}
        <Route path="/chat/:sender/:receiver" element={<ChatUI />} />

      </Routes>

    </div>
  )
}

export default App