import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer"

export const Login = () => {
    const navigate = useNavigate();
    const { store } = useGlobalReducer();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!res.ok) {
                return data.msg;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("email", data.email);
            localStorage.setItem("username", username);

            navigate("/")
        } catch (err) {

        }
    };

    return (
        <div className="container mt-5">
            <h2 className="display-6">Create account</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-3 d-flex m-2 gap-2">
                    <input className="form-control"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input className="form-control"
                        type="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-secondary">Login</button>
            </form>
            <Link to="/">
                <span className="btn btn-primary btn-lg" href="#" role="button">
                    Back home
                </span>
            </Link>
        </div>
    );
};