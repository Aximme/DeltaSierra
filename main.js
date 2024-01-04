const Discord = require("discord.js");
const intents = new Discord.IntentsBitField(3276799);
const bot = new Discord.Client({ intents });
const loadCommands = require("./Loader/loadCommands");
const loadEvents = require("./Loader/loadEvents");
const config = require("./config");


bot.commands = new Map();
bot.commands = new Discord.Collection();
bot.function = {
    createID : require("./Functions/createID")
}

bot.color = "#00fbff";
bot.owner = "aximme"


bot.login(config.token);
console.log("\n")
loadEvents(bot)
loadCommands(bot)


