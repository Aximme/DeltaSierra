const Discord = require("discord.js")
const {EmbedBuilder} = require("discord.js");

module.exports = {
    name: "unban",
    description: "Débanissement d'un membre.",
    permission: Discord.PermissionFlagsBits.BanMembers,
    dm: false,
    options: [
        {
            type:"user",
            name:"utilisateur",
            description:"@ de l'utilisateur a débannir",
            required: true
        }, {
            type:"string",
            name:"reason",
            description:"Raison du débannissement",
            required:false
        }
    ],

    async run(bot, message, args) {

        try {
            let unban_author = message.user.tag
            let user =  args.getUser("utilisateur")
            if(!user) return message.reply("\\⚠️ Pas de membre à Unban.")

            let reason = args.getString("reason")
            if(!reason) reason = `Aucune raison renseignée. (Ban par : ${unban_author})`

            // Vérifications d'usage :
            const notBan = new EmbedBuilder()
                .setColor(0xFFC600)
                .setTitle(`\\⚠️ Une erreur est survenue.`)
                .addFields({ name: '‎', value: `\`\`\`diff\n- Détails de l'erreur : \n\nL'utilisateur saisi n'est pas banni de ce serveur.\nServer name = [${message.guild.name}]\`\`\`` })
                .setTimestamp()
                .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });
            if(!(await message.guild.bans.fetch()).get(user.id)) return message.reply({embeds: [notBan]})

            //Message envoyé en pm a l'utilisateur banni
            const unbanPrivate = new EmbedBuilder()
                .setColor(0x34eb6b)
                .setTitle(`\\🏳️ Unban de \`${message.guild.name}\` `)
                .addFields({ name: '‎', value: `\`\`\`md\n# Raison #\n${reason}\n\n# Moderator #\n${message.user.tag}\`\`\`` })
                .setTimestamp()
                .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });
            try{await user.send({ embeds: [unbanPrivate] })} catch(err) {}

//Envoi du ban dans le salon ou a été saisi la commande
            const unbanServer = new EmbedBuilder()
                .setColor(0x34eb6b)
                .setTitle(`\\🏳️ \`${message.user.tag}\`  à Unban  \`${user.tag}\``)
                .addFields({ name: '‎', value: `\`\`\`md\n# Raison #\n${reason}\`\`\`` })
                .setTimestamp()
                .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });

            await message.reply({ embeds: [unbanServer] })
            await message.guild.members.unban(user, reason)

        } catch (err) {
            console.log(err)
            const entryError = new EmbedBuilder()
                .setColor(0xFFC600)
                .setTitle(`\\⚠️ Une erreur est survenue.`)
                .addFields({ name: '‎', value: `\`\`\`diff\n- Détails de l'erreur : \n\nLa saisie de l'utilisateur a bannir est incorrecte.\n      ${err}\`\`\`` })
                .setTimestamp()
                .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });
            return message.reply({embeds: [entryError]})
        }
    }
}