const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const { OpenAI } = require("openai");
const { db } =  require('./firebase/firebase');

const _dirname = path.dirname('');
const buildPath = path.join(_dirname, '../build');
const BASE_URL = 'http://localhost:3000';

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

app.post('/db/analytics', async (req, res) => {
  try {
    const id = req.body.client_web_id;

    const reviewDocRef = db.collection('analytics').doc(id.toString());
    const doc = await reviewDocRef.get();

    let date = new Date();
    date = Math.floor(date.getTime() / 1000);

    if (!doc.exists) {
      const eventParams = {
        date: date,
        ip: req.body.ip,
        city: req.body.city ?? null,
        country: req.body.country ?? null,
        state: req.body.state ?? null,
        user_agent: req.body.user_agent,
        country_code: req.body.country_code ?? null,
        latitude: req.body.latitude ?? null,
        longitude: req.body.longitude ?? null,
        postal: req.body.postal ?? null,
      };
      
      if (req.body.search_query) {
        const search_query = {'search_query': req.body.search_query, 'date': date};
        await reviewDocRef.set({
          search_query: [search_query],
          steam_review: [],
          search_query_count: 1,
          steam_review_count: 0,
          ...eventParams,
        });
      } else if (req.body.steam_review) {
        const steam_review = {'steam_review': req.body.steam_review, 'date': date};
        await reviewDocRef.set({
          search_query: [],
          steam_review: [steam_review],
          search_query_count: 0,
          steam_review_count: 1,
          ...eventParams,
        });
      } else {
        await reviewDocRef.set({
          search_query: [],
          steam_review: [],
          search_query_count: 0,
          steam_review_count: 0,
          ...eventParams,
        });
      }
    } else {
      if (req.body.search_query) {
        const search_query = {'search_query': req.body.search_query, 'date': date};
        await reviewDocRef.update({
          search_query_count: doc.data().search_query_count + 1,
          search_query: [...doc.data().search_query, search_query],
        });
      } else if (req.body.steam_review) {
        const steam_review = {'steam_review': req.body.steam_review, 'date': date};
        await reviewDocRef.update({
          steam_review_count: doc.data().steam_review_count + 1,
          steam_review: [...doc.data().steam_review, steam_review],
        });
      }
    }

    res.send("Analytic added to database");
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding data');
  }
});

app.post('/db/reviews', async (req, res) => {
  try {
    const review = req.body.review;
    const id = req.body.id;

    const reviewDocRef = db.collection('reviews').doc(id.toString());
    let date = new Date();
    date = Math.floor(date.getTime() / 1000);

    await reviewDocRef.set({
      review: review,
      date: date,
    });

    res.send("Review added to database");
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding data');
  }
});

app.get('/db/reviews', async (req, res) => {
  try {
    const snapshot = await db.collection('reviews').get();
    const data = snapshot.docs.map(doc => doc.data());
    res.send(data);
  } catch (error) {
    console.error('Error getting documents: ', error);
    res.status(500).send('Error getting data');
  }
});

app.get('/db/reviews/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const reviewDocRef = db.collection('reviews').doc(id.toString());
    const doc = await reviewDocRef.get();

    if (!doc.exists) {
      res.send("No Document");
    } else {
      res.send(doc.data());
    }
  } catch (error) {
    console.error('Error getting documents: ', error);
    res.status(500).send('Error getting data');
  }
});

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

