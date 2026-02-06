import { Link } from "react-router-dom";

export const Home = () => {

	return (
		<div className="text-center mt-5">
			<h1 className="display-4">Home preview</h1>
			<div>To be carousel with news</div>
			<div>To be small list of trending/editors pick games</div>
			<div>
				<Link to="/users">
					<button type="button" className="btn btn-secondary p-2 m-2">Users</button>
				</Link>
				<Link to="/games">
					<button type="button" className="btn btn-secondary p-2 m-2">Games</button>
				</Link>
			</div>
		</div>
	);
}; 