const Discord = require("discord.js");
const intents = new Discord.IntentsBitField(3276799);
const bot = new Discord.Client({ intents });

// Initialiser bot.commands comme une nouvelle Map.
bot.commands = new Map();

const loadCommands = require("./Loader/loadCommands");
const config = require("./config");

bot.login(config.token);

// Charger les commandes après que le bot soit connecté.
bot.on('ready', () => {
    loadCommands(bot);
    console.log(`\n>>>>>>>>>> ${bot.user.tag} ready ✅ \n`);
});

bot.on("messageCreate", async message => {
    if (message.content === "!ping") {
        const command = bot.commands.get("ping");
        if (command) {
            command.run(bot, message);
        } else {
            console.log('Command not found.');
        }
    }
});
