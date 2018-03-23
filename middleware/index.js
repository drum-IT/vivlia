const middleware = {};
const Room = require("../models/room");

middleware.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", "You must be logged in to do that.");
    res.redirect("/");
  }
};

middleware.verifyRoomOwnership = (req, res, next) => {
  Room.findById(req.params.room_id, (err, foundRoom) => {
    if (err) {
      req.flash("error", "An error occurred while finding the room.");
      res.redirect("back");
    } else {
      if (foundRoom.user.equals(req.user._id)) {
        return next();
      } else {
        req.flash("error","That room does not belong to you.");
        res.redirect("back");
      }
    }
  })
}

//rewrite all of this
middleware.checkAPIKeys = (req, res, next) => {
  if (!req.headers.apikey || !req.headers.apisecret) {
    return res.send({ error: "no api keys found" });
  } else {
    return next();
  }
};

module.exports = middleware;
