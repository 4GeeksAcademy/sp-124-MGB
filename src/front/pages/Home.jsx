import { Link } from "react-router-dom";

export const Home = () => {

	return (
		<div className="text-center mt-5">
			<h1 className="display-4">Stuff I am obligated to do</h1>
			<div>
				<Link to="/users">
					<button type="button" className="btn btn-secondary p-2 m-2">Users</button>
				</Link>
				<Link to="/games">
					<button className="btn btn-secondary p-2 m-2" href="#">Games</button>
				</Link>
			</div>
		</div>
	);
}; 