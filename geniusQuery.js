/*
Use this command to bundle after making edits:
browserify geniusQuery.js > bundle.js
*/

var axios = require("axios").default;

// variables
var artist = "";
var song = "";
var song_id = 0;
var youtubeLink = "";
var youtubeVidId = "";
var spotifyLink = "";
var songartURL = "";
const queryForm = document.forms['musicQueryForm'];

// procedure
queryForm.addEventListener('submit',function(e){
  e.preventDefault();
  artist = queryForm.querySelector('input[name="artistSearch"]').value;
  song = queryForm.querySelector('input[name="songSearch"]').value;
  geniusQuery(artist, song);
});


// functions
function geniusQuery(parmArtist, parmSong) {
  var options = {
    method: 'GET',
    url: "https://genius.p.rapidapi.com/search",
    params: {q: parmArtist + " " + parmSong},
    headers: {
      'x-rapidapi-host': 'genius.p.rapidapi.com',
      'x-rapidapi-key': '8c17385caamshf96139bac447402p125206jsnd4cbd540fedd'
    }
  };
  
  // raw search to get song id
  axios.request(options).then(function (response) {
    song_id = response.data.response.hits[0].result.id;
    console.log(response.data.response.hits[0]);
    songartURL = response.data.response.hits[0].result.song_art_image_url;
    document.getElementById("songart").src = songartURL;
  
      var song_options = {
          method: 'GET',
          url: 'https://genius.p.rapidapi.com/songs/' + song_id,
          headers: {
            'x-rapidapi-host': 'genius.p.rapidapi.com',
            'x-rapidapi-key': '8c17385caamshf96139bac447402p125206jsnd4cbd540fedd'
          }
      }
  
      // search with specific song id
      axios.request(song_options).then(function (response) {
          //console.log(response.data.response.song.media);
          //console.log(response.data.response.song.media[0].url);
          for (var i = 0; i < 3; i++) {
            switch(response.data.response.song.media[i].provider) {
              case "youtube":
                youtubeLink = response.data.response.song.media[i].url;
                break;
              case "spotify":
                spotifyLink = response.data.response.song.media[i].url;
                break;
              default:
                continue;
            }
          }
          document.getElementById("spotifyLink").href = spotifyLink;
          document.getElementById("youtubeVid").src = "https://www.youtube.com/embed/" + youtubeLink.substring(31);
          document.getElementById("spotifyLink").innerHTML = spotifyLink;
      }).catch(function (error) {
          console.error(error);
      });
  }).catch(function (error) {
    console.error(error);
  });
}

// setup export for browserify
module.exports = function (n) { return n * 111 }