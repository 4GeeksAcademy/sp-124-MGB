// Import necessary hooks and components from react-router-dom and other libraries.
import { Link } from "react-router-dom";  // To use link for navigation and useParams to get URL parameters
import useGlobalReducer from "../hooks/useGlobalReducer";  // Import a custom hook for accessing the global state
import { useEffect, useState } from "react";

// Define and export the Single component which displays individual item details.
export const Games = () => {
    // Access the global state using the custom hook.
    const { store } = useGlobalReducer();
    const [data, setData] = useState(null);
    const [changes, setChanges] = useState(false)
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const handleFetch = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

            const response = await fetch(backendUrl + "api/games");
            const datajson = await response.json();
            if (response.ok) {
                setData(datajson.games);
            }
        } catch (err) { }
    }

    const handleDelete = async (name) => {
        try {
            const res = await fetch(backendUrl + `api/games`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name })
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
                    Game: {item.name} description: {item.description}
                    genres: {item.genres} publisher: {item.publisher}
                    developer: {item.developer} cover_link: {item.cover_link}
                    release date: {item.release_date}
                    <Link to={`/games/edit/${item.name}`}><button >Edit</button></Link>
                    <button onClick={() => handleDelete(item.name)} >Delete</button>
                </li>)}
            </ul>
            <Link to="/games/add">
                <span className="btn btn-primary btn-lg" href="#" role="button">
                    Add Game
                </span>
            </Link>
            <Link to="/">
                <span className="btn btn-primary btn-lg" href="#" role="button">
                    Back home
                </span>
            </Link>
        </div>
    );
};