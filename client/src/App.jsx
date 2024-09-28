
import './App.css'
import {Routes,Navigate,Route} from "react-router-dom"

import Auth from "./pages/auth/Auth"
import Chat from "./pages/chat/Chat"
import Profile from "./pages/profile"


function App() {
 

  return (
   
    <Routes>
       {/* <Route path="/" element={<Home/>} ></Route> */}
      <Route path="/auth" element={<Auth/>}></Route>
      <Route path="/chat" element={<Chat/>}></Route>
      <Route path="/profile" element={<Profile/>}></Route>
      <Route path="*" element={<Navigate to="/auth" />}></Route>
    </Routes>
  
  )
}

export default App
