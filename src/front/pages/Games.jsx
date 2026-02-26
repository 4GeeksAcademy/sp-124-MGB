// Import necessary hooks and components from react-router-dom and other libraries.
import { Link } from "react-router-dom";  // To use link for navigation and useParams to get URL parameters
import Swal from 'sweetalert2'
import { useEffect, useState } from "react";

// Define and export the Single component which displays individual item details.
export const Games = () => {
    // Access the global state using the custom hook.
    const [data, setData] = useState([]);
    const [isDesktop, setDesktop] = useState(window.innerWidth > 768);
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
                Swal.fire({
                    title: 'Added',
                    text: 'This game is already in your backlog',
                    icon: 'error',
                    confirmButtonText: 'Close'
                })
                return data.msg;
            }
            Swal.fire({
                title: 'Added',
                text: 'Added game to backlog',
                icon: 'success',
                confirmButtonText: 'Close'
            })
        } catch (err) {

        }
    };

    const updateMedia = () => {
        setDesktop(window.innerWidth > 768);
    };

    useEffect(() => {
        window.addEventListener("resize", updateMedia);
        return () => window.removeEventListener("resize", updateMedia);
    });

    useEffect(() => {
        handleFetch();
    }, [])

    if (!localStorage.getItem("token")) {

        return (
            <div className="mt-3 container">
                <ul>
                    {data.map((item, index) =>
                        <li className="container mb-5 game-card" key={index}>
                            <div className="row">
                                <div className="mt-1 col-xxl-2 col-lg-4 d-flex col-sm-12 justify-content-center align-self-center">
                                    <div className={isDesktop ? "img-container-lg" : "img-container-sm"}>
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
                                            <div className="col-lg-8 col-sm-12">
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
                                        <div className="col-12 d-flex justify-content-md-end justify-content-sm-center">
                                            <Link className="navbar-links" to={`/games/${item.name}/${item.id}`}><span >Details</span></Link></div>
                                    </div>
                                </div>
                            </div>
                        </li>)}
                </ul>
            </div>
        );
    }

    return (
        <div className="mt-3 container">
            <ul>
                {data.map((item, index) =>
                    <li className="container mb-5 game-card rounded" key={index}>
                        <div className="row">
                            <div className="mt-1 col-xxl-2 col-lg-4 d-flex col-sm-12 justify-content-center align-self-center">
                                <div className={isDesktop ? "img-container-lg" : "img-container-sm"}>
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
                                        <div className="col-lg-8 col-sm-12">
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
                                        <span className="btn navbar-links me-2" onClick={() => handleAddGames(item.id)} >Add to backlog</span>
                                        <Link className="navbar-links" to={`/games/${item.name}/${item.id}`}><span >Details</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </li>)}
            </ul>
        </div>
    );
};