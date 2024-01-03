const Discord = require("discord.js");
const loadSlashCommands = require("../Loader/loadSlashCommands");
const loadDatabase = require("../Loader/loadDatabase");

module.exports = async bot => {

    bot.db = await loadDatabase()
    bot.db.connect(function () {
        console.log("          >>> 🌐 Database connected.")
    })

    await loadSlashCommands(bot)

    console.log(`\n==================== ✅  ${bot.user.tag} READY ✅  ====================\n`)
}