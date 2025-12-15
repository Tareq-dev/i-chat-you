import React from 'react'
import ChatUI from './pages/ChatUI'
import Auth from './pages/Auth'
import Home from './pages/Home'
import { Routes, Route } from "react-router";
import ChatList from './pages/ChatList';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        {/* <Route path="/chats" element={<ChatList />} /> */}
        <Route path="/chat/:conversationId" element={<ChatUI />} />
      </Routes>
    </div>
  )
}

export default App