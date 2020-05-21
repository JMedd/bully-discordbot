var XMLHttpRequest = require('xhr2');
const Discord = require('discord.js');
const client = new Discord.Client();
let moviehttp = new XMLHttpRequest();
let ratherhttp = new XMLHttpRequest();
var movieChannel, ratherChannel;
var url;

client.once('ready', () => {
	console.log('Client ready!');
});

client.on('message', message => {
    if(message.content.startsWith(`-movie `)){
        url = "http://www.omdbapi.com/?apikey="+ process.env.omdbkey + "&plot=full&t="
        var request = message.content.slice(7);

        request = request.replace(/ /g, "+");
        url = url + request;

        movieChannel = message.channel;

        moviehttp.open('GET', url, true);
        moviehttp.send();
    }
    else if(message.content.startsWith(`-rather`)){
        url = "https://www.rrrather.com/botapi";
        ratherChannel = message.channel;

        ratherhttp.open('GET', url, true);
        ratherhttp.send();
    }
})

moviehttp.onload = function(){
    // Begin accessing JSON data here
  var data = JSON.parse(this.response);

  if (moviehttp.status >= 200 && moviehttp.status < 400) {
    movieChannel.send("Title: " + data.Title + "\nYear: " + data.Year + "\nDirector: " + data.Director + "\nGenre: " + data.Genre + "\nCast: " + data.Actors + "\nRuntime: " + data.Runtime + "\nLanguage: " + data.Language + "\nPlot: " + data.Plot + "\n" + data.Poster);
    } else {
    console.log('error');
  }
}

ratherhttp.onload = function(){
  var data = JSON.parse(this.response);

  if (ratherhttp.status >= 200 && ratherhttp.status < 400) {
    ratherChannel.send("Would you rather \n😬 " + data.choicea + "\nOR\n😒 " + data.choiceb + "\nReact with your answer!");
  }
  else {
    console.log('error');
  }

}

client.login(process.env.token);