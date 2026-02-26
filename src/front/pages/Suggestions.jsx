import { useState } from "react";

// Define and export the Single component which displays individual item details.
export const Suggestions = () => {
    // Access the global state using the custom hook.
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [suggestion, setSuggestion] = useState("")

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

    if (!localStorage.getItem("token")) {
        return (
            <div className="container text-center">
                <h1>You have no permissions here, log in to be able to send suggestions to the team.</h1>
            </div>
        );
    }

    return (
        <div className="container text-center mt-5">
            <h1 className="login-color">Suggestions</h1>
            <div>
                <form onSubmit={handlePost}>
                    <div className="mb-3">
                        <hr />
                        <textarea className="form-control" id="suggestion" rows="3" type="text" value={suggestion} onChange={(e) => setSuggestion(e.target.value)}></textarea>
                    </div>
                    <div className="d-md-inline d-sm-flex justify-content-sm-center">
                        <button type="submit" className="btn button-css">Suggest</button>
                    </div>
                </form>
            </div>
        </div>
    );
};