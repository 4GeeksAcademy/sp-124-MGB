import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(backendUrl + "api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",

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
            localStorage.setItem("admin", data.role);
            navigate(-1);
        } catch (err) {

        }
    };

    return (
        <div className="container mt-5">
            <h2 className="display-6">Login</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-3 d-flex m-2 gap-2">
                    <input className="form-control"
                        type="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input className="form-control"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-secondary">Login</button>
            </form>
        </div>
    );
};