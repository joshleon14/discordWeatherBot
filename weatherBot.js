require('dotenv').config()
const Discord = require("discord.js")
const client = new Discord.Client()
let request = require('request');
var moment = require('moment');
var cron = require('node-cron');

client.on('ready', () => {
    console.log("Connected as " + client.user.tag)
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name)
    });

    //Runs everyday at 7:30 am
    cron.schedule("55 10 * * *",function() {
        grabWeather(sendMorningMessage)
    })
    
});

client.on('message', (message) => {
    if (message.author == client.user) {
        return
    }

    if (message.content.startsWith("!")) {
        processCommand(message)
    }
});

if (process.env.bot_secrect_token) {
    client.login(process.env.bot_secrect_token)
}

function grabWeather(callback) {
    let url = "http://api.openweathermap.org/data/2.5/weather?q=Lafayette,US&units=imperial&type=accurate&APPID=f94c92f09da68058c956522e51c32d72"
    console.log(url)
    request(url, function (err, response, body) {
        if(err){
          console.log('error:', error);
        } else {
            let data = JSON.parse(body)
        let weather = "Forecast for today calls for **" + data.weather[0].main + "**\n";
        let temps = "Current temperature is: **" + data.main.temp + " F**\n The low today is **" + data.main.temp_min + " F**\n The high toay is **" + data.main.temp_max +" F**\n" ;
        let wind = "With wind speed **" +  data.wind.speed +" mph **";
        let finalString = weather + temps + wind
        callback(finalString);
        }
      });
}

function sendMorningMessage(weatherString) {
    let introduction = "**GoodMorning my beautiful people!**"
    let sun = "☀️ \n";
    let date = getTodaysDate()
    console.log(introduction + sun + date + weatherString)
    var helpersChannel = client.channels.get(process.env.helpers_channel_id);
    helpersChannel.send(introduction + sun + date + weatherString);
}

function getTodaysDate() {
    let day = moment().format('dddd');
    let date = moment().format('MMMM Do YYYY, h:mm:ss a');
    return "Today is __" + day + ", " + date + "__\n"
}


function processCommand(msg) {
    let fullCommand = msg.content.substr(1);
    let splitCommand = fullCommand.split(" ");
    let primaryCommand = splitCommand[0]

    if (primaryCommand == "weather") {
        sendCurrentWeather(msg)
    } else if (primaryCommand == "help") {
        msg.channel.send("To get the current weather, please type the command `!weather`.")
    } else {
        msg.channel.send("I don't understand the command. Try `!help` or `!weather`")
    }
}

function sendCurrentWeather(msg) {
    let url = "http://api.openweathermap.org/data/2.5/weather?q=Lafayette,US&units=imperial&type=accurate&APPID=f94c92f09da68058c956522e51c32d72"
    console.log(url)
    request(url, function (err, response, body) {
        if(err){
          console.log('error:', error);
        } else {
            let data = JSON.parse(body)
        let weather = "Forecast for today calls for **" + data.weather[0].main + "**\n";
        let temps = "Current temperature is: **" + data.main.temp + " F**\n The low today is **" + data.main.temp_min + " F**\n The high toay is **" + data.main.temp_max +" F**\n" ;
        let wind = "With wind speed **" +  data.wind.speed +" mph **";
        let finalString = weather + temps + wind
        msg.channel.send(finalString);
        }
      });
}