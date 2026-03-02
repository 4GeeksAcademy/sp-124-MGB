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

            navigate("/dashboard")

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
                    <button type="submit" className="btn button-css">Edit Game</button>
                </div>
            </form>
        </div>
    )
}