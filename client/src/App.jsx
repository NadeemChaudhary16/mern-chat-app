import { useState } from 'react'
import './App.css'
import { Button } from "@/components/ui/button"
import {Routes,Navigate,Route} from "react-router-dom"
// import Auth from "./pages/auth"
import Auth from "./pages/auth/Auth"
import Chat from "./pages/chat/Chat"
import Profile from "./pages/profile"
import Home  from "./pages/home"

function App() {
 

  return (
   
    <Routes>
       <Route path="/" element={<Home/>} ></Route>
      <Route path="/auth" element={<Auth/>}></Route>
      <Route path="/chat" element={<Chat/>}></Route>
      <Route path="/profile" element={<Profile/>}></Route>
      <Route path="*" element={<Navigate to="/auth" />}></Route>
    </Routes>
  
  )
}

export default App
