import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/signup`, {
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
            navigate("/users")

        } catch (err) {

        }
    };

    return (
        <div className="container mt-5">
            <h2 className="display-6">Create account</h2>
            <form onSubmit={handleSignup}>
                <div className="mb-3 d-flex m-2 gap-2">
                    <input className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
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
                <button type="submit" className="btn btn-secondary">Create account</button>
            </form>
            <Link to="/">
                <span className="btn btn-primary btn-lg" href="#" role="button">
                    Back home
                </span>
            </Link>
        </div>
    );
};