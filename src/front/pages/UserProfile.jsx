// Import necessary hooks and components from react-router-dom and other libraries.
import { Link, useParams } from "react-router-dom";  // To use link for navigation and useParams to get URL parameters
import { useEffect, useState } from "react";

// Define and export the Single component which displays individual item details.
export const UserProfile = () => {
    // Access the global state using the custom hook.
    const username = useParams()
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [backlog, setBacklog] = useState([]);
    const [statusGame, setStatus] = useState("");
    const [rating, setRating] = useState(undefined);
    const [gamesinfo, setGamesinfo] = useState([]);
    const [changes, setChanges] = useState(false)
    const [edit, setEdit] = useState()

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

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(backendUrl + "api/backlog", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({ edit, rating, statusGame })
            });

            const data = await res.json();

            if (!res.ok) {
                return data.msg;
            }
            setChanges(true);
        } catch (err) {

        }
    }

    const renderCardsNotUser = () => {
        const cards = [];
        for (let i = 0; i < gamesinfo.length; i++) {
            cards.push(<li key={i}>Game: {gamesinfo[i].name} Rating:
                {backlog[i].rating} Status: {backlog[i].status}
            </li>)
        }
        return cards
    }
    const editHandle = (id, index) => {
        setEdit(id);
        setStatus(backlog[index].status);
        if (backlog[index].rating == undefined) {
            setRating(undefined);
        } else {
            setRating(backlog[index].rating);
        }

    }


    const renderCardsUser = () => {
        const cards = [];
        for (let i = 0; i < gamesinfo.length; i++) {
            cards.push(<li key={i}>Game: {gamesinfo[i].name} Rating:
                {backlog[i].rating} Status: {backlog[i].status}
                <button onClick={() => editHandle(backlog[i].id, i)} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Edit
                </button>
            </li>)
        }
        return cards
    }

    const modal = () => {
        return (
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form id="myForm" onSubmit={handleEdit}>
                                <div className="d-flex">
                                    <div className="form-floating mb-3 d-flex m-2 gap-2">
                                        <select onChange={(e) => setRating(e.target.value)} className="form-select" id="rating" aria-label="Default select example">
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={4}>4</option>
                                            <option value={5}>5</option>
                                        </select>
                                        <label htmlFor="rating">Rating</label>
                                    </div>
                                    <div className="form-floating mb-3 d-flex m-2 gap-2">
                                        <select onChange={(e) => setStatus(e.target.value)} className="form-select" id="status" aria-label="Default select example">
                                            <option value="In backlog">In Backlog</option>
                                            <option value="Playing">Playing</option>
                                            <option value="Dropped">Dropped</option>
                                            <option value="Finished">Finished</option>
                                        </select>
                                        <label htmlFor="status">Status</label>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" form="myForm" className="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    useEffect(() => {
        handleFetch();
    }, [])

    useEffect(() => {
        handleFetch();
        setChanges(false)
    }, [changes])

    if (localStorage.getItem("admin")) {
        return (
            <div className="container text-center">
                <h1>{username.username}</h1>
                <ul>
                    {renderCardsUser()}
                </ul>
                {modal()}
            </div>
        );
    }

    if (localStorage.getItem("username") == username.username) {
        return (
            <div className="container text-center">
                <h1>{username.username}</h1>
                <Link to={`/edit/${username.username}`}>
                    <span className="btn btn-primary btn-lg" href="#" role="button">
                        Edit Account
                    </span>
                </Link>
                <ul>
                    {renderCardsUser()}
                </ul>
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {edit}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }

    return (
        <div className="container text-center">
            <h1>{username.username}</h1>
            <ul>
                {renderCardsNotUser()}
            </ul>
        </div>
    );
};