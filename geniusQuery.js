/*
Use this command to bundle after making edits:
browserify geniusQuery.js > bundle.js
*/

var axios = require("axios").default;

// variables and constants
var artist = "";
var song = "";
var song_id = 0;
var youtubeLink = "";
var spotifyLink = "";

const writersDiv = document.getElementById("writersDiv");
const queryForm = document.forms['musicQueryForm'];
const errorDiv = document.getElementById("errors");

// procedure
queryForm.addEventListener('submit',function(e){
  e.preventDefault();
  artist = queryForm.querySelector('input[name="artistSearch"]').value;
  song = queryForm.querySelector('input[name="songSearch"]').value;
  //songFactsList.innerHTML = "";
  writersDiv.innerHTML = "";
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
    errorDiv.innerHTML = "";
    if (response.data.response.hits.length < 1) {
      errorDiv.innerHTML = "<p>No results found.</p>"
    } else {
      song_id = response.data.response.hits[0].result.id;
      document.getElementById("songart").src = response.data.response.hits[0].result.song_art_image_url;
      document.getElementById("geniusLink").href = response.data.response.hits[0].result.url;
      document.getElementById("geniusLink").innerHTML = response.data.response.hits[0].result.url;
      document.getElementById("songTitle").innerHTML = response.data.response.hits[0].result.full_title;
      document.getElementById("artistName").innerHTML = response.data.response.hits[0].result.artist_names;
      document.getElementById("artistLink").href = response.data.response.hits[0].result.primary_artist.url;

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
          // parse for media links 
          for (var i = 0; i < 3; i++) {
            try {
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
            } catch(e) {
              console.log(e);
            }
          }
          try {
            document.getElementById("spotifyLink").href = spotifyLink;
            document.getElementById("youtubeVid").src = "https://www.youtube.com/embed/" + youtubeLink.substring(31);
            document.getElementById("spotifyLink").innerHTML = spotifyLink;
          } catch(e) {
            console.log(e);
          }

          // parse for writer info
          response.data.response.song.writer_artists.forEach(writer => {
            writersDiv.innerHTML += "<div class='writerBlock'><a href='" 
            + writer.url + "'><p class='writerText'>" + writer.name + "</p><img src='" + writer.image_url 
            + "'width='200px' class='writerImage img-responsive'></div><br>"; 
          });

          // parse for additional info
          document.getElementById("artistImage").src = response.data.response.song.primary_artist.image_url;

          // apply css to new items
          applyCSS();

      }).catch(function (error) {
          console.log(error);
      });
    }
  }).catch(function (error) {
    console.log(error);
  });
}

function applyCSS() {
  // unhide results div
  document.getElementById("results").style.display = "block";

  document.querySelectorAll(".writerBlock").forEach(element => {
    element.style.backgroundColor = "lightcyan";
    element.style.borderRadius = "15px";
    element.style.margin = "5px 5px 5px 5px"
    element.style.border = "5px solid lightgray";
    element.style.padding = "20px 15px 0 15px";
  });

  document.querySelectorAll(".writerImage").forEach(element=> {
    element.style.margin = "10px auto";
  }); 

  document.querySelectorAll(".writerText").forEach(element => {
    element.style.margin = "0 auto";
    element.style.textAlign = "center";
  });
}

// setup export for browserify
module.exports = function (n) { return n * 111 }