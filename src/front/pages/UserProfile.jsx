// Import necessary hooks and components from react-router-dom and other libraries.
import { Link, useParams } from "react-router-dom";  // To use link for navigation and useParams to get URL parameters
import useGlobalReducer from "../hooks/useGlobalReducer";  // Import a custom hook for accessing the global state
import { useEffect, useState } from "react";

// Define and export the Single component which displays individual item details.
export const UserProfile = () => {
    // Access the global state using the custom hook.
    const username = useParams()
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [backlog, setBacklog] = useState([]);
    const [statusGame, setStatus] = useState();
    const [rating, setRating] = useState();
    const [gamesinfo, setGamesinfo] = useState([]);
    const [changes, setChanges] = useState(false)

    const handleFetch = async () => {
        try {
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

            const response = await fetch(backendUrl + "api/backlog/" + username.username);
            const datajson = await response.json();
            if (response.ok) {
                setBacklog(datajson.backlog);
                setGamesinfo(datajson.games)
            }


        } catch (err) { }
    }

    const handleEdit = async () => {
        return (
            <p>a</p>)
    }

    const renderCards = () => {
        const cards = [];
        for (let i = 0; i < gamesinfo.length; i++) {
            cards.push(<li key={i}>Game: {gamesinfo[i].name} Rating:
                {backlog[i].rating} Status: {backlog[i].status}
                <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Dropdown button
                    </button>
                    <ul className="dropdown-menu">
                        <li className="dropdown-item">{handleEdit}</li>
                    </ul>
                </div>
            </li>)
        }
        return cards
    }

    useEffect(() => {
        handleFetch();
    }, [])

    useEffect(() => {
        handleFetch();
        setChanges(false)
    }, [changes])

    return (
        <div className="container text-center">
            <h1>{username.username}</h1>
            <ul>
                {renderCards()}
            </ul>
        </div>
    );
};