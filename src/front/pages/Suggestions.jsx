import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
// Define and export the Single component which displays individual item details.
export const Suggestions = () => {
    // Access the global state using the custom hook.
    const { store } = useGlobalReducer();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [changes, setChanges] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [suggestion, setSuggestion] = useState("")

    const handleFetch = async () => {
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
    }

    const handlePost = async (e) => {
        console.log(suggestion)
        e.preventDefault();
        try {
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");
            const response = await fetch(backendUrl + "api/suggestions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({ suggestion })
            }
            );
            const datajson = await response.json();
            if (response.ok) {
                setSuggestions(datajson.suggestions)
            }


        } catch (err) { }
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

            if (!res.ok) {
                return data.msg;
            }
            setChanges(true)
        } catch (err) { console.log(err) }
    }

    if (!localStorage.getItem("token")) {
        return (
            <div className="container text-center">
                <h1>You have no permissions here, log in to be able to send suggestions to the team.</h1>
            </div>
        );
    }
    if (localStorage.getItem("admin")) {
        useEffect(() => {
            handleFetch();
        }, [])

        useEffect(() => {
            handleFetch();
            setChanges(false);
        }, [changes])
        return (
            <div className="container text-center">
                <div>
                    <p>Suggestions</p>
                    <ul>
                        {suggestions.map((item) => <li key={item.id}>
                            <p>User id: {item.user_id} Suggestion: {item.suggestion}</p>
                            <button onClick={() => { deleteButton(item.id) }} >Delete</button>
                        </li>)}
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div className="container text-center">
            <h1>Suggestions</h1>
            <div>
                <form onSubmit={handlePost}>
                    <div className="mb-3">
                        <hr />
                        <textarea className="form-control" id="suggestion" rows="3" type="text" value={suggestion} onChange={(e) => setSuggestion(e.target.value)}></textarea>
                    </div>
                    <button type="submit" className="btn btn-secondary">Send suggestion</button>
                </form>
            </div>
        </div>
    );
};