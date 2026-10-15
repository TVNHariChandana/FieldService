import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DispatcherLogin() {

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

            if (response.data.role !== "DISPATCHER") {
                alert("This account is not a Dispatcher account.");
                return;
            }

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("role", response.data.role);

            alert("Dispatcher login successful!");

            navigate("/dispatcher");

        } catch (error) {

            console.error("Dispatcher login failed:", error);

            alert(
                "Dispatcher login failed. Please check your username and password."
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
                    Dispatcher Login
                </h2>

                <p className="login-subtitle">
                    Sign in to access the Dispatcher Dashboard
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
                        Dispatcher Sign In
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

export default DispatcherLogin;