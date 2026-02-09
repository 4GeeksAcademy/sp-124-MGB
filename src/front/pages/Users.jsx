// Import necessary hooks and components from react-router-dom and other libraries.
import { Link } from "react-router-dom";  // To use link for navigation and useParams to get URL parameters
import useGlobalReducer from "../hooks/useGlobalReducer";  // Import a custom hook for accessing the global state
import { useEffect, useState } from "react";

// Define and export the Single component which displays individual item details.
export const Users = () => {
    // Access the global state using the custom hook.
    const [data, setData] = useState(null);
    const [changes, setChanges] = useState(false)
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const handleFetch = async () => {
        try {
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");
            const response = await fetch(backendUrl + "api/users", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            });
            const datajson = await response.json();
            if (response.ok) {
                setData(datajson.users);
            }
        } catch (err) { }
    }

    const handleDelete = async (username) => {
        try {
            const res = await fetch(backendUrl + `api/profiles/settings`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({ username })
            });
            const data = await res.json();
            setChanges(true);
            if (!res.ok) {
                return data.msg;
            }

        } catch (err) {

        }
    }

    useEffect(() => {
        handleFetch();
    }, [])

    useEffect(() => {
        handleFetch();
        setChanges(false)
    }, [changes])

    if (!data) return <p>YOU SHOULD NOT BE HERE, AWAYYYYY</p>;

    return (
        <div className="container text-center">
            <ul>
                {data.map((item, index) => <li key={index}>
                    Username: {item.username} Email: {item.email}
                    <Link to={`/edit/${item.username}`}><button >Edit</button></Link>
                    <Link to={`/profiles/${item.username}`}><button >Profile</button></Link>
                    <button onClick={() => handleDelete(item.username)} >Delete</button>
                </li>)}
            </ul>
            <Link to="/">
                <span className="btn btn-primary btn-lg" href="#" role="button">
                    Back home
                </span>
            </Link>
        </div>
    );
};