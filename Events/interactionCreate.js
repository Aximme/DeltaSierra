const Discord = require("discord.js")

module.exports = async (bot, interaction) => {

    if(interaction.type === Discord.InteractionType.ApplicationCommand) {

        let command = require(`../Commands/${interaction.commandName}`)//ici
        command.run(bot, interaction, command.options)
    }
}