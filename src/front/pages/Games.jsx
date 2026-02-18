// Import necessary hooks and components from react-router-dom and other libraries.
import { Link } from "react-router-dom";  // To use link for navigation and useParams to get URL parameters
import useGlobalReducer from "../hooks/useGlobalReducer";  // Import a custom hook for accessing the global state
import { useEffect, useState } from "react";

// Define and export the Single component which displays individual item details.
export const Games = () => {
    // Access the global state using the custom hook.
    const { store } = useGlobalReducer();
    const [data, setData] = useState([]);
    const [changes, setChanges] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const handleFetch = async () => {
        try {
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

            const response = await fetch(backendUrl + "api/games");
            const datajson = await response.json();
            if (response.ok) {
                setData(datajson.games);
            }
        } catch (err) { }
    }

    const handleDelete = async (game_id) => {
        try {
            const res = await fetch(backendUrl + "api/games", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({ game_id })
            });

            const data = await res.json();
            setChanges(true);
            if (!res.ok) {
                return data.msg;
            }

        } catch (err) {

        }
    }

    const handleAddGames = async (game_id) => {
        try {
            const res = await fetch(backendUrl + "api/backlog", {
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
                <ul>
                    {data.map((item, index) => <li key={index}>
                        Game: {item.name} description: {item.description} genres: {item.genres} publisher: {item.publisher} developer: {item.developer} cover_link: {item.cover_link}
                        <Link to={`/games/${item.name}/${item.id}`}><button >Details</button></Link>
                    </li>)}
                </ul>
            </div>
        );
    }

    if (localStorage.getItem("admin")) {
        return (
            <div className="container text-center">
                <ul>
                    {data.map((item, index) => <li key={index}>
                        Game: {item.name} description: {item.description} genres: {item.genres} publisher: {item.publisher} developer: {item.developer} cover_link: {item.cover_link} release date: {item.release_date}
                        <button onClick={() => handleAddGames(item.id)} >Add to backlog</button>
                        <Link to={`/games/${item.name}/${item.id}`}><button >Details</button></Link>
                        <Link to={`/games/edit/${item.name}/${item.id}`}><button >Edit</button></Link>
                        <button onClick={() => handleDelete(item.id)} >Delete</button>
                    </li>)}
                </ul>
                <Link to="/games/add">
                    <span className="btn btn-primary btn-lg" href="#" role="button">
                        Add Game
                    </span>
                </Link>
            </div>
        );
    }

    return (
        <div className="container text-center">
            <ul>
                {data.map((item, index) => <li key={index}>
                    Game: {item.name} description: {item.description}
                    genres: {item.genres} publisher: {item.publisher}
                    developer: {item.developer} cover_link: {item.cover_link}
                    release date: {item.release_date}
                    <button onClick={() => handleAddGames(item.id)} >Add to backlog</button>
                    <Link to={`/games/${item.name}/${item.id}`}><button >Details</button></Link>
                </li>)}
            </ul>
        </div>
    );



};