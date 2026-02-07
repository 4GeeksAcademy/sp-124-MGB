import { Link, useParams, useNavigate } from "react-router-dom";  // To use link for navigation and useParams to get URL parameters
import useGlobalReducer from "../hooks/useGlobalReducer";  // Import a custom hook for accessing the global state
import { useState } from "react";

export const Edit = () => {
    const navigate = useNavigate();
    const usernameToEdit = useParams();
    const { store } = useGlobalReducer();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const handleEdit = async (e) => {
        e.preventDefault();
        if (username != "") {
            fetchData(usernameToEdit.username, username);
        }
        if (email != "") {
            fetchData(usernameToEdit.username, email);
        }
        if (password != "") {
            fetchData(usernameToEdit.username, password);
        }
    }
    const fetchData = async (username, dataToFetch) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}profiles/settings`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({ username, dataToFetch })
            });

            const data = await res.json();

            if (!res.ok) {
                return data.msg;
            }

            navigate("/users")

        } catch (err) {

        }
    }

    return (
        <div className="container mt-5">
            <h2 className="display-6">Edit account details</h2>
            <form onSubmit={handleEdit}>
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
                    <input className="form-control"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-secondary">Edit</button>
            </form>
            <Link to="/">
                <span className="btn btn-primary btn-lg" href="#" role="button">
                    Back home
                </span>
            </Link>
        </div>
    )
}