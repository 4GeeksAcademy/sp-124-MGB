// Import necessary hooks and components from react-router-dom and other libraries.
import { Link, useParams } from "react-router-dom";  // To use link for navigation and useParams to get URL parameters
import { useEffect, useState } from "react";

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
    const [admin, setAdmin] = useState(false);
    const [review, setReview] = useState("");
    const [posted, setPosted] = useState(false);
    const [userReviewID, setUserReviewID] = useState();
    const [reviewToDelete, setReviewToDelete] = useState()

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

    const handleAdmin = async () => {
        try {
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

            const response = await fetch(backendUrl + "api/admin", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            });

            const datajson = await response.json();

            if (response.ok) {
                setAdmin(datajson.msg);
                return
            }
            setAdmin(false);
            return
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
                return datajson.rating
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
                return data.msg;
            }

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
                    }
                } catch (err) { }
                break;
            case "POST":
                try {
                    if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

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
                        return data.msg;
                    }
                    setChanges(true)
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
                        return data.msg;
                    }
                    setChanges(true)
                } catch (err) { }
                break;
            case "DELETE":
                try {
                    if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

                    const res = await fetch(backendUrl + "api/reviews", {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("token")
                        },
                        body: JSON.stringify({ reviewToDelete })
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        return data.msg;
                    }
                    setChanges(true)
                } catch (err) { }
                break;
        }

    }

    const removeButton = (id) => {
        if (id == userReviewID) {
            return <button onClick={() => { setReviewToDelete(id); handleReviews("DELETE") }}>Delete</button>
        }
    }

    useEffect(() => {
        handleFetch();
        handleAdmin();
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
            <div className="container text-center">
                <div>
                    <div>coverHere</div>
                    <h1>{gameInfo.name}</h1>
                    <h2>Genres: {gameInfo.genres}</h2>
                    <h4>Release date: {gameInfo.release_date}</h4>
                </div>
                <div>
                    <p>Description: {gameInfo.description}</p>
                    <p>Publisher: {gameInfo.publisher}</p>
                    <p>Developer: {gameInfo.developer}</p>
                    <p>Rating: {handleRating}</p>
                </div>
                <div>
                    <ul>
                        {reviews.map((item, index) => <li key={index}>
                            <p>{item.review_text}</p>
                        </li>)}
                    </ul>
                </div>
            </div>
        );
    }
    if (admin) {
        return (
            <div className="container text-center">
                <div>
                    <div>coverHere</div>
                    <h1>{gameInfo.name}</h1>
                    <h2>Genres: {gameInfo.genres}</h2>
                    <h4>{gameInfo.release_date}</h4>
                </div>
                <div>
                    <p>Description: {gameInfo.description}</p>
                    <p>Publisher: {gameInfo.publisher}</p>
                    <p>Developer: {gameInfo.developer}</p>
                    <p>Rating: {handleRating}</p>
                </div>
                <button onClick={() => handleAddGames(game_id)} >Add to backlog</button>
                <div>
                    <p>Reviews:</p>
                    <ul>
                        {reviews.map((item) => <li key={item.id}>
                            <p>{item.review_text}</p>
                            <button onClick={() => { setReviewToDelete(item.id); handleReviews("DELETE") }} >Delete</button>
                        </li>)}
                    </ul>
                </div>
                <div>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="mb-3">
                            <hr />
                            <textarea className="form-control" id="review" rows="3" type="text" value={review} onChange={(e) => setReview(e.target.value)}></textarea>
                        </div>
                        <button type="submit" onClick={() => posted ? handleReviews("PUT") : handleReviews("POST")} className="btn btn-secondary">Post review</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="container text-center">
            <div>
                <div>coverHere</div>
                <h1>{gameInfo.name}</h1>
                <h2>Genres: {gameInfo.genres}</h2>
                <h4>{gameInfo.release_date}</h4>
            </div>
            <div>
                <p>Description: {gameInfo.description}</p>
                <p>Publisher: {gameInfo.publisher}</p>
                <p>Developer: {gameInfo.developer}</p>
                <p>Rating: {handleRating}</p>
            </div>
            <button onClick={() => handleAddGames(game_id)} >Add to backlog</button>
            <div>
                <ul>
                    {reviews.map((item) => <li key={item.id}>
                        <p>{item.review_text}</p>
                        {removeButton(item.id)}
                    </li>)}
                </ul>
            </div>
            <div>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-3">
                        <hr />
                        <textarea className="form-control" id="review" rows="3" type="text" value={review} onChange={(e) => setReview(e.target.value)}></textarea>
                    </div>
                    <button type="submit" onClick={() => posted ? handleReviews("PUT") : handleReviews("POST")} className="btn btn-secondary">Post review</button>
                </form>
            </div>
        </div>
    );
};