import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export const Navbar = () => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isDesktop, setDesktop] = useState(window.innerWidth > 991);

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch(backendUrl + "api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",

				},
				body: JSON.stringify({ username, password })
			});

			const data = await res.json();

			if (!res.ok) {
				return data.msg;
			}

			localStorage.setItem("token", data.token);
			localStorage.setItem("email", data.email);
			localStorage.setItem("username", username);
			localStorage.setItem("admin", data.role);
			location.reload();
		} catch (err) {

		}
	}

	const handleSignOut = () => {
		localStorage.removeItem("username");
		localStorage.removeItem("token");
		localStorage.removeItem("email");
		localStorage.removeItem("admin");
		location.reload();
	}



	const updateMedia = () => {
		setDesktop(window.innerWidth > 991);
	};

	useEffect(() => {
		window.addEventListener("resize", updateMedia);
		return () => window.removeEventListener("resize", updateMedia);
	});

	if (!localStorage.getItem("token")) {
		return (
			<nav className="navbar navbar-expand-lg">
				<div className="container-fluid">
					<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
						<ul className="navbar-nav mb-2 mb-lg-0 text-center">
							<li className="nav-item">
								<Link className="navbar-links me-5" to="/">
									<span>
										Home
									</span>
								</Link>
							</li>
							<li className="nav-item">
								<Link className="navbar-links me-5" to="/games">
									<span>Games list</span>
								</Link>
							</li>
							<li className="nav-item">
								<Link className="navbar-links me-5" to="/signup">
									<span>Signup</span>
								</Link>
							</li>
							{isDesktop ? (<li className="nav-item dropdown-center">
								<span className="navbar-links dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
									Login
								</span>
								<ul className="dropdown-menu login-dropdown">
									<form onSubmit={handleLogin}>
										<div className="mb-3 d-flex m-2 gap-2">
											<input className="form-control"
												type="username"
												placeholder="Username"
												value={username}
												onChange={(e) => setUsername(e.target.value)}
											/>
											<input className="form-control"
												type="password"
												placeholder="Password"
												value={password}
												onChange={(e) => setPassword(e.target.value)}
											/>
										</div>
										<button type="submit" className=" btn me-2 navbar-links d-flex justify-content-end">Login</button>
									</form>
								</ul>
							</li>) : (<li className="nav-item"><Link className="navbar-links me-5" to="/login">
								<span>Login</span>
							</Link></li>)}
						</ul>
					</div>
				</div>
			</nav>
		);
	}

	if (localStorage.getItem("admin") == "true") {
		return (
			<nav className="navbar navbar-expand-lg">
				<div className="container-fluid">
					<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
						<ul className="navbar-nav mb-2 mb-lg-0 text-center">
							<li className="nav-item">
								<Link className="navbar-links me-5" to="/">
									<span>
										Home
									</span>
								</Link>
							</li>
							<li className="nav-item">
								<Link className="navbar-links me-5" to="/games">
									<span>Games list</span>
								</Link>
							</li >
							<li className="nav-item">
								<Link className="navbar-links me-5" to="/suggestions">
									<span>Suggestions</span>
								</Link>
							</li>
							<li className="nav-item dropdown-center">
								<span className="navbar-links dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
									{localStorage.getItem("username")}
								</span>
								<ul className="dropdown-menu profile-dropdown text-center">
									<li>
										<Link className="navbar-links" to="/dashboard">
											<span>Dashboard</span>
										</Link>
									</li>
									<li>
										<Link className="navbar-links" to={`/profiles/${localStorage.getItem("username")}`}>
											<span>Your Profile</span>
										</Link>
									</li>
									<li>
										<Link className="navbar-links" to={`/edit/${localStorage.getItem("username")}`}>
											<span>Settings</span>
										</Link>
									</li>
									<li>
										<span className="navbar-links" onClick={() => handleSignOut()}>Sign out</span>
									</li>
								</ul>
							</li>
						</ul>
					</div>
				</div >
			</nav >
		)
	}

	return (
		<nav className="navbar navbar-expand-lg">
			<div className="container-fluid">
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
					<ul className="navbar-nav mb-2 mb-lg-0 text-center">
						<li className="nav-item">
							<Link className="navbar-links me-5" to="/">
								<span>
									Home
								</span>
							</Link>
						</li>
						<li className="nav-item">
							<Link className="navbar-links me-5" to="/games">
								<span>Games list</span>
							</Link>
						</li >
						<li className="nav-item">
							<Link className="navbar-links me-5" to="/suggestions">
								<span>Suggestions</span>
							</Link>
						</li>
						<li className="nav-item dropdown-center">
							<span className="navbar-links dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
								{localStorage.getItem("username")}
							</span>
							<ul className="dropdown-menu profile-dropdown text-center">
								<li>
									<Link className="navbar-links" to={`/profiles/${localStorage.getItem("username")}`}>
										<span>Your Profile</span>
									</Link>
								</li>
								<li>
									<Link className="navbar-links" to={`/edit/${localStorage.getItem("username")}`}>
										<span>Settings</span>
									</Link>
								</li>
								<li>
									<span className="navbar-links" onClick={() => handleSignOut()}>Sign out</span>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</div >
		</nav >
	)
};