const Discord = require("discord.js")

module.exports = {

    name: "ping",
    description: "Affiche la latence du bot & la réactivité du serveur.",
    permission: "Aucune",
    category:"\\🛠️ •  Outils :",
    dm: true,


    async run(bot, message, args) {

        await message.reply(`Ping : \`${bot.ws.ping}\``)
    }
}
