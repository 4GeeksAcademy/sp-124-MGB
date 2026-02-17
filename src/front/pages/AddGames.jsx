import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const AddGames = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
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
            const res = await fetch(backendUrl + "api/games", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
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
                    <select value={genres} onChange={(e) => setGenres(e.target.value)} className="form-select" aria-label="Default select example">
                        <option value="Action">Action</option>
                        <option value="Adventure">RPG</option>
                        <option value="Life Sim">Life Sim</option>
                        <option value="RPG">Adventure</option>
                        <option value="Platformer">Platformer</option>
                    </select>
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
        </div>
    );
};