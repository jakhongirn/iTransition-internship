import { useState } from "react";
import LoginForm from "./components/Login"
import SignUpForm from "./components/SignUp"
import { BrowserRouter as Router, Route,Routes,  Navigate } from 'react-router-dom';



SignUpForm

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  const handleAuthentication = () => {
     setIsAuthenticated(true)
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/users" /> : <LoginForm setIsAuthenticated={handleAuthentication}/>} />
        <Route path="/users" element={isAuthenticated ? <h1>Hello</h1> : <Navigate to="/login" />} />
        <Route path="/" element={isAuthenticated ? <Navigate to="/users" /> : <Navigate to="/login" />} />
        <Route path="/signup" element={<SignUpForm />}/>
      </Routes>
    </Router>
  )
}

export default App
