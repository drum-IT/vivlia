const middleware = {};

middleware.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash("error", "You must be logged in to do that.");
		res.redirect("/");
	}
}

middleware.checkAPIKeys = (req, res, next) => {
	if (!req.headers.apikey || !req.headers.apisecret) {
		return res.send({ error: "no api keys found" });
	} else {
		return next();
	}
}

module.exports = middleware;