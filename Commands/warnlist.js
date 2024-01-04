const Discord  = require("discord.js");
const {EmbedBuilder} = require("discord.js");

module.exports = {

    name: "warnlist",
    description: "Affiche les warns d'un utilisateur.",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "\\🛡️ •  Modération :",
    options: [
        {
            type: "user",
            name: "membre",
            description: "L'utilisateur dont vous souhaitez afficher les Warns.",
            required: true,
            autocomplete: false,
        }
    ],

    async run(bot, message, args, db) {

        let user = args.getUser("membre")
        if(!user) return message.reply("pas de membre")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("pas de membre")

        db.query(`SELECT * FROM warns WHERE guildID = '${message.guildId}' AND userID = '${user.id}'`, async (err, req) => {

            const noWarns = new EmbedBuilder()
                .setColor(0xFFC600)
                .setTitle(`\\⚠️ Une erreur est survenue.`)
                .addFields({name: '‎', value: `\`\`\`diff\n- Détails de l'erreur : \n\nL'utilisateur spécifié n'a aucun Warns.\`\`\``})
                .setTimestamp()
                .setFooter({text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL()});

            if(req.length < 1) return message.reply({embeds: [noWarns]})
            //Tri du plus recent au moins récent.
            await req.sort((a,b) => parseInt(a.date) - parseInt(b.date))

            let allwarnsEmbed = new Discord.EmbedBuilder()
                .setColor("#F58F2A")
                .setTitle(`\\📋 Liste des Warns de \`${user.tag}\``)
                .setThumbnail(user.displayAvatarURL({dynamic:true}))
                .setTimestamp()
                .setFooter({text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL()})

                for(let i = 0; i < req.length; i++) {

                    allwarnsEmbed.addFields([{ name: `Warn n°${i + 1}`, value: `> **Moderator :** ${(await bot.users.fetch(req[i].authorID)).tag}\n> **Warn ID :** \`${req[i].warnID}\`\n> **Raison :** \`${req[i].reason}\`\n> **Date :** <t:${Math.floor(parseInt(req[i].date) / 1000)}:F>` }]);
                }
                await message.reply({embeds: [allwarnsEmbed]})
        })
    }
}