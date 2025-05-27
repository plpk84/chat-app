import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {AuthProvider} from "./contexts/AuthProvider";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RecoverPage from "./pages/RecoverPage";
import ChatPage from "./pages/ChatPage";
import ContactsPage from "./pages/ContactsPage";

function App() {
  return (

    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/recover" element={<RecoverPage/>}/>
          <Route path="/chat" element={<ChatPage/>}/>
          <Route path="/contacts" element={<ContactsPage/>}/>
          <Route path="/" element={<ProfilePage/>}/>
        </Routes>
      </AuthProvider>
    </Router>

  );
}

export default App;