async function createChatCompletion(input) {
  let reply = "";

  await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        "role": "system",
        "content": [
          {
            "type": "text",
            "text": "You are a Steam game review assistant for a website that allows users to search for their favorite games from Steam. Your job is to summarize the recent users' reviews. You will be provided with the game title and the raw review data. Please summarize the positives and the negatives of the game. Please go into as much detail as possible and remain unbiased. The review summary must be provided in paragraphs and as long as you can. Write as much as you possibly can for the review summary and go into as much detail as possible. Do not list the reviews in bullet points or quotation marks."
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
      temperature: 0.8,
      max_tokens: 500,
      top_p: 0.8,
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

  text = text.replace(/(.)\1{2,}/g, '$1$1');

  const urlPattern = /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/gi;

  text = text.replace(urlPattern, '');

  text = text.trim().replace(/\s+/g, ' ');

  text = text.split(' ').filter((w,i)=> w !== text.split(' ')[i+1]).join(' ');

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

    nextCursor = cursor;

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
        console.log("1");
        return [reviewText.trim(), nextCursor];

      } else {
        if (result.split(' ').length <= 200) {
          reviewText += result + "\n"
          console.log("2");
          return [reviewText.trim(), nextCursor];

        } else {
          continue;
        }
      }
    }
  }

  if (reviewText.length > 0) {
    console.log("3");
    return [reviewText.trim(), nextCursor];
  } else {
    console.log("4");
    return ["NO RESULTS", ""];
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

function formatResult(text) {
  let paragraphs = text.split('\n');
    for (let i = 0; i < paragraphs.length; i++) {
      paragraphs[i].replace(/(\r\n|\n|\r)/gm, "");
    }
    return paragraphs;
}

async function summarize(appId, name, cursor) {
  let value = await createText(appId, cursor);
  let result = value[0];
  let newCursor = value[1];
  try {
    if (result === "NO RESULTS") {
      result = "Unable to summarize reviews. Please try again later.";
      const paragraphs = formatResult(result);
      return paragraphs;
    } else {
      result = name + "\n" + result;
      const response = await createChatCompletion(result);
      const paragraphs = formatResult(response);

      await axios.post(`${process.env.REACT_APP_URL}/db/reviews`, {
        id: appId,
        review: paragraphs,
      });
  
      return paragraphs;
    }
  } catch (error) {
    console.error('Failed to summarize reviews');
    console.error(newCursor);
    return await summarize(appId, name, newCursor);
  }
}

app.get('/api/reviews/:appId', async (req, res) => {
  try {
    const { appId } = req.params;
    const { data } = await axios.get(`${process.env.REACT_APP_URL}/db/reviews/${appId}`);
    const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}`);

    let today = new Date();
    today = Math.floor(today.getTime() / 1000);
    const date = data.date + (30 * 24 * 60 * 60);

    if (data === "No Document" || today >= date) {
      const name = response.data[appId].data.name
      let result = await summarize(appId, name, "*");
      res.send(result);
    } else {
      res.send(data.review);
    }
  } catch (error) {
    console.error('Failed: ' + error);
  }
});
  
app.get('/api/store/:game', async (req, res) => {
  try {
    const { game } = req.params;
    const { country } = req.query;

    const { data } = await axios.get(`https://store.steampowered.com/api/storesearch/?term=${game}`, {
      params: {
        cc: country,
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
    res.send("404");
    console.error(error);
    console.error('Failed to search for game');
  }
});

app.get('/api/countries', async (req, res) => {
  const { data } = await axios.get('https://steamcommunity.com/actions/QueryLocations/');

  let countries = data.map(country => ({
    name: country.countryname,
    code: country.countrycode,
  }));

  res.send(countries);
});

app.get('/api/gamedetails/:appId', async (req, res) => {
  try {
    const { appId } = req.params;
    const { country } = req.query;

    const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}&cc=${country}`);

    const data = response.data[appId].data;

    if (data.success === 'false') {
      res.send("404");
      return;
    }

    let reviews = await axios.get(`https://store.steampowered.com/appreviews/${appId}`, {
      params: {
        json: 1,
        filter: "recent",
      },
    });

    let genres = [];

    if (data?.genres !== undefined) {
      genres = data.genres.map(genre => genre.description);
    }

    let playerCount = await axios.get(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appId}`)
      .then(response => {
        return response.data.response.player_count;
      }).catch(error => {
        return 0;
      });

    let result = {
      name: data.name,
      image: data.header_image,
      type: data.type,
      full_game: data?.fullgame ?? "",
      review_score: reviews.data.query_summary.review_score,
      review_description: reviews.data.query_summary.review_score_desc,
      price: data.price_overview?.final_formatted ? data.price_overview.final_formatted : "No price details available",
      release_date: data.release_date?.date ? data.release_date.date : "No release date available",
      description: data.short_description,
      genres: genres,
      player_count: playerCount,
    };

    res.send(result);
  } catch (error) {
    res.send("404");
    console.error('Failed to fetch game details');
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on port ${port}\nThe Server is running`)
});
