import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
	const navigate = useNavigate();
	const handleSignOut = () => {
		localStorage.removeItem("username");
		localStorage.removeItem("token");
		localStorage.removeItem("email");
		localStorage.removeItem("admin");
		navigate("/")
	}

	if (!localStorage.getItem("token")) {
		return (
			<nav className="navbar navbar-light bg-light">
				<div className="container">
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

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/games">
					<button type="button" className="btn btn-secondary p-2 m-2">Games list</button>
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