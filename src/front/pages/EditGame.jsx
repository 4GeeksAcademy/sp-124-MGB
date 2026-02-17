import { Link, useParams, useNavigate } from "react-router-dom";  // To use link for navigation and useParams to get URL parameters
import { useEffect, useState } from "react";


export const EditGame = () => {
    const params = useParams();
    const navigate = useNavigate();
    const game_id = params.game_id;
    const game_name = params.game_name;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [genres, setGenres] = useState("");
    const [publisher, setPublisher] = useState("");
    const [developer, setDeveloper] = useState("");
    const [release, setRelease] = useState("");
    const [cover_link, setCover_link] = useState("");

    const handleFetch = async () => {
        try {
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");
            const response = await fetch(backendUrl + "api/games/" + game_name + "/" + game_id);
            const datajson = await response.json();
            if (response.ok) {
                setName(datajson.game.name);
                setDescription(datajson.game.description);
                setGenres(datajson.game.genres);
                setPublisher(datajson.game.publisher);
                setDeveloper(datajson.game.developer);
                setRelease(datajson.game.release_date);
                setCover_link(datajson.game.cover_link);
            }

        } catch (err) { console.log(err) }
    }

    const handleEdit = async (e) => {
        e.preventDefault();
        handleData(name, "name");
        handleData(description, "description");
        handleData(genres, "genres");
        handleData(developer, "developer");
        handleData(publisher, "publisher");
        handleData(release, "release");
        handleData(cover_link, "cover_link");
    }

    const handleData = async (dataToFetch, casee) => {
        try {
            const res = await fetch(backendUrl + "api/games", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({ game_id, dataToFetch, casee })
            });

            const data = await res.json();

            if (!res.ok) {
                return data.msg;
            }

            navigate("/games")

        } catch (err) {

        }
    }

    useEffect(() => {
        handleFetch();
    }, [])

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
                        value={cover_link ? cover_link : ""}
                        onChange={(e) => setCover_link(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-secondary">Edit</button>
            </form>
        </div>
    )
}