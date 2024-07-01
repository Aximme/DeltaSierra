const Discord = require("discord.js")
const ms = require("ms")
const {EmbedBuilder} = require("discord.js");

module.exports = {

    name: "unmute",
    description: "Restaure la capacité de parole d'un membre.",
    permission: Discord.PermissionFlagsBits.KickMembers,
    dm: false,
    category:"<:shield2:1257466393616449586>  •  Modération :",
    options: [
        {
            type:"user",
            name:"membre",
            description:"Personne visée par le unmute",
            required:true,
            autocomplete: false,
        }, {
            type:"string",
            name:"raison",
            description:"Raison du unmute",
            required:false,
            autocomplete: false,
        }
    ],


    async run(bot, message, args) {

        let errorMessage = '';

        let user = args.getUser("membre");
        if (!user) {
            errorMessage = "Le membre à Unmute n'a pas été trouvé.\nVérifiez les paramètres entrés et réessayez.";
        }

        let member;
        if (!errorMessage) {
            member = message.guild.members.cache.get(user.id);
            if (!member) {
                errorMessage = "Le membre à Unmute n'a pas été trouvé.\nVérifiez les paramètres entrés et réessayez.";
            }
        }

        let reason = args.getString("raison");
        if (!reason) reason = `Aucune raison fournie. Auteur de l'Unmute : ${message.user.tag}`;

        if (!errorMessage) {
            if (!member.moderatable) {
                errorMessage = "Impossible d'Unmute ce membre.\n>> member moderatable => FALSE";
            } else if (message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
                errorMessage = "Impossible d'Unmute une personne qui a un rôle supérieur à l'utilisateur executant la commande.";
            } else if (!member.isCommunicationDisabled()) {
                errorMessage = "Le membre n'est pas mute.";
            }
        }

        if (errorMessage !== '') {
            const occuredError = new EmbedBuilder()
                .setColor(0xFFC600)
                .setTitle(`<:warning:1257468091776897116>  Une erreur est survenue.`)
                .addFields({ name: '‎', value: `\`\`\`diff\n- Détails de l'erreur : \n\n${errorMessage}\`\`\`` })
                .setTimestamp()
                .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });

            return message.reply({ embeds: [occuredError] });
        }

        //Msg en pm a l'utilisateur Unmute
        const unmutePrivate = new EmbedBuilder()
            .setColor("#1a7325")
            .setTitle(`<:unmute:1257468289056247909>  Unmute sur \`${message.guild.name}\` `)
            .addFields({ name: '‎', value: `\`\`\`md\n# Raison #\n${reason}\n\n# Moderator #\n${message.user.tag}\`\`\``})
            .setTimestamp()
            .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });
        try{await user.send({ embeds: [unmutePrivate] })} catch(err) {}

        //Envoi du Unmute dans le salon ou a été saisi la commande
        const unmuteServer = new EmbedBuilder()
            .setColor("#1a7325")
            .setTitle(`<:unmute:1257468289056247909>  \`${message.user.tag}\`  à Unmute  \`${user.tag}\``)
            .addFields({ name: '‎', value: `\`\`\`md\n# Raison #\n${reason}\n\n# Moderator #\n${message.user.tag}\`\`\``})
            .setTimestamp()
            .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });
        await message.reply({ embeds: [unmuteServer] })
        await member.timeout(null)

    }
}
