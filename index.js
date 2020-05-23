var XMLHttpRequest = require('xhr2');
const Discord = require('discord.js');
const fetch = require("node-fetch");
var FormData = require('form-data');
const request = require('request');
const Client = new Discord.Client();
let movieHttp = new XMLHttpRequest();
let ratherHttp = new XMLHttpRequest();
let codTokenRequest = new XMLHttpRequest();
let codAuthRequest = new XMLHttpRequest();
let codHttp = new XMLHttpRequest();
var movieChannel, ratherChannel, codChannel;
var url;
var csrfTokenPrefix = '<meta name="_csrf" content="';
var csrfToken;

var htmlMetaTags = require('html-meta-tags')


Client.once('ready', () => {
  console.log('Client ready!');
});

Client.on('message', async message => {
  if (message.content.toUpperCase().startsWith(`-MOVIE `)) {
    url = "http://www.omdbapi.com/?apikey=" + process.env.omdbkey + "&plot=full&t="
    var request = message.content.slice(7);

    request = request.replace(/ /g, "+");
    url = url + request;

    movieChannel = message.channel;

    movieHttp.open('GET', url, true);
    movieHttp.send();
  }
  else if (message.content.toUpperCase().startsWith(`-RATHER`) || message.content.toUpperCase().startsWith(`-WYR`)) {
    url = "https://www.rrrather.com/botapi";
    ratherChannel = message.channel;

    ratherHttp.open('GET', url, true);
    ratherHttp.send();
  }
  else if (message.content.toUpperCase().startsWith(`-BULLDOGS`)) {
    message.channel.send("RUF RUF");
  }
  else if (message.content.toUpperCase().startsWith(`-COD`)) {
    url = "https://profile.callofduty.com/cod/login"
    codChannel = message.channel;

    console.log('Sending cod token request');
    codTokenRequest.open('GET', url, true);
    codTokenRequest.responseType = "document";
    codTokenRequest.send();
  }
})

// Movie callback
movieHttp.onload = function () {
  // Begin accessing JSON data here
  var data = JSON.parse(this.response);

  if (movieHttp.status >= 200 && movieHttp.status < 400) {
    // Send the message
    movieChannel.send("Title: " + data.Title + "\nYear: " + data.Year + "\nDirector: " + data.Director + "\nGenre: " + data.Genre + "\nCast: " + data.Actors + "\nRuntime: " + data.Runtime + "\nLanguage: " + data.Language + "\nPlot: " + data.Plot + "\n" + data.Poster);
  } else {
    console.log('Movie http status error');
  }
}

// Would you rather callback
ratherHttp.onload = function () {
  var data = JSON.parse(this.response);

  if (ratherHttp.status >= 200 && ratherHttp.status < 400) {
    var question = data.title;

    // Capitalise the first letter of the question
    question[0] = question[0].toUpperCase();

    // Send the message
    ratherChannel.send(question + ":\n\n😬 " + data.choicea + "\nOR\n😒 " + data.choiceb + "\n\nReact with your answer!");
  }
  else {
    console.log('Would you rather status error');
  }
}

codTokenRequest.onload = function () {
  console.log('Hi test success');
  csrfToken = this.responseText.slice(this.responseText.indexOf(csrfTokenPrefix) + csrfTokenPrefix.length);
  csrfToken = csrfToken.slice(0, csrfToken.indexOf('"'));
  console.log(csrfToken);
  codChannel.send("CSRF token received: " + csrfToken);
  console.log(`XSRF-TOKEN=${csrfToken}`);


  var options = {
    'method': 'POST',
    'url': 'https://profile.callofduty.com/login',
    'headers': {
      'Cookie': `XSRF-TOKEN=${csrfToken}`
    },
    formData: {
      'username': `${process.env.codAccountEmail}`,
      'password': `${process.env.codAccountPassword}`,
      'remember_me': 'true',
      '_csrf': `${csrfToken}`
    }
  };
  request(options, function (error, response) { 
    if (error) throw new Error(error);
    console.log(response.body);
    console.log(options);
  });

  // var data = new FormData();
  // data.append("username", process.env.codAccountEmail);
  // data.append("password", process.env.codAccountPassword);
  // data.append("remember_me", "true");
  // data.append("_csrf", csrfToken);

  // // data.submit('https://profile.callofduty.com/do_login?new_SiteId=cod', function (err, res) {
  // //   // res – response object (http.IncomingMessage)  //
  // //   console.log(res);
  // // });
  // codAuthRequest.withCredentials = true;

  // codAuthRequest.open("POST", "https://profile.callofduty.com/do_login?new_SiteId=cod");
  // codAuthRequest.setRequestHeader("Cookie", "XSRF-TOKEN=" + csrfToken);

  // codAuthRequest.send(data);

}

codAuthRequest.onload = function () {
  console.log("Auth success");
  console.log(this.responseText);
}

Client.login(process.env.token);