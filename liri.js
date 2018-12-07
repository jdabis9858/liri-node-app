require("dotenv").config();
var Spotify = require("node-spotify-api")
var Request = require("request")
var Moment = require("moment")
var FS = require("fs")

var keys = require("./keys.js")
var bandsInTown = require('bandsintown')('76d9941adcbad2ed8d62e14cd206c65a');
var axios = require("axios")



var spotify = new Spotify(keys.spotify);
// var bandsInTown = new bandsInTown(keys.BandsInTown)


// console.log(process.argv)

var actn = process.argv[2]
var title = process.argv.slice(3).join(" ");


function chooseActn(actn, title) {
    switch(actn) {
        case "concert-this":
            getConcert(title) 
            break;
        case "spotify-this-song":
            getSong(title)
            break;
        case "movie-this":
            getMovie(title)
            break;
        case "do-what-it-says":
            getRandom()
            break;
        default:
            console.log("liri doesn't understand")
            
    }
}

function getConcert(title) {
    bandsInTown.getArtistEventList(title).then(function(events) {
        // console.log(events)
    if (events.length === 0) {
        return console.log("No Concerts coming up")
    }
    else {
    var cData = events[0]
    console.log(cData.title)
    console.log(cData.formatted_datetime)
    console.log(cData.ticket_status)
    }
  });
}

function getSong(title) {
    spotify.search({ type: 'track', query: title }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        var sData = data.tracks.items
        // console.log(JSON.stringify(data,null,2));
        console.log(sData[0].name) 
        console.log(sData[0].preview_url)
        console.log(sData[0].album.name)
        console.log(sData[0].artists[0].name)
    });
}

function getMovie(title) {
    var queryUrl = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";
    console.log(queryUrl);
    axios.get(queryUrl).then(async function (response) {
        // console.log(response.data.Released)
        var mData = response.data
        //console.log(mData)
        console.log(mData.Title)
        console.log(mData.Released)
        console.log(mData.language)
        console.log(mData.Actors)
        console.log(mData.imdbRating)
        console.log(mData.Plot)

    });

}

function getRandom() {
    FS.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            console.log(err)
        }
        else {
            console.log(data)
            var random = data.split(",")
            actn = random[0]
            title = random[1]
            chooseActn(actn, title)
        }
    })
   
}



//console.log(events[0].title)
chooseActn(actn, title)