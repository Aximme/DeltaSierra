const Discord = require("discord.js")
const { EmbedBuilder } = require('discord.js');


module.exports = {

    name: "embed",
    description: "Affiche différents embeds de test",
    permission: "Aucune",
    dm: true,


    async run(bot, message, args) {
        let check_owner = message.user.id === 905917010507079680;
        if(!check_owner) return message.reply("# Seul MAXIME peut utiliser cette commande fdp.")


        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Some title')
            .setURL('https://discord.js.org/')
            .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
            .setDescription('Some description here')
            .setThumbnail('https://i.imgur.com/AfFp7pu.png')
            .addFields(
                { name: 'Regular field title', value: 'Some value here' },
                { name: '\u200B', value: '\u200B' },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
            .setImage('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp()
            .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

        const banServer = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle("\\⛔ \`${ban_author}\` à Banni \`${user.tag}\` ")
            .addFields({ name: '‎', value: '\`\`\`md\n# Temps #\nPermanent\n\n# Moderator #\nMODO\`\`\`' })
            .setTimestamp()
            .setFooter({ text: 'DeltaSierra © ', iconURL: bot.user.displayAvatarURL() });

        await message.reply({ embeds: [banServer] })
    }
}
