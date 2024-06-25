const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const { OpenAI } = require("openai");

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

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_API_KEY,
});

async function createChatCompletion (input) {
  let reply = "";

  await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        "role": "system",
        "content": [
          {
            "type": "text",
            "text": "You are a Steam game review assistant for a website that allows users to search for their favorite games from Steam. Your job is to summarize the recent users' reviews. Please summarize the positives and the negatives of the game. Please go into as much detail as possible and remain unbiased. The review summary must be a couple of paragraphs long. Do not provide the reviews in bullet points or quotation marks."
          }
        ]
      },
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": input
          }
        ]
      },
    ],
      temperature: 0.6,
      max_tokens: 400,
      top_p: 0.5,
      frequency_penalty: 0,
      presence_penalty: 0,
    }).then(response => {
        reply = response.choices[0].message.content;
    })

    return reply;
};

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

  const minTextLength = 2500;
  const maxTextLength = 3000;

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
    console.log(reviewText.split(' ').length);
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
        filter: "recent",
        num_per_page: 100,
        cursor: cursor
      },
    });
    return response
  } catch (error) {
    console.error('Failed to fetch data from Steam Reviews');
  }
}

app.get('/api/reviews/:appId', async (req, res) => {
  try {
    const { appId } = req.params;

    const value = await createText(appId, "*");
    if (value === "NO RESULTS") {
      res.send(value);
    } else {
      createChatCompletion(value).then((response) => {
        res.send(response);
      });
    }
  } catch (error) {
    console.error('Failed: ' + error);
  }
});
  
app.get('/api/store/:game', async (req, res) => {
  try {
    const { game } = req.params;

    const { data } = await axios.get(`https://store.steampowered.com/api/storesearch/?term=${game}`, {
      params: {
        cc: "ca",
      },
    });

    const result = data.items.map(item => ({
      id: item.id,
      name: item.name,
      image: item.tiny_image,
      price: item.price?.final ?? "",
      currency: item.price?.currency ?? "",
    }));

    res.send(result);
  } catch (error) {
    console.error(error);
    console.error('Failed to fetch data from Steam Reviews');
  }
});

app.get('/api/gamedetails/:appid', async (req, res) => {
  try {
    const { appid } = req.params;

    const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appid}&cc=ca`);

    const data = response.data[appid].data;

    let reviews = await axios.get(`https://store.steampowered.com/appreviews/${appid}`, {
      params: {
        json: 1,
        filter: "recent",
      },
    });

    let result = {
      name: data.name,
      image: data.header_image,
      review_score: reviews.data.query_summary.review_score,
      review_description: reviews.data.query_summary.review_score_desc,
      price: data.price_overview?.final_formatted ?? "No price details available",
      release_date: data.release_date?.date ?? "No release date available",
      description: data.short_description,
      genres: data?.genres.map(genre => genre.description) ?? [],
    };

    res.send(result);
  } catch (error) {
    res.send("No results found");
    console.error(error);
    console.error('Failed to fetch data from Steam Reviews');
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on port ${port}\nThe Server is running`)
});
