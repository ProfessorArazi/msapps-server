const express = require("express");
const router = new express.Router();
const axios = require("axios");
const { sortImages } = require("../helpers/sortImages");

const api =
  "https://pixabay.com/api/?key=25540812-faf2b76d586c1787d2dd02736&q=";

router.get("/pixabay", async (req, res) => {
  // fetching tne data for the first time

  const { category } = req.query;
  axios(`${api}${category}`)
    .then((response) => {
      const images = response.data.hits;
      res.status(200).send({
        images,
      });
    })
    .catch((error) => {
      res
        .status(error.response.status)
        .send({ message: "Something went wrong..." });
    });
});

router.get("/pixabay/sort", async (req, res) => {
  const { category } = req.query;
  axios(`${api}${category}`)
    .then((response) => {
      const data = response.data.hits;
      const images = sortImages(data).slice(0, 9); // sorting the images by id
      res.status(200).send({
        images,
      });
    })
    .catch((error) => {
      res
        .status(error.response.status)
        .send({ message: "Something went wrong..." });
    });
});

router.get("/pixabay/pagination", async (req, res) => {
  const { category, range, direction, sorted } = req.query;
  axios(`${api}${category}`)
    .then((response) => {
      let images = response.data.hits;
      if (sorted) {
        images = sortImages(images);
      }
      const dataLength = images.length;
      // define new range according to direction
      let newRange = direction === "next" ? +range + 9 : +range - 9;
      if (direction === "next") {
        // if new range bigger then dataLength it means I have to get the remain images
        // until the end and the rest from the start
        if (newRange > dataLength) {
          const oldRange = newRange;
          newRange -= dataLength;

          // example: newRange = 27 , dataLength = 20 so images
          // postions will be [18,19,0,1,2,3,4,5,6]

          images = [
            ...images.slice(oldRange - 9, dataLength),
            ...images.slice(0, newRange),
          ];
        } else {
          // regular case, slicing the last 9 until newRange

          // example: newRange = 17 , dataLength = 20 so images
          // postions will be [9,10,11,12,13,14,15,16, 17]

          images = images.slice(newRange - 9, newRange);
        }
      } else {
        // direction = "prev"

        if (newRange <= 0) {
          // if new range smaller or equal to 0 it means I have to start from the end
          newRange += dataLength;

          // example: newRange = -2 , dataLength = 20 so now newRange will be 18 so images
          // postions will be [10,11,12,13,14,15,16,17,18]

          images = images.slice(newRange - 9, newRange);
        } else if (newRange < 9) {
          // if new range smaller then 9 it means I have to show the reminders from the start
          // and the rest from the end

          images = [
            ...images.slice(dataLength - (9 - newRange), dataLength),
            ...images.slice(0, newRange),
          ];
        } else {
          images = images.slice(newRange - 9, newRange);
        }
      }
      res.status(200).send({
        images,
        range: newRange,
      });
    })
    .catch((error) => {
      res
        .status(error.response.status)
        .send({ message: "Something went wrong..." });
    });
});

module.exports = router;
