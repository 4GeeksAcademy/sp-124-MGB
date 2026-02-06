// Import necessary hooks and components from react-router-dom and other libraries.
import { Link } from "react-router-dom";  // To use link for navigation and useParams to get URL parameters
import useGlobalReducer from "../hooks/useGlobalReducer";  // Import a custom hook for accessing the global state
import { useEffect, useState } from "react";

// Define and export the Single component which displays individual item details.
export const Users = () => {
    // Access the global state using the custom hook.
    const { store } = useGlobalReducer();
    const [data, setData] = useState(null);
    const [changes, setChanges] = useState(false)
    const handleFetch = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

            const response = await fetch(backendUrl + "api/users");
            const datajson = await response.json();
            if (response.ok) {
                setData(datajson.users);
            }
        } catch (err) { }
    }

    const handleDelete = async (username) => {
        try {
            const res = await fetch(backendUrl + `profiles/settings`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
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

    if (!data) return <p>Loading ...</p>;

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
            <Link to="/signup">
                <button className="btn btn-primary btn-lg" href="#">Signup</button>
            </Link>
            <Link to="/login">
                <button className="btn btn-primary btn-lg" href="#">Login</button>
            </Link>
            <Link to="/">
                <span className="btn btn-primary btn-lg" href="#" role="button">
                    Back home
                </span>
            </Link>
        </div>
    );
};