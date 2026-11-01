import { useState } from "react";
import { apiRequest } from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data = await apiRequest("/api/user_auth/login", {
                method: "POST",
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            console.log("LOGIN RESPONSE:", data);

            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);
            localStorage.setItem("role", data.role);

            alert("Login successful!");

            if (data.role === "MANAGER") {
                navigate("/dashboard");
            } else if (data.role === "DISPATCHER") {
                navigate("/dispatcher");
            } else if (data.role === "TECHNICIAN") {
                navigate("/technician");
            } else if (data.role === "CUSTOMER") {
                navigate("/customer");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Login failed:", error);

            alert(
                error instanceof Error
                    ? `Login failed: ${error.message}`
                    : "Login failed. Please check your username and password."
            );
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-logo">
                    <div className="login-logo-icon">▦</div>
                    <h1>FieldService</h1>
                </div>

                <h2>Welcome Back</h2>

                <p className="login-subtitle">
                    Sign in to your Field Service Management account
                </p>

                <form onSubmit={handleLogin}>

                    <div className="login-field">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Sign In
                    </button>

                </form>

                <p className="login-footer">
                    Field Service Management Platform
                </p>

            </div>

        </div>
    );
}

export default Login;