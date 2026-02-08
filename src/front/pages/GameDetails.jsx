// Import necessary hooks and components from react-router-dom and other libraries.
import { Link, useParams } from "react-router-dom";  // To use link for navigation and useParams to get URL parameters
import useGlobalReducer from "../hooks/useGlobalReducer";  // Import a custom hook for accessing the global state
import { useEffect, useState } from "react";

// Define and export the Single component which displays individual item details.
export const GameDetails = () => {
    // Access the global state using the custom hook.
    const params = useParams()
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [gameInfo, setGameInfo] = useState()
    const [rating, setRating] = useState()
    const [changes, setChanges] = useState(false)
    const handleFetch = async () => {
        try {
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

            const response = await fetch(backendUrl + "api/games/" + params.game_id + "/" + params.game_name);
            const datajson = await response.json();
            if (response.ok) {
                setGameInfo(datajson.games)
            }


        } catch (err) { }
    }

    const handleRating = async () => {
        try {
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

            const response = await fetch(backendUrl + "backlog/" + params.game_id);
            const datajson = await response.json();
            if (response.ok) {
                return datajson.rating
            }


        } catch (err) { }
    }

    const handleAddGames = async (game_id) => {

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}backlog`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({ game_id })
            });

            const data = await res.json();

            if (!res.ok) {
                return data.msg;
            }

        } catch (err) {

        }
    };

    useEffect(() => {
        handleFetch();
    }, [])

    useEffect(() => {
        handleFetch();
        setChanges(false)
    }, [changes])


    if (!localStorage.getItem("token")) {
        return (
            <div className="container text-center">
                <div>
                    <div>coverHere</div>
                    <h1>{gameInfo.name}</h1>
                    <h2>Genres: {gameInfo.genres}</h2>
                    <h4>{gameInfo.release_date}</h4>
                </div>
                <div>
                    <p>Description: {gameInfo.description}</p>
                    <p>Publisher: {gameInfo.publisher}</p>
                    <p>Developer: {gameInfo.developer}</p>
                    <p>Rating: {handleRating}</p>
                </div>
                <Link to="/games">
                    <span className="btn btn-primary btn-lg" href="#" role="button">
                        Games list
                    </span>
                </Link>
            </div>
        );
    }

    return (
        <div className="container text-center">
            <div>
                <div>coverHere</div>
                <h1>{gameInfo.name}</h1>
                <h2>Genres: {gameInfo.genres}</h2>
                <h4>{gameInfo.release_date}</h4>
            </div>
            <div>
                <p>Description: {gameInfo.description}</p>
                <p>Publisher: {gameInfo.publisher}</p>
                <p>Developer: {gameInfo.developer}</p>
                <p>Rating: {handleRating}</p>
            </div>
            <button onClick={() => handleAddGames(item.id)} >Add to backlog</button>
            <Link to="/games">
                <span className="btn btn-primary btn-lg" href="#" role="button">
                    Games list
                </span>
            </Link>
        </div>
    );
};