// Import necessary hooks and components from react-router-dom and other libraries.
import { Link, useParams } from "react-router-dom";  // To use link for navigation and useParams to get URL parameters
import useGlobalReducer from "../hooks/useGlobalReducer";  // Import a custom hook for accessing the global state
import { useEffect, useState } from "react";

// Define and export the Single component which displays individual item details.
export const GameDetails = () => {
    // Access the global state using the custom hook.
    const params = useParams();
    const game_name = params.game_name;
    const game_id = params.game_id;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [gameInfo, setGameInfo] = useState({});
    const [reviews, setReviews] = useState([]);
    const handleFetch = async () => {
        try {
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");
            const response = await fetch(backendUrl + "api/games/" + game_name + "/" + game_id);
            const datajson = await response.json();
            if (response.ok) {
                setGameInfo(datajson.game)
            }


        } catch (err) { }
    }

    const handleRating = async () => {
        try {
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

            const response = await fetch(backendUrl + "backlog/" + game_id);
            const datajson = await response.json();
            if (response.ok) {
                return datajson.rating
            }


        } catch (err) { }
    }

    const handleAddGames = async (game_id) => {
        try {
            const res = await fetch(backendUrl + "backlog", {
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

    const handleReviews = async () => {
        try {
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

            const response = await fetch(backendUrl + "api/reviews/" + params.game_id);
            const datajson = await response.json();
            if (response.ok) {
                setReviews(datajson.reviews)
            }


        } catch (err) { }
    }

    useEffect(() => {
        handleFetch();
        handleRating();
    }, [])

    if (!gameInfo) {
        return (
            <p>a</p>
        )
    }

    if (!localStorage.getItem("token")) {
        return (
            <div className="container text-center">
                <div>
                    <div>coverHere</div>
                    <h1>{gameInfo.name}</h1>
                    <h2>Genres: {gameInfo.genres}</h2>
                    <h4>Release date: {gameInfo.release_date}</h4>
                </div>
                <div>
                    <p>Description: {gameInfo.description}</p>
                    <p>Publisher: {gameInfo.publisher}</p>
                    <p>Developer: {gameInfo.developer}</p>
                    <p>Rating: {handleRating}</p>
                </div>
                <div>
                    <ul>
                        {reviews.map((item, index) => <li key={index}>
                            <p>{item.review_text}</p>
                        </li>)}
                    </ul>
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
            <button onClick={() => handleAddGames(game_id)} >Add to backlog</button>
            <Link to="/games">
                <span className="btn btn-primary btn-lg" href="#" role="button">
                    Games list
                </span>
            </Link>
        </div>
    );
};