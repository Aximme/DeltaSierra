const Discord = require("discord.js")
const {EmbedBuilder} = require("discord.js");

module.exports = {
    name: "clear",
    description: "Supprime un nombre spécifié de messages.",
    permission: Discord.PermissionFlagsBits.BanMembers,
    dm: false,
    category:"\\🛠️ •  Outils :",
    options: [
        {
            type:"number",
            name:"nombre",
            description:"Le nombre de messages que vous souhaitez supprimer.",
            required:true,
            autocomplete: false,
        }, {
            type:"channel",
            name:"salon",
            description:"Le salon ou vous souhaitez supprimer les messages.",
            required: false,
            autocomplete: false,
        }
    ],

    async run(bot, message, args) {
        let channel = args.getChannel("salon")
        if(!channel) channel = message.channel;
        if(channel.id !== message.channel.id && !message.guild.channels.cache.get(channel.id)) return message.reply("\\⚠️ Aucun salon trouvé !")

        let number = args.getNumber("nombre") + 1
        const numberError = new EmbedBuilder()
            .setColor(0xFFC600)
            .setTitle(`\\⚠️ Une erreur est survenue.`)
            .addFields({ name: '‎', value: `\`\`\`diff\n- Détails de l'erreur : \n\nIl faut saisir un nombre entre 0 et 100 inclus.\`\`\`` })
            .setTimestamp()
            .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });
        if(parseInt(number) <= 0 || parseInt(number) > 100) return message.reply({embeds: [numberError]})

        await message.deferReply({ ephemeral: true })

        try {

            let messages = await channel.bulkDelete(parseInt(number))
            await message.followUp({content:`\\🗑️ Suppression de \`${messages.size}\` message(s) dans le salon ${channel}.`, ephemeral:true})

        } catch (err) {

            let messages = [...(await channel.messages.fetch()).filter(msg => (Date.now() - msg.createdAt) <= 1209600000).values()]
            const dateError = new EmbedBuilder()
                .setColor(0xFFC600)
                .setTitle(`\\⚠️ Une erreur est survenue.`)
                .addFields({ name: '‎', value: `\`\`\`diff\n- Détails de l'erreur : \n\nAucun message a supprimer car ils datent tous de plus de 14 jours.\`\`\`` })
                .setTimestamp()
                .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });
            if(messages.length <= 0) return message.followUp({embeds: [dateError]})
            await channel.bulkDelete(messages)

            await message.followUp({content:`\\🗑️ Suppression \*\*uniquement\*\* de \`${messages.length}\` message(s) dans le salon ${channel}.\n\|\|Non suppression de certains messages : Les messages non supprimés datent de plus de 14 jours.\|\|`, ephemeral:true})
        }
    }
}