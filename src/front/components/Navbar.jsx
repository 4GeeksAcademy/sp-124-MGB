import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer()
	const navigate = useNavigate();
	const handleSignOut = () => {
		localStorage.removeItem("username");
		localStorage.removeItem("token");
		localStorage.removeItem("email");
		localStorage.removeItem("admin");
		dispatch({ type: "set-admin", payload: false })
		navigate("/")
	}

	if (!localStorage.getItem("token")) {
		return (
			<nav className="navbar navbar-light bg-light">
				<div className="container">
					<Link to="/">
						<button className="btn btn-primary btn-lg" href="#" role="button">
							Home
						</button>
					</Link>
					<Link to="/games">
						<button type="button" className="btn btn-secondary p-2 m-2">Games list</button>
					</Link>
					<div className="ml-auto">
						<Link to="/login">
							<button className="btn btn-primary">Login</button>
						</Link>
						<Link to="/signup">
							<button className="btn btn-primary">Signup</button>
						</Link>
					</div>
				</div>
			</nav>
		);
	}

	if (store.admin) {
		return (
			<nav className="navbar navbar-light bg-light">
				<div className="container">
					<Link to="/">
						<button className="btn btn-primary btn-lg" href="#" role="button">
							Home
						</button>
					</Link>
					<Link to="/users">
						<button type="button" className="btn btn-secondary p-2 m-2">Users</button>
					</Link>

					<Link to="/games">
						<button type="button" className="btn btn-secondary p-2 m-2">Games list</button>
					</Link>
					<Link to="/suggestions">
						<button type="button" className="btn btn-secondary p-2 m-2">Suggestions</button>
					</Link>
					<div className="ml-auto">
						<Link to={`/profiles/${localStorage.getItem("username")}`}>
							<button className="btn btn-primary">Profile</button>
						</Link>
						<button className="btn btn-primary" onClick={() => handleSignOut()}>Sign out</button>
					</div>
				</div>
			</nav>
		)
	}

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<button className="btn btn-primary btn-lg" href="#" role="button">
						Home
					</button>
				</Link>
				<Link to="/games">
					<button type="button" className="btn btn-secondary p-2 m-2">Games list</button>
				</Link>
				<Link to="/suggestions">
					<button type="button" className="btn btn-secondary p-2 m-2">Suggestions</button>
				</Link>
				<div className="ml-auto">
					<Link to={`/profiles/${localStorage.getItem("username")}`}>
						<button className="btn btn-primary">Profile</button>
					</Link>
					<button className="btn btn-primary" onClick={() => handleSignOut()}>Sign out</button>
				</div>
			</div>
		</nav>
	)
};