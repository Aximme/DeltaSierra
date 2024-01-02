const Discord = require("discord.js")
const {EmbedBuilder} = require("discord.js");

module.exports = {
    name: "kick",
    description: "Expulsion d'un membre + raison.",
    permission: Discord.PermissionFlagsBits.KickMembers,
    dm: false,
    category:"\\🛡️ •  Modération :",
    options: [
        {
            type:"user",
            name:"membre",
            description:"@ de la personne a expulser",
            required: true,
            autocomplete: false,
        }, {
            type:"string",
            name:"reason",
            description:"la raison de l'expulsion",
            required: false,
            autocomplete: false,
        }
    ],

    async run(bot, message, args) {

        let kick_author = message.user.tag
        let user =  await bot.users.fetch(args._hoistedOptions[0].value)
        if(!user) return message.reply("Pas de membre à expulser")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("La personne a expulser n'est pas présente sur le serveur.")

        let reason = args.getString("reason")
        if(!reason) reason = `Aucune raison fournie. Auteur du mute : ${kick_author}`
        
        // Vérifications d'usage :
        let errorMessage = '';

        if (message.user.id === user.id) {
            errorMessage = "Impossible de Kick un discord ID identique a celui de l'utilisateur executant la commande.";
        } else if ((await message.guild.fetchOwner()).id === user.id) {
            errorMessage = "Impossible de kick le propriétaire du serveur.";
        } else {
            const member = message.guild.members.resolve(user);
            if (member && !member.kickable) {
                errorMessage = "Impossible de kick ce membre.\n>> member kickable => FALSE";
            } else if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
                errorMessage = "Impossible de kick une personne qui a un rôle supérieur à l'utilisateur executant la commande.";
            }
        }
        //Error Embed
        if (errorMessage !== '') {
            const occuredError = new EmbedBuilder()
                .setColor(0xFFC600)
                .setTitle(`\\⚠️ Une erreur est survenue.`)
                .addFields({ name: '‎', value: `\`\`\`diff\n- Détails de l'erreur :\n\n${errorMessage}\`\`\`` })
                .setTimestamp()
                .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });

            return message.reply({ embeds: [occuredError] });
        }

        /*if(message.user.id === user.id) return message.reply("Impossible de Kick un discord ID identique a celui de l'utilisateur executant la commande.")
        if((await message.guild.fetchOwner()).id === user.id) return message.reply("Impossible de kick le propriétaire du serveur.")
        if(member && !member.kickable) return message.reply("\\:x: Erreur, impossible de kick ce membre.")
        if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Impossible de kick une personne avec un rôle supérieur au tient.")*/

        //Message envoyé en pm a l'utilisateur kick
        const kickPrivate = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`\\🔨 Kick de \`${message.guild.name}\` `)
            .addFields({ name: '‎', value: `\`\`\`md\n# Raison #\n${reason}\n\n# Moderator #\n${kick_author}\`\`\`` })
            .setTimestamp()
            .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });
        try{await user.send({ embeds: [kickPrivate] })} catch(err) {}

        //Envoi du kick dans le salon ou a été saisi la commande
        const kickServer = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`\\🔨 \`${kick_author}\`  à Kick  \`${user.tag}\``)
            .addFields({ name: '‎', value: `\`\`\`md\n# Raison #\n${reason}\`\`\`` })
            .setTimestamp()
            .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });

        await message.reply({ embeds: [kickServer] })
        await member.kick(reason)

        }
}