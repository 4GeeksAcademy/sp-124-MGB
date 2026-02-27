// Import necessary hooks and components from react-router-dom and other libraries.
import { useParams } from "react-router-dom";  // To use link for navigation and useParams to get URL parameters
import { useEffect, useState } from "react";
import Swal from 'sweetalert2'
// Define and export the Single component which displays individual item details.
export const GameDetails = () => {
    // Access the global state using the custom hook.
    const params = useParams();
    const game_name = params.game_name;
    const game_id = params.game_id;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [changes, setChanges] = useState(false);
    const [gameInfo, setGameInfo] = useState({});
    const [reviews, setReviews] = useState([]);
    const [review, setReview] = useState("");
    const [posted, setPosted] = useState(false);
    const [userReviewID, setUserReviewID] = useState();
    const [rating, setRating] = useState();
    const [users, setUsers] = useState([]);

    const handleFetch = async () => {
        try {
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");
            const response = await fetch(backendUrl + "api/games/" + game_name + "/" + game_id);
            const datajson = await response.json();
            if (response.ok) {
                setGameInfo(datajson.game)
            }


        } catch (err) { }
    }

    const handleHasUserPostedReview = async () => {
        try {
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");
            const response = await fetch(backendUrl + "api/reviews/" + localStorage.getItem("email") + "/" + game_id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const datajson = await response.json();
            if (response.ok) {
                setReview(datajson.review);
                setPosted(datajson.msg);
                setUserReviewID(datajson.id)
                return
            }
            return
        } catch (err) { console.log(err) }
    }

    const handleRating = async () => {
        try {
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

            const response = await fetch(backendUrl + "api/backlog/" + game_id);
            const datajson = await response.json();
            if (response.ok) {
                setRating(datajson.rating)
                return
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

    const handleReviews = async (method) => {
        switch (method) {
            case "GET":
                try {
                    if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

                    const response = await fetch(backendUrl + "api/reviews/" + game_id);
                    const datajson = await response.json();
                    if (response.ok) {
                        setReviews(datajson.reviews)
                        setUsers(datajson.users)
                    }
                } catch (err) { }
                break;
            case "POST":
                try {
                    if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");
                    if (review != "") {
                        const res = await fetch(backendUrl + "api/reviews", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer " + localStorage.getItem("token")
                            },
                            body: JSON.stringify({ game_id, review })
                        });

                        const data = await res.json();

                        if (!res.ok) {
                            Swal.fire({
                                title: 'Review',
                                text: 'The review could not be posted',
                                icon: 'error',
                                confirmButtonText: 'Close'
                            })
                            return data.msg;
                        }
                        Swal.fire({
                            title: 'Review',
                            text: 'The review was posted successfully',
                            icon: 'success',
                            confirmButtonText: 'Close'
                        })
                        setChanges(true)
                    }
                } catch (err) {
                }
                break;
            case "PUT":
                try {
                    if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

                    const res = await fetch(backendUrl + "api/reviews", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("token")
                        },
                        body: JSON.stringify({ game_id, review })
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        Swal.fire({
                            title: 'Review',
                            text: 'The review could not be edited',
                            icon: 'error',
                            confirmButtonText: 'Close'
                        })
                        return data.msg;
                    }
                    Swal.fire({
                        title: 'Review',
                        text: 'The review was edited successfully',
                        icon: 'success',
                        confirmButtonText: 'Close'
                    })
                    setChanges(true)
                } catch (err) { }
                break;
        }
    }

    const deleteButton = async (id) => {
        try {
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

            const res = await fetch(backendUrl + "api/reviews", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({ id })
            });

            const data = await res.json();

            if (!res.ok) {
                return data.msg;
            }
            setChanges(true)
        } catch (err) { console.log(err) }
    }

    const removeButton = (id) => {
        if (id == userReviewID) {
            return <button onClick={() => { deleteButton(id) }}>Delete</button>
        }
    }

    useEffect(() => {
        handleFetch();
        handleHasUserPostedReview();
        handleRating();
        handleReviews("GET");
    }, [])

    useEffect(() => {
        handleHasUserPostedReview();
        handleReviews("GET");
        setChanges(false);
    }, [changes])

    if (!gameInfo) {
        return (
            <p></p>
        )
    }

    if (!localStorage.getItem("token")) {
        return (
            <div className="container game-card rounded mt-4">
                <div className="row text-center">
                    <div className="col-12 d-flex justify-content-center align-self-center ">
                        <div className="img-container-lg">
                            <img className="game-list-img mt-2 mb-2" src={gameInfo.cover_link ? gameInfo.cover_link : ""}></img>
                        </div>
                    </div>
                    <h1>{gameInfo.name}</h1>
                    <p>Description: {gameInfo.description}</p>
                </div>
                <div className="row text-center">
                    <div className="col-md-6 col-12">
                        <h4 className="mb-2">Genres: {gameInfo.genres}</h4>
                        <h4 className="mb-2">Rating: {rating ? rating : "Not rated by users yet."}</h4>
                    </div>
                    <div className="col-md-6 col-12">
                        <h4 className="mb-2">Publisher: {gameInfo.publisher}</h4>
                        <h4 className="mb-2">Developer: {gameInfo.developer}</h4>
                    </div>
                    <div className="col-12 mb-5">
                        <h5>Release date: {gameInfo.release_date}</h5>
                    </div>
                </div>
                <div>
                    <h4 className="mb-4 login-color">User reviews</h4>
                    <ul className="p-0 mb-5">
                        {reviews.map((item, index) => <li className="review" key={index}>
                            <div className="">
                                <h4 className="me-2">{users[index].username}:</h4>
                            </div>
                            <p className="m-0">{item.review_text}</p>
                        </li>)}
                    </ul>
                </div>
            </div>
        );
    }
    if (localStorage.getItem("admin") == "true") {
        return (
            <div className="container game-card rounded mt-4">
                <div className="row text-center">
                    <div className="col-12 d-flex justify-content-center align-self-center">
                        <div className="img-container-lg">
                            <img className="game-list-img mt-2 mb-2" src={gameInfo.cover_link ? gameInfo.cover_link : ""}></img>
                        </div>
                    </div>
                    <h1>{gameInfo.name}</h1>
                    <p>Description: {gameInfo.description}</p>
                </div>
                <div className="row text-center">
                    <div className="col-md-6 col-12">
                        <h4 className="mb-2">Genres: {gameInfo.genres}</h4>
                        <h4 className="mb-2">Rating: {rating ? rating : "Not rated by users yet."}</h4>
                    </div>
                    <div className="col-md-6 col-12">
                        <h4 className="mb-2">Publisher: {gameInfo.publisher}</h4>
                        <h4 className="mb-2">Developer: {gameInfo.developer}</h4>
                    </div>
                    <div className="col-12 mb-5">
                        <h5>Release date: {gameInfo.release_date}</h5>
                    </div>
                </div>
                <div>
                    <h4 className="mb-4 login-color">User reviews</h4>
                    <ul className="p-0 mb-5">
                        {reviews.map((item, index) => <li className="review" key={index}>
                            <div className="row align-items-center">
                                <div className="col-12 col-md-10">
                                    <h4 className="me-2">{users[index].username}:</h4>
                                    <p className="m-0">{item.review_text}</p>
                                </div>
                                <div className="col-12 col-md-2 d-flex justify-content-md-end justify-content-sm-center">
                                    <button className="btn navbar-links" onClick={() => { deleteButton(item.id) }}>Delete</button>
                                </div>
                            </div>

                        </li>)}
                    </ul>
                </div>
                <div>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="mb-3">
                            <textarea className="form-control" id="review" rows="3" type="text" value={review} onChange={(e) => setReview(e.target.value)}></textarea>
                        </div>
                        <div className="d-flex justify-content-center">
                            <button className="btn navbar-links" type="submit" onClick={() => posted ? handleReviews("PUT") : handleReviews("POST")}>Post review</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="container game-card rounded mt-4">
            <div className="row text-center">
                <div className="col-12 d-flex justify-content-center align-self-center">
                    <div className="img-container-lg">
                        <img className="game-list-img mt-2 mb-2" src={gameInfo.cover_link ? gameInfo.cover_link : ""}></img>
                    </div>
                </div>
                <h1>{gameInfo.name}</h1>
                <p>Description: {gameInfo.description}</p>
            </div>
            <div className="row text-center">
                <div className="col-md-6 col-12">
                    <h4 className="mb-2">Genres: {gameInfo.genres}</h4>
                    <h4 className="mb-2">Rating: {rating ? rating : "Not rated by users yet."}</h4>
                </div>
                <div className="col-md-6 col-12">
                    <h4 className="mb-2">Publisher: {gameInfo.publisher}</h4>
                    <h4 className="mb-2">Developer: {gameInfo.developer}</h4>
                </div>
                <div className="col-12 mb-5">
                    <h5>Release date: {gameInfo.release_date}</h5>
                </div>
                <div className="d-flex justify-content-center">
                    <button className="btn navbar-links" onClick={() => handleAddGames(gameInfo.id)}>Add to backlog</button>
                </div>
            </div>
            <div>
                <h4 className="mb-4 login-color">User reviews</h4>
                <ul className="p-0 mb-5">
                    {reviews.map((item, index) => <li className="review" key={index}>
                        <div className="">
                            <h4 className="me-2">{users[index].username}:</h4>
                        </div>
                        <p className="m-0">{item.review_text}</p>
                    </li>)}
                </ul>
            </div>
            <div>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-3">
                        <textarea className="form-control" id="review" rows="3" type="text" value={review} onChange={(e) => setReview(e.target.value)}></textarea>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button className="btn navbar-links" type="submit" onClick={() => posted ? handleReviews("PUT") : handleReviews("POST")}>Post review</button>
                    </div>
                </form>
            </div>
        </div>
    );
};