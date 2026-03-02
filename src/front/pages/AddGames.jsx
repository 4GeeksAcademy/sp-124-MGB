import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const AddGames = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const apiUrl = import.meta.env.VITE_RAWG_URL;
    const apiKey = import.meta.env.VITE_RAWG_API_KEY;
    const [slug, setSlug] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [genres, setGenres] = useState("");
    const [publisher, setPublisher] = useState("");
    const [developer, setDeveloper] = useState("");
    const [release, setRelease] = useState("");
    const [cover_link, setCover_link] = useState("");

    const handleFetch = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(apiUrl + slug + "?key=" + apiKey, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const data = await res.json();
            console.log(data);
            if (res.ok) {
                setName(data.name);
                setDescription(data.description_raw);
                setRelease(data.released);
                setDeveloper(data.developers[0].name);
                setPublisher(data.publishers[0].name ? data.publishers[0].name : data.developers[0].name);
                setCover_link(data.background_image);
                return

            }

        } catch (err) {

        }
    }

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
            navigate(-1)

        } catch (err) {

        }
    };
    if (localStorage.getItem("admin") == "true") {
        return (
            <div className="container mt-5">
                <h3 className="display-6 login-color text-center">Search game</h3>
                <form className="mt-3 gap-2 mb-5" onSubmit={handleFetch}>
                    <input className="form-control mb-3"
                        placeholder="slug"
                        value={slug}
                        onChange={(e) => setSlug((e.target.value).replace(" ", "-"))}
                    />
                    <div className="d-md-inline d-sm-flex justify-content-sm-center">
                        <button type="submit" className="btn button-css">Search</button>
                    </div>
                </form>
                <h3 className="display-6 login-color text-center">Add game</h3>
                <form onSubmit={handlePostGame}>
                    <div className="mt-3 d-md-flex gap-2 justify-content-md-center">
                        <input className="form-control mb-3"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <select value={genres} onChange={(e) => setGenres(e.target.value)} className="form-select mb-3" aria-label="Default select example">
                            <option value="Action">Action</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Horror">Horror</option>
                            <option value="Life Sim">Life Sim</option>
                            <option value="Farming">Farming</option>
                            <option value="JRPG">JRPG</option>
                            <option value="Survival">Survival</option>
                            <option value="RPG">RPG</option>
                            <option value="Platformer">Platformer</option>
                            <option value="Puzzles">Puzzles</option>
                            <option value="Shooter">Shooter</option>
                            <option value="MMO">MMO</option>
                        </select>
                        <input className="form-control mb-3"
                            placeholder="Publisher"
                            value={publisher}
                            onChange={(e) => setPublisher(e.target.value)}
                        />
                        <input className="form-control mb-3"
                            placeholder="Developer"
                            value={developer}
                            onChange={(e) => setDeveloper(e.target.value)}
                        />
                        <input className="form-control mb-3"
                            placeholder="Release"
                            value={release}
                            onChange={(e) => setRelease(e.target.value)}
                        />
                        <input className="form-control mb-3"
                            placeholder="Cover Link"
                            value={cover_link}
                            onChange={(e) => setCover_link(e.target.value)}
                        />
                    </div>
                    <textarea className="form-control mb-3"
                        placeholder="Description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <div className="d-md-inline d-sm-flex justify-content-sm-center">
                        <button type="submit" className="btn button-css">Add Game</button>
                    </div>
                </form>
            </div>
        );
    }
    return (
        <p>Nope</p>
    )
};