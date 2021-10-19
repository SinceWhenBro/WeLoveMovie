const db = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
    critic_id: " critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
});

function list(){
    return db("movies").select("*");
}

function listShowing(){
    return db("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .distinct("m.*")
        .where({"mt.is_showing": true})
        .orderBy("m.movie_id")
}

function read(movieId){
    return db("movies")
    .select("*")
    .where({"movie_id": movieId})
    .first();
}

function readReviews(movieId){
    return db("reviews as r")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("*")
    .where({"r.movie_id": movieId})
    .then((reviews) => {
        const reviewsCritic = [];
        reviews.forEach((review) => {
            const newReview = addCritic(review);
            reviewsCritic.push(newReview);
        })
        return reviewsCritic;
    })
}

function readTheaters(movieId){
    return db("movies_theaters as mt")
    .join("theaters as t", "t.theater_id", "mt.theater_id")
    .distinct("t.*")
    .where({"mt.movie_id": movieId})
}

module.exports = {
    list,
    listShowing,
    read,
    readTheaters,
    readReviews,
  };