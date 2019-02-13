require('dotenv').config();

let keys = require('./keys.js'),
    Spotify = require('node-spotify-api'),
    spotify = new Spotify(keys.spotify),
    axios = require('axios'),
    moment = require('moment'),
    inquirer = require('inquirer'),
    fs = require('fs');

// Conditional logic to determine which API call to make
let command = (commandChoice, commandInfo) => {
    switch (commandChoice) {
        case 'concert-this':
            logThis(commandChoice + ' ' + commandInfo);
            concertThis(commandInfo);
            break;
        case 'spotify-this-song':
            logThis(commandChoice + ' ' + commandInfo);
            spotifyThis(commandInfo);
            break;
        case 'movie-this':
            logThis(commandChoice + ' ' + commandInfo);
            movieThis(commandInfo);
            break;
        case 'do-what-it-says':
            logThis(commandChoice + ' ' + commandInfo);
            random(commandInfo);
            break;
        default:
            console.log('Incorrect Command. Please try again');
            break;
    }
}

// Prompt the user for input
inquirer.prompt([
    {
        type: 'input',
        name: 'command',
        message: 'My name is LIRI, what can I help you with today?'
    }
]).then(function (response) {
    let userInput = response.command.split(' '),
        commandChoice = userInput.shift(),
        commandInfo = userInput.join(' ');

    command(commandChoice, commandInfo);
});

//Bands in town axios call
let concertThis = artist => {
    let queryUrl = 'https://rest.bandsintown.com/artists/' + artist + '/events?app_id=codingbootcamp';
    axios.get(queryUrl).then(
        function (response) {
            let events = response.data;
            let display = '';
            for (let i = 0; i < events.length; i++) {
                let { venue } = events[i];
                display += 'Venue: ' + venue.name + '\n' +
                    'Location: ' + venue.city + ', ' + venue.country + '\n' +
                    'Date: ' + moment(events[i].datetime).format('MM/DD/YYYY') + '\n' +
                    '------------------------------' + '\n';
            }
            console.log(display);
            logThis(display);
        }
    );
}
//Spotify axios call
let spotifyThis = song => {
    let query = song != '' ? song : 'The Sign';
    spotify.search({ type: 'track', query: query, limit: 1 }).then(function (response) {
        let { artists, name, preview_url, album } = response.tracks.items[0];
        let display = 'Artist: ' + artists[0].name + '\n' +
            'Song Title: ' + name + '\n' +
            'Preview: ' + preview_url + '\n' +
            'Album: ' + album.name;

        console.log(display);
        logThis(display);
    })
}
//OMDB Movie axios call
let movieThis = movie => {
    let query = movie != '' ? movie : 'Mr. Nobody';
    let queryUrl = 'http://www.omdbapi.com/?t=' + query + '&y=&plot=short&apikey=trilogy';
    axios.get(queryUrl).then(function (response) {
        let { Title, Year, Ratings, Country, Language, Plot, Actors } = response.data;
        let display = 'Movie Title: ' + Title + '\n' +
            'Year Released: ' + Year + '\n' +
            'IMDB Rating: ' + Ratings[0].Value + '\n' +
            'Rotten Tomatoes Rating: ' + Ratings[1].Value + '\n' +
            'Country: ' + Country + '\n' +
            'Movie Language: ' + Language + '\n' +
            'Plot: ' + Plot + '\n' +
            'Actors: ' + Actors;

        console.log(display);
        logThis(display);
    }
    );
}
//TODO Currently does not work, is unable to read the file as it says it is null
let random = () => {
    fs.readFile('random.txt', 'utf8', function (data) {
        let info = data.split(', ');
        command(info[0], info[1]);
    });
}
//Logs to our log.txt file
let logThis = (log) => {
    fs.appendFile('log.txt', log + '\r\n', (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Log file updated!');
        }
    });
}