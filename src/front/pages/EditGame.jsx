import { Link, useParams, useNavigate } from "react-router-dom";  // To use link for navigation and useParams to get URL parameters
import useGlobalReducer from "../hooks/useGlobalReducer";  // Import a custom hook for accessing the global state
import { useState } from "react";


export const EditGame = () => {
    const navigate = useNavigate();
    const gameToEdit = useParams();
    const { store } = useGlobalReducer();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [genres, setGenres] = useState("");
    const [publisher, setPublisher] = useState("");
    const [developer, setDeveloper] = useState("");
    const [release, setRelease] = useState("");
    const [cover_link, setCover_link] = useState("");

    const handleEdit = async (e) => {
        e.preventDefault();
        if (name != "") {
            fetchData(gameToEdit, name);
        }
        if (description != "") {
            fetchData(gameToEdit, description);
        }
        if (genres != "") {
            fetchData(gameToEdit, genres);
        }
        if (developer != "") {
            fetchData(gameToEdit, developer);
        }
        if (publisher != "") {
            fetchData(gameToEdit, publisher);
        }
        if (release != "") {
            fetchData(gameToEdit, release);
        }
        if (cover_link != "") {
            fetchData(gameToEdit, cover_link);
        }
    }
    const fetchData = async (name, dataToFetch) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/games`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, dataToFetch })
            });

            const data = await res.json();

            if (!res.ok) {
                return data.msg;
            }

            navigate("/games")

        } catch (err) {

        }
    }

    return (
        <div className="container mt-5">
            <h2 className="display-6">Edit game details</h2>
            <form onSubmit={handleEdit}>
                <div className="mb-3 d-flex m-2 gap-2">
                    <input className="form-control"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input className="form-control"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <input className="form-control"
                        placeholder="Genres"
                        value={genres}
                        onChange={(e) => setGenres(e.target.value)}
                    />
                    <input className="form-control"
                        placeholder="Publisher"
                        value={publisher}
                        onChange={(e) => setPublisher(e.target.value)}
                    />
                    <input className="form-control"
                        placeholder="Developer"
                        value={developer}
                        onChange={(e) => setDeveloper(e.target.value)}
                    />
                    <input className="form-control"
                        placeholder="Release"
                        value={release}
                        onChange={(e) => setRelease(e.target.value)}
                    />
                    <input className="form-control"
                        placeholder="Cover Link"
                        value={cover_link}
                        onChange={(e) => setCover_link(e.target.value)}
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