const Discord = require("discord.js")
const loadSlashCommands = require("../Loader/loadSlashCommands")

module.exports = async bot => {

    await loadSlashCommands(bot)

    console.log(`\n==================== ✅  ${bot.user.tag} READY ✅  ====================\n`)
}