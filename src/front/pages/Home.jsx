import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link, useParams } from "react-router-dom";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "api/users")
			const data = await response.json()
			console.log(data)
			if (response.ok) dispatch({ type: "set_hello", payload: data.users })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	useEffect(() => {
		loadMessage()
	}, [])

	return (
		<div className="text-center mt-5">
			<h1 className="display-4">User stuff</h1>
			<div>
				<Link to="/users">
					<button type="button" className="btn btn-secondary p-2 m-2">Users</button>
				</Link>
				<Link to="/signup">
					<button className="btn btn-primary btn-lg" href="#">Signup</button>
				</Link>
				<Link to="/login">
					<button className="btn btn-primary btn-lg" href="#">Login</button>
				</Link>
			</div>
		</div>
	);
}; 