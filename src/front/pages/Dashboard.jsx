import { Link } from "react-router-dom";  // To use link for navigation and useParams to get URL parameters
import { useEffect, useState } from "react";

// Define and export the Single component which displays individual item details.
export const Dashboard = () => {
    // Access the global state using the custom hook.
    const [dataUsers, setDataUsers] = useState([]);
    const [dataGames, setDataGames] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [changes, setChanges] = useState(false);
    const [loading, setLoading] = useState(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleFetch = async () => {
        try {
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");
            const response = await fetch(backendUrl + "api/users", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            });
            const datajson = await response.json();
            if (response.ok) {
                setDataUsers(datajson.users);
            }
        } catch (err) { }

        try {
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

            const response = await fetch(backendUrl + "api/games");
            const datajson = await response.json();
            if (response.ok) {
                setDataGames(datajson.games);
            }
        } catch (err) { }

        try {
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");
            const response = await fetch(backendUrl + "api/suggestions", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            }
            );
            const datajson = await response.json();
            if (response.ok) {
                setSuggestions(datajson.suggestions)
            }


        } catch (err) { }
        setLoading(false)
    }


    const handleDeleteUsers = async (username) => {
        try {
            const res = await fetch(backendUrl + `api/profiles/settings`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({ username })
            });
            const data = await res.json();
            setChanges(true);
            if (!res.ok) {
                return data.msg;
            }

        } catch (err) {

        }
    }

    const handleDeleteGames = async (game_id) => {
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

    const deleteButton = async (id) => {
        try {
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

            const res = await fetch(backendUrl + "api/suggestions", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({ id })
            });

            const data = await res.json();
            console.log(data)
            if (!res.ok) {
                return data.msg;
            }
            setChanges(true)
        } catch (err) { console.log(err) }
    }

    if (localStorage.getItem("admin") == "false") { return <p>YOU SHOULD NOT BE HERE, AWAYYYYY</p>; }

    useEffect(() => {
        handleFetch();
    }, [])

    useEffect(() => {
        handleFetch();
        setChanges(false)
    }, [changes])

    if (!loading) {

        return (
            <div className="row mt-3">
                <div className="col-lg-6 col-md-12 text-center">
                    <h2 className="login-color">USERS</h2>
                    <ul>
                        {dataUsers.map((item, index) => <li className="container mb-2 game-card rounded d-md-flex justify-content-md-between align-items-center" key={index}>
                            <p className="me-2 mb-0">User id: {item.id} Username: {item.username} Email: {item.email} </p>
                            <Link className="btn navbar-links me-2" to={`/edit/${item.username}`}><span >Edit</span></Link>
                            <Link className="btn navbar-links me-2" to={`/profiles/${item.username}`}><span >Profile</span></Link>
                            <span className="btn navbar-links" onClick={() => handleDeleteUsers(item.username)} >Delete</span>
                        </li>)}
                    </ul>
                </div>
                <div className="col-lg-6 col-md-12 text-center">
                    <h2 className="login-color">SUGGESTIONS</h2>
                    <ul>
                        {suggestions.map((item) => <li className="container m2-5 game-card rounded d-flex align-items-center" key={item.id}>
                            <div>
                                <p className="me-2 mb-1">User id: {item.user_id}</p>
                                <p className="me-2 mb-1"> Suggestion: {item.suggestion}</p>
                            </div>
                            <span className="btn navbar-links" onClick={() => deleteButton(item.id)} >Delete</span>
                        </li>)}
                    </ul>
                </div>
                <div className="col-12 ">
                    <div className="text-center">
                        <h2 className="login-color">GAMES</h2>
                        <Link to={`/games/add`}><span className="btn button-css mb-3 ">Add game</span></Link>
                    </div>
                    <div>
                        <ul>
                            {dataGames.map((item, index) =>
                                <li className="container mb-5 game-card rounded" key={index}>
                                    <div className="row">
                                        <div className=" mt-1 col-xxl-2 col-lg-4 d-flex col-sm-12 justify-content-center align-self-center">
                                            <div className="img-container-lg">
                                                <img className="game-list-img" src={item.cover_link ? item.cover_link : ""}></img>
                                            </div>
                                        </div>
                                        <div className="col-xxl-10 col-lg-8 col-sm-12 pt-3">
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="d-flex">
                                                        <h3 className="me-auto ">{item.name}</h3>
                                                        <p>Release date: {item.release_date}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-8 col-sm-12 text-justify">
                                                        <p>{item.description}</p>
                                                    </div>

                                                    <div className="col-lg-4 col-sm-12 text-sm-center text-lg-start ">
                                                        <p>Genres: {item.genres}</p>
                                                        <p>Publisher: {item.publisher}</p>
                                                        <p>Developer: {item.developer}</p>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="row">
                                                <div className="col-12 d-flex justify-content-md-end justify-content-sm-center align-items-center">
                                                    <Link to={`/games/edit/${item.name}/${item.id}`}><span className="btn navbar-links me-2">Edit</span></Link>
                                                    <span className="btn navbar-links me-2" onClick={() => handleDeleteGames(item.id)} >Delete</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>)}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
};