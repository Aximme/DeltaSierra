const Discord = require("discord.js")
const ms = require("ms")
const {EmbedBuilder} = require("discord.js");

module.exports = {

    name: "mute",
    description: "Timeout / Mute un membre du serveur temporairement.",
    permission: Discord.PermissionFlagsBits.KickMembers,
    dm: false,
    category:"<:shield2:1257466393616449586>  •  Modération :",
    options: [
        {
            type:"user",
            name:"membre",
            description:"Personne visée par le mute",
            required:true,
            autocomplete: false,
        }, {
            type:"string",
            name:"duree",
            description:"Temps du mute",
            required: true,
            autocomplete: false,
        }, {
            type:"string",
            name:"raison",
            description:"Raison du mute",
            required:false,
            autocomplete: false,
        }
    ],


    async run(bot, message, args) {

        let errorMessage = '';

        let user = args.getUser("membre");
        if (!user) {
            errorMessage = "Le membre à mute n'a pas été trouvé.\nVérifiez les paramètres entrés et réessayez.";
        }

        let member;
        if (!errorMessage) {
            member = message.guild.members.cache.get(user.id);
            if (!member) {
                errorMessage = "Le membre à mute n'a pas été trouvé.\nVérifiez les paramètres entrés et réessayez.";
            }
        }

        let time;
        if (!errorMessage) {
            time = args.getString("duree");
            if (!time) {
                errorMessage = "Aucune durée n'a été saisie.";
            } else if (isNaN(ms(time))) {
                errorMessage = "Le format de temps saisi n'est pas reconnu.\n\nGuide de la saisie des différentes durées :\n2d = 2jours | 10h = 10heures | 2,5h = 2heures et demi | 3m = 3minutes | 10s = 10secondes";
            } else if (ms(time) > 2419200000) {
                errorMessage = "Un mute ne peut pas durer plus de 28 Jours.\n[Limite Discord]";
            }
        }

        let reason = args.getString("raison");
        if (!reason) reason = `Aucune raison fournie. Auteur du mute : ${message.user.tag}`;

        if (!errorMessage) {
            if (message.user.id === user.id) {
                errorMessage = "Impossible de mute le même discord ID que celui executant la commmande";
            } else if ((await message.guild.fetchOwner()).id === user.id) {
                errorMessage = "Impossible de mute le propriétaire du serveur.";
            } else if (!member.moderatable) {
                errorMessage = "Impossible de mute ce membre.\n>> member moderatable => FALSE";
            } else if (message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
                errorMessage = "Impossible de mute une personne qui a un rôle supérieur à l'utilisateur executant la commande.";
            } else if (member.isCommunicationDisabled()) {
                errorMessage = "Utilisateur déjà mute.";
            }
        }

        if (errorMessage !== '') {
            const occuredError = new EmbedBuilder()
                .setColor(0xFFC600)
                .setTitle(`<:warning:1257468091776897116>️  Une erreur est survenue.`)
                .addFields({ name: '‎', value: `\`\`\`diff\n- Détails de l'erreur : \n\n${errorMessage}\`\`\`` })
                .setTimestamp()
                .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });

            return message.reply({ embeds: [occuredError] });
        }


        //Message envoyé en pm a l'utilisateur mute
        const mutePrivate = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`<:mute:1257468366956925009> Mute sur \`${message.guild.name}\` `)
            .addFields({ name: '‎', value: `\`\`\`md\n# Temps #\n${time}\n\n# Moderator #\n${message.user.tag}\`\`\``, inline:true},
                             { name: '‎', value: `\`\`\`md\n# Raison #\n${reason}\`\`\``,inline:true})
            .setTimestamp()
            .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });
        try{await user.send({ embeds: [mutePrivate] })} catch(err) {}

        //Envoi du mute dans le salon ou a été saisi la commande
        const muteServer = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`<:mute:1257468366956925009> \`${message.user.tag}\`  à rendu muet  \`${user.tag}\``)
            .addFields({ name: '‎', value: `\`\`\`md\n# Temps #\n${time}\n\n# Moderator #\n${message.user.tag}\`\`\``,inline:true},
                             { name: '‎', value: `\`\`\`md\n# Raison #\n${reason}\`\`\``,inline:true})
            .setTimestamp()
            .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });
        await message.reply({ embeds: [muteServer] })
        await member.timeout(ms(time), reason)
    }
}
