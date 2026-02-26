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
            cards.push(<li className="container mb-5 game-card rounded" key={i}>
                <div className="row">
                    <div className="mt-1 col-xxl-2 col-lg-4 d-flex col-sm-12 justify-content-center align-self-center">
                        <div className="img-container-profile m-1">
                            <img className="game-list-img" src={gamesinfo[i].cover_link ? gamesinfo[i].cover_link : ""}></img>
                        </div>
                    </div>
                    <div className="col-xxl-10 col-lg-8 col-sm-12 p-0 d-md-flex align-items-md-center">
                        <div className="col-xxl-10 col-lg-8 col-sm-12 p-0">
                            <div className="row h-100 d-md-flex">
                                <div className="col-md-4 col-12 align-self-center">
                                    <h2 className="mb-md-0 mb-sm-2">{gamesinfo[i].name}</h2>
                                </div>
                                <div className="col-md-3 col-12 align-self-center">
                                    <h3 className="mb-md-0 mb-sm-2">Rating: {backlog[i].rating} </h3>
                                </div>
                                <div className="col-md-2 col-12 align-self-center">
                                    <h3 className="mb-md-0 mb-sm-2">Status: {backlog[i].status}</h3>
                                </div>
                                <div className="col-md-3 col-12 justify-content-sm-center d-flex align-items-center">
                                    <Link className="navbar-links" to={`/games/${gamesinfo[i].name}/${gamesinfo[i].id}`}><span >Details</span></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
            cards.push(
                <li className="container mb-5 game-card rounded" key={i}>
                    <div className="row">
                        <div className="mt-1 col-xxl-2 col-lg-4 d-flex col-sm-12 justify-content-center align-self-center">
                            <div className="img-container-profile m-1">
                                <img className="game-list-img" src={gamesinfo[i].cover_link ? gamesinfo[i].cover_link : ""}></img>
                            </div>
                        </div>
                        <div className="col-xxl-10 col-lg-8 col-sm-12 p-0">
                            <div className="row h-100 d-md-flex">
                                <div className="col-md-4 col-12 align-self-center">
                                    <h2 className="mb-md-0 mb-sm-2">{gamesinfo[i].name}</h2>
                                </div>
                                <div className="col-md-3 col-12 align-self-center">
                                    <h3 className="mb-md-0 mb-sm-2">Rating: {backlog[i].rating} </h3>
                                </div>
                                <div className="col-md-2 col-12 align-self-center">
                                    <h3 className="mb-md-0 mb-sm-2">Status: {backlog[i].status}</h3>
                                </div>
                                <div className="col-md-3 col-12 justify-content-sm-center d-flex align-items-center">
                                    <button onClick={() => editHandle(backlog[i].id, i)} type="button" className="btn navbar-links" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                        Edit
                                    </button>
                                    <Link className="navbar-links" to={`/games/${gamesinfo[i].name}/${gamesinfo[i].id}`}><span >Details</span></Link>
                                </div>
                            </div>
                        </div>
                    </div >
                </li >)
        }
        return cards
    }

    const modal = () => {
        return (
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content modal-css">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5 modal-title-color" id="exampleModalLabel">Edit</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form id="myForm" onSubmit={handleEdit}>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-floating">
                                            <select onChange={(e) => setRating(e.target.value)} className="form-select form-input-css" id="rating">
                                                <option value={1}>1</option>
                                                <option value={2}>2</option>
                                                <option value={3}>3</option>
                                                <option value={4}>4</option>
                                                <option value={5}>5</option>
                                            </select>
                                            <label htmlFor="rating">Rating</label>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-floating">
                                            <select onChange={(e) => setStatus(e.target.value)} className="form-select form-input-css" id="status">
                                                <option value="In backlog">In Backlog</option>
                                                <option value="Playing">Playing</option>
                                                <option value="Dropped">Dropped</option>
                                                <option value="Finished">Finished</option>
                                            </select>
                                            <label className="" htmlFor="status">Status</label>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn navbar-links" data-bs-dismiss="modal">Close</button>
                            <button type="submit" form="myForm" className="btn navbar-links" data-bs-dismiss="modal">Save changes</button>
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

    if (localStorage.getItem("admin") == "true") {
        return (
            <div className="container text-center">
                <h1 className="login-color"> Welcome to, {username.username}'s profile</h1>
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
                <h1 className="login-color">Welcome to your profile {username.username}!</h1>
                <ul>
                    {renderCardsUser()}
                </ul>
                {modal()}
            </div>

        );
    }

    return (
        <div className="container text-center">
            <h1 className="login-color"> Welcome to, {username.username}'s profile</h1>
            <ul>
                {renderCardsNotUser()}
            </ul>
        </div>
    );
};