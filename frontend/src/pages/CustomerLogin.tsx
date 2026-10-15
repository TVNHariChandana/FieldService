import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CustomerLogin() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {

        e.preventDefault();

        try {

            const response = await axios.post(
                "http://localhost:8080/api/user_auth/login",
                {
                    username,
                    password,
                }
            );

            console.log("LOGIN RESPONSE:", response.data);

            if (response.data.role !== "CUSTOMER") {
                alert("This account is not a Customer account.");
                return;
            }

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("role", response.data.role);

            alert("Customer login successful!");

            navigate("/customer");

        } catch (error) {

            console.error("Customer login failed:", error);

            alert(
                "Customer login failed. Please check your username and password."
            );
        }
    };

    return (

        <div className="login-page">

            <div className="login-card">

                <div className="login-logo">

                    <div className="login-logo-icon">
                        ▦
                    </div>

                    <h1>
                        FieldService
                    </h1>

                </div>

                <h2>
                    Customer Login
                </h2>

                <p className="login-subtitle">
                    Sign in to access your Customer Portal
                </p>

                <form onSubmit={handleLogin}>

                    <div className="login-field">

                        <label>
                            Username
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="login-field">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="login-button"
                    >
                        Customer Sign In
                    </button>

                </form>

                <button
                    type="button"
                    className="back-login-btn"
                    onClick={() => navigate("/")}
                >
                    ← Back to Role Selection
                </button>

                <p className="login-footer">
                    Field Service Management Platform
                </p>

            </div>

        </div>
    );
}

export default CustomerLogin;