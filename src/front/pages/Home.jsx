import { Link } from "react-router-dom";
export const Home = () => {

	return (
		<div className="text-center">
			<div className="w-100 mx-auto p-5 jumbotron-image">
				<div className="container-fluid">
					<div className="container ">
						<h1 className="display-3 text-color-jumbo-h1">Welcome, gamer!</h1>
						<p className="text-color-jumbo-p">This website will help you keep your backlog of games in order. You can also rate them and specify their current status. You are welcomed to share your profile with friends so they can see it!</p>
					</div>
				</div>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-md-4">
						<h2>Heading</h2>
						<p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
						<p><a className="btn btn-secondary" href="#" role="button">View details »</a></p>
					</div>
					<div className="col-md-4">
						<h2>Heading</h2>
						<p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
						<p><a className="btn btn-secondary" href="#" role="button">View details »</a></p>
					</div>
					<div className="col-md-4">
						<h2>Heading</h2>
						<p>Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
						<p><a className="btn btn-secondary" href="#" role="button">View details »</a></p>
					</div>
				</div>
			</div>
		</div>
	);
}; 