const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')
const Discord = require("discord.js");

module.exports = {
    name: "ticket",
    description: "Permet de configuer le système de ticket.",
    permission: Discord.PermissionFlagsBits.SendMessages,
    dm: false,
    category: "\\🛠️ •  Outils :",


    async run(bot, message, args, db) {
        const embed = new EmbedBuilder()
            .setTitle("Ouvrir un ticket")
            .setDescription("Si vous voullez ouvrir un ticket merci de cliquer ci dessous !")
            .setColor("#5865F2")
            .setThumbnail(message.guild.iconURL({dynamic: true}))
            .setTimestamp()

        const select = new StringSelectMenuBuilder()
            .setCustomId('openticket')
            .setPlaceholder('Faites votre choix !')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Choix 1')
                    .setValue('choix1'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Choix 2')
                    .setValue('choix2'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Choix 3')
                    .setValue('choix3'),
            );

        const row = new ActionRowBuilder()
            .addComponents(select);

        await message.reply({ embeds: [embed], components: [row] });
    }
}