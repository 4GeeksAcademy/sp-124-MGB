import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(backendUrl + "api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password, username })
            });

            const data = await res.json();

            if (!res.ok) {
                return data.msg;
            }
            navigate("/")

        } catch (err) {

        }
    };

    return (
        <div className="container mt-5">
            <h2 className="display-6 login-color">Create account</h2>
            <form onSubmit={handleSignup}>
                <div className="mt-3 d-md-flex gap-2 justify-content-md-center">
                    <input className="form-control mb-3"
                        type="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input className="form-control mb-3"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input className="form-control mb-3"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="d-md-inline d-sm-flex justify-content-sm-center">
                    <button type="submit" className="btn button-css">Signup</button>
                </div>
            </form>
        </div>
    );
};