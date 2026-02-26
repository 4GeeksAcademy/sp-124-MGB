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
            <h2 className="display-6 login-color">Login</h2>
            <form onSubmit={handleLogin}>
                <div className="mt-3 d-md-flex gap-2 justify-content-md-center">
                    <input className="form-control mb-3"
                        type="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input className="form-control mb-3"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div >
                <div className="d-md-inline d-sm-flex justify-content-sm-center">
                    <button type="submit" className="btn button-css">Login</button>
                </div>
            </form>
        </div>
    );
};