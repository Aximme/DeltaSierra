const Discord = require("discord.js")
const {EmbedBuilder} = require("discord.js");

module.exports = {
    name: "ban",
    description: "Bannissement d'un membre + raison.",
    permission: Discord.PermissionFlagsBits.BanMembers,
    dm: false,
    category:"\\🛡️ •  Modération :",
    options: [
        {
            type:"user",
            name:"membre",
            description:"@ de la personne a bannir",
            required: true,
            autocomplete: false,
    }, {
            type:"string",
            name:"reason",
            description:"la raison du bannissement",
            required:false,
            autocomplete: false,
        }
        ],

    async run(bot, message, args) {

        try {
            let ban_author = message.user.tag
            let user =  await bot.users.fetch(args._hoistedOptions[0].value)
            if(!user) return message.reply("Pas de membre à bannir")
            let member = message.guild.members.cache.get(user.id)

            let reason = args.getString("reason")
            if(!reason) reason = `Aucune raison renseignée. (Ban par : ${ban_author})`

            // Vérifications d'usage :

            let errorMessage = '';

            if (message.user.id === user.id) {
                errorMessage = "Impossible de bannir le même discord ID que celui executant la commmande.";
            } else if ((await message.guild.fetchOwner()).id === user.id) {
                errorMessage = "Impossible de bannir le propriétaire du serveur.";
            } else {
                const member = message.guild.members.resolve(user);
                if (member && !member.bannable) {
                    errorMessage = "Impossible de bannir ce membre.\n>> member bannable => FALSE";
                } else if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
                    errorMessage = "Impossible de bannir une personne qui a un rôle supérieur à l'utilisateur executant la commande.";
                } else if ((await message.guild.bans.fetch()).get(user.id)) {
                    errorMessage = "Utilisateur déja banni.";
                }
            }
            //Error Embed
            if (errorMessage !== '') {
                const occuredError = new EmbedBuilder()
                    .setColor(0xFFC600)
                    .setTitle(`\\⚠️ Une erreur est survenue.`)
                    .addFields({ name: '‎', value: `\`\`\`diff\n- Détails de l'erreur : \n\n${errorMessage}\`\`\`` })
                    .setTimestamp()
                    .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });

                return message.reply({ embeds: [occuredError] });
            }

            /*if(message.user.id === user.id) return message.reply("Impossible de te ban toi même.")
            if((await message.guild.fetchOwner()).id === user.id) return message.reply("Impossible de bannir le propriétaire du serveur.")
            if(member && !member.bannable) return message.reply(":x: Erreur, impossible de bannir ce membre.")
            if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Impossible de bannir une personne avec un rôle supérieur au tient.")
            if((await message.guild.bans.fetch()).get(user.id)) return message.reply("Cet utilisateur est déjà banni.")*/

            //Message envoyé en pm a l'utilisateur banni
            const banPrivate = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`\\⛔ Banni de \`${message.guild.name}\` `)
                .addFields({ name: '‎', value: `\`\`\`md\n# Raison #\n${reason}\n\n# Moderator #\n${ban_author}\`\`\`` })
                .setTimestamp()
                .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });
            try{await user.send({ embeds: [banPrivate] })} catch(err) {}

            //Envoi du ban dans le salon ou a été saisi la commande
            const banServer = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`\\⛔ \`${ban_author}\`  à Banni  \`${user.tag}\``)
                .addFields({ name: '‎', value: `\`\`\`md\n# Raison #\n${reason}\n\n# Durée #\nPERMANENT\`\`\`` })
                .setTimestamp()
                .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });

            await message.reply({ embeds: [banServer] })
            await message.guild.bans.create(user.id, {reason: reason})

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