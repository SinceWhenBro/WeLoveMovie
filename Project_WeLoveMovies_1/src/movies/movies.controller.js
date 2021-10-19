const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function isShowingIsTrue(req,res,next){
    if(req.query.is_showing && req.query.is_showing === "false"){
        return next({
            status: 400,
            message: "Invalid request query",
        })
    }
    return next();
}

async function movieExists(req,res,next) {
    const movieId = req.params.movieId;
    let foundMovie;
    if(req.originalUrl.includes("theaters")){
        foundMovie = await service.readTheaters(movieId)
    } else if (req.originalUrl.includes("reviews")) {
        foundMovie = await service.readReviews(movieId)
    } else {
        foundMovie = await service.read(movieId)
    }
    if(foundMovie) {
        res.locals.movie = foundMovie
        return next();
    }
    return next({
        status: 404, 
        message: "Movie cannot be found",
    })
}

async function list(req, res, next) {
    let data;
    if(req.query.is_showing && req.query.is_showing === "true"){
        data = await service.listShowing();
    } else {
        data = await service.list();
    }
    res.json({data});
}

async function read(req,res,next) {
    res.json({data: res.locals.movie});
}

module.exports = {
    list: [isShowingIsTrue, asyncErrorBoundary(list)],
    read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  };