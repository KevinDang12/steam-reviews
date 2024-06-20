const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const _dirname = path.dirname('');
const buildPath = path.join(_dirname, '../build');
const BASE_URL = 'http://localhost:3000';

app.use(express.static(buildPath));

/**
 * Display the Front-end when the users are
 * on the following pathname
 */
app.get(/^(?!\/(api|auth|logout)).+/, (req, res) => {
  res.sendFile(
      path.join(__dirname, '../build/index.html'),
      function(err) {
        if (err) {
          res.status(500).send(err);
        }
      },
  );
});

require('dotenv').config({ path: path.join(__dirname, '../.env') });

app.use(express.json());
app.use(cors({
    origin: BASE_URL,
    credentials: true,
}));

app.use(bodyParser.urlencoded({ extended: false }));
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');

/**
 * Use express-session to store the user's information
 */
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
}));

/**
 * GET Request when the user finds the status of the server
 */
app.get('/api/status', (req, res) => {
    res.status(200).send('The server is running');
});

function cleanText(text) {
  text = text.replace(/[^\p{L}\p{N}\p{P}\s]/gu, '');

  text = text.replace(/([^\s\p{P}])\1{2,}/gu, '$1$1');

  const urlPattern = /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/gi;

  text = text.replace(urlPattern, '');

  text.replace(/\r?\n|\r/g, '');

  text = text.trim().replace(/\s+/g, ' ');

  return text;
}

async function createText(appId, nextReview) {
  let reviewText = "";
  let nextCursor = nextReview

  const minTextLength = 3000;
  const maxTextLength = 3500;

  while (reviewText.split(' ').length < minTextLength) {
    let response = await retrieveReviews(appId, nextCursor);

    let { reviews, cursor } = response.data

    nextCursor = cursor

    if (reviews.length === 0) {
      break;
    }

    for (let review of reviews) {
      let result = cleanText(review.review);

      if (result.split(' ').length > minTextLength) {
        continue;
      }

      if (reviewText.split(' ').length + result.split(' ').length < minTextLength) {
        reviewText += result + "\n"

      } else if (reviewText.split(' ').length + result.split(' ').length >= minTextLength && reviewText.split(' ').length + result.split(' ').length < maxTextLength) {
        reviewText += result + "\n"
        console.log(1);
        return reviewText.trim()

      } else {
        if (result.split(' ').length <= 200) {
          reviewText += result + "\n"
          console.log(2);
          return reviewText.trim()

        } else {
          continue;
        }
      }
    }
  }

  if (reviewText.length > 0) {
    console.log(3);
    return reviewText.trim()
  } else {
      console.log(4);
      return "NO RESULTS";
  }
}

async function retrieveReviews(appId, cursor) {
  try {
    const response = await axios.get(`https://store.steampowered.com/appreviews/${appId}`, {
      params: {
        json: 1,
        key: process.env.REACT_STEAM_API,
        filter: "recent",
        num_per_page: 20,
        cursor: cursor
      },
    });
    return response
  } catch (error) {
    console.error('Failed to fetch data from Steam API')
  }
}

app.get('/api/reviews/:appId', async (req, res) => {
    const { appId } = req.params;

    const value = await createText(appId, "*");
    // console.log(value);
    res.send(value);
  });
  
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on port ${port}\nThe Server is running`)
});
