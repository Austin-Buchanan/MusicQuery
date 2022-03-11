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
var songartURL = "";
var lyricsLink = "";

//const songFactsList = document.getElementById("songFactsList");
const writersDiv = document.getElementById("writersDiv");
const queryForm = document.forms['musicQueryForm'];

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
    song_id = response.data.response.hits[0].result.id;
    songartURL = response.data.response.hits[0].result.song_art_image_url;
    document.getElementById("songart").src = songartURL;
    lyricsLink = response.data.response.hits[0].result.url;
    document.getElementById("geniusLink").href = lyricsLink;
    document.getElementById("geniusLink").innerHTML = lyricsLink;
    document.getElementById("songTitle").innerHTML = response.data.response.hits[0].result.full_title;
    document.getElementById("artistName").innerHTML = response.data.response.hits[0].result.artist_names;
    document.getElementById("artistLink").href = response.data.response.hits[0].result.primary_artist.url;
    //console.log(response.data.response.hits[0].result);
  
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
          //console.log(response.data.response.song.writer_artists);
          //console.log(response.data.response.song.description.dom.children)

          /*
          // parse for song facts
          response.data.response.song.description.dom.children.forEach(element => {
            if (element != "") {
              element.children.forEach(subelement => {
                if (typeof(subelement) === 'string') {
                  songFactsList.innerHTML += "<li>" + subelement + "...</li>";
                } else if (subelement.tag === "a") {
                  songFactsList.innerHTML += "<a href='" + subelement.attributes.href + "'>" + subelement.attributes.href + "</a>";
                }
              });
            }
          });
          */

          // parse for media links 
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

          // parse for writer info
          response.data.response.song.writer_artists.forEach(writer => {
            writersDiv.innerHTML += "<div class='writerBlock'><a href='" 
            + writer.url + "'><p class='writerText'>" + writer.name + "</p><img src='" + writer.image_url 
            + "'width='200px' class='writerImage'></div><br>"; 
          });

          // parse for additional info
          document.getElementById("artistImage").src = response.data.response.song.primary_artist.image_url;

          // apply css to new items
          applyCSS();
      }).catch(function (error) {
          console.error(error);
      });
  }).catch(function (error) {
    console.error(error);
  });
}

function applyCSS() {
  document.querySelectorAll(".writerBlock").forEach(element => {
    element.style.width = "300px";
    element.style.backgroundColor = "lightcyan";
    element.style.borderRadius = "25px";
    element.style.margin = "5px 5px 5px 5px"
  });

  document.querySelectorAll(".writerImage").forEach(element=> {
    element.style.margin = "0 auto";
  }); 

  document.querySelectorAll(".writerText").forEach(element => {
    element.style.margin = "0 auto";
    element.style.textAlign = "center";
  });
}

// setup export for browserify
module.exports = function (n) { return n * 111 }