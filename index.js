const Twitter = require('twitter-lite');
const request = require('request');
const moment = require('moment');
require('dotenv').config();

let id = '';

const user = new Twitter({
  consumer_key: process.env.CONSUMERKEY,
  consumer_secret: process.env.CONSUMERKEYSECRET,
  access_token_key: process.env.ACCESSKEY,
  access_token_secret: process.env.ACCESSKEYSECRET,
});

function searchChallenger() {
  request.get(`https://br1.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key=${process.env.KEYRIOT}`,
  function (error, response, body) {
    let res = JSON.parse(body);
    let challengers = res.entries.sort(function(a, b) {
      return b.leaguePoints - a.leaguePoints;
    });
      tweet(
        `1️⃣ - ${challengers[0].summonerName} - ${challengers[0].leaguePoints}PDL (V:${challengers[0].wins} D:${challengers[0].losses})\n` +
        `2️⃣ - ${challengers[1].summonerName} - ${challengers[1].leaguePoints}PDL (V:${challengers[1].wins} D:${challengers[1].losses})\n` +
        `3️⃣ - ${challengers[2].summonerName} - ${challengers[2].leaguePoints}PDL (V:${challengers[2].wins} D:${challengers[2].losses})\n` + 
        `4️⃣ - ${challengers[3].summonerName} - ${challengers[3].leaguePoints}PDL (V:${challengers[3].wins} D:${challengers[3].losses})\n` + 
        `5️⃣ - ${challengers[4].summonerName} - ${challengers[4].leaguePoints}PDL (V:${challengers[4].wins} D:${challengers[4].losses})\n`
      );
  });
};

async function tweet(tweet) {
  try {
    const tweetPost = await user.post('statuses/update', {
      status: tweet,
    });
    id = tweetPost.id_str;
    console.log('Tweet executado com sucesso');
  } catch (error) {
    console.log(error);
  };
};
async function retweet(id) {
  try {
    await user.post('statuses/retweet', {
      id: id,
    });
    console.log('Retweet executado com sucesso');
  } catch (error) {
    console.log(error);
  };
};

setInterval(() => {
  let temp = moment().format('HH:mm:ss A');
  if(temp.substr(0,2) == 00) {
    searchChallenger();
  };
  if(temp.substr(0,2) == 12) {
    retweet(id);
  };
}, 60*1000*45);