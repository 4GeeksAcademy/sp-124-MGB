import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer"

export const AddGames = () => {
    const navigate = useNavigate();
    const { store } = useGlobalReducer();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [genres, setGenres] = useState("");
    const [publisher, setPublisher] = useState("");
    const [developer, setDeveloper] = useState("");
    const [release, setRelease] = useState("");
    const [cover_link, setCover_link] = useState("");

    const handlePostGame = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/games`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, description, genres, publisher,
                    developer, release, cover_link
                })
            });

            const data = await res.json();

            if (!res.ok) {
                return data.msg;
            }
            navigate("/games")

        } catch (err) {

        }
    };

    return (
        <div className="container mt-5">
            <h2 className="display-6">Create account</h2>
            <form onSubmit={handlePostGame}>
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
                <button type="submit" className="btn btn-secondary">Add Game</button>
            </form>
            <Link to="/">
                <span className="btn btn-primary btn-lg" href="#" role="button">
                    Back home
                </span>
            </Link>
        </div>
    );
};