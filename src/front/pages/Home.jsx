import { Link } from "react-router-dom";
export const Home = () => {

	return (
		<div className="text-center">
			<div className="w-100 mx-auto p-5 jumbotron-image">
				<div className="container-fluid ">
					<div className="container">
						<h1 className="display-3 text-color-jumbo-h1">Welcome, gamer!</h1>
					</div>
				</div>
			</div>
			<div className="home-container p-1 mx-auto mt-5 rounded game-card">
				<h4 className="text-color-jumbo-p ">This website is designed to help you keep your backlog of games in order.</h4>
			</div>
			<div className="container img-cont-home mt-5">
				<div className="mx-auto p-5 jumbotron-image-2"></div>
			</div>
			<div className="home-container p-1 mx-auto mt-5 game-card rounded">
				<h4 className="text-color-jumbo-p">Track the status of your games!</h4>
			</div>
			<div className="container img-cont-home mt-5">
				<div className="mx-auto p-5 jumbotron-image-3"></div>
			</div>
			<div className="home-container p-1 mx-auto mt-5 game-card rounded">
				<h4 className="text-color-jumbo-p">Share your profile with your friends!</h4>
			</div>
		</div>
	);
}; 