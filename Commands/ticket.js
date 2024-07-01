const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')
const Discord = require("discord.js");

module.exports = {
    name: "ticket",
    description: "Permet de configuer le système de ticket.",
    permission: Discord.PermissionFlagsBits.Administrator,
    dm: false,
    category: "<:admin:1257466365116289184>  • Administration :",


    async run(bot, message, args, db) {
        const embed = new EmbedBuilder()
            .setTitle("\\🎫 Systeme de Tickets")
            .setDescription("Pour ouvrir un ticket, choisis une categorie correspondant a ton probleme ci-dessous.")
            .setColor("#5865F2")
            .setThumbnail(message.guild.iconURL({dynamic: true}))
            .setTimestamp()
            .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });

        const select = new StringSelectMenuBuilder()
            .setCustomId('openticket')
            .setPlaceholder('Raison de l\'ouverture du Ticket')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('⚠️ Signalement / Plainte')
                    .setValue('Signalement_Plainte'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('⚙️ Rapport de Bug(s)')
                    .setValue('Rapport_Bug'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('🛡️ Demande de Debanissement')
                    .setValue('Debanissement'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('🧭 Autre')
                    .setValue('Autre'),
            );

        const row = new ActionRowBuilder()
            .addComponents(select);

        await message.reply({ embeds: [embed], components: [row] });
    }
}