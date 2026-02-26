import { useParams, useNavigate } from "react-router-dom";  // To use link for navigation and useParams to get URL parameters
import { useState } from "react";

export const Edit = () => {
    const navigate = useNavigate();
    const usernameToEdit = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
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
            const res = await fetch(backendUrl + "api/profiles/settings", {
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

            navigate(-1)

        } catch (err) {

        }
    }

    if (localStorage.getItem("admin") == "true" || usernameToEdit.username == localStorage.getItem("username")) {
        return (
            <div className="container mt-5">
                <h2 className="display-6 login-color">Edit account details {usernameToEdit.username}</h2>
                <form onSubmit={handleEdit}>
                    <div className="mt-3 d-md-flex gap-2 justify-content-md-center">
                        <input className="form-control mb-3"
                            type="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input className="form-control mb-3"
                            type="email"
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
                        <button type="submit" className="btn button-css">Edit</button>
                    </div>
                </form>
            </div>
        )
    }
    return (
        <p>Nope</p>
    )
}