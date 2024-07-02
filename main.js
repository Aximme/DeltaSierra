const Discord = require("discord.js");
const intents = new Discord.IntentsBitField(3276799);
const bot = new Discord.Client({intents});
const loadCommands = require("./Loader/loadCommands");
const loadEvents = require("./Loader/loadEvents");
const config = require("./config");
const {EmbedBuilder} = require("discord.js");


bot.commands = new Map();
bot.commands = new Discord.Collection();
bot.function = {
    createID : require("./Functions/createID"),
    searchSpam : require("./Functions/searchSpam")
}

bot.color = "#5865F2";
bot.owner = "aximme";


bot.login(config.token);
console.log("\n")
loadEvents(bot)
loadCommands(bot)

                                // MOD AUDIT LOGS SYSTEM //
