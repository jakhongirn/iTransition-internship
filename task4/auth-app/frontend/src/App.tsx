import LoginForm from "./components/Login";
import SignUpForm from "./components/SignUp";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";
import UsersManagement from "./components/UsersManagement";



function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/users" element={<UsersManagement />} />
                <Route path="/" element={<Navigate to="/users" />} />
                <Route path="/signup" element={<SignUpForm />} />
            </Routes>
        </Router>
    );
}

export default App;
