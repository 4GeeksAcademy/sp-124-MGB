import { Link } from "react-router-dom";

export const Navbar = () => {

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
};