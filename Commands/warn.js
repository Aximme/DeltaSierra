const Discord = require("discord.js")
const {EmbedBuilder} = require("discord.js");

module.exports = {
    name: "warn",
    description: "Avertit un utilisateur d'une faute/erreur.",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category:"\\🛡️ •  Modération :",
    options: [
        {
            type:"user",
            name:"membre",
            description:"L'utilisateur que vous souhaitez avertir",
            required: true,
            autocomplete: false,
        }, {
            type:"string",
            name:"raison",
            description:"La raison de l\'avertissement.",
            required: false,
            autocomplete: false,
        }
    ],

    async run(bot, message, args, db) {
        try {
        let errorMessage = ""

        let user = args.getUser("membre");
        if(!user) return message.reply("pas de membre")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("pas de membre")

        let reason = args.getString("raison")
        if(!reason) reason = `Aucune raison fournie. Auteur du Warn :${message.user.tag}`

        if (message.user.id === user.id) {
            errorMessage = "Impossible de Warn le même discord ID que celui executant la commmande.";
        } else if ((await message.guild.fetchOwner()).id === user.id) {
            errorMessage = "Impossible de Warn le propriétaire du serveur.";
        } else {
            const member = message.guild.members.resolve(user);
            if (message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
                errorMessage = "Impossible de Warn une personne qui a un rôle supérieur à l'utilisateur executant la commande.";
            } else if ((await message.guild.members.fetchMe()).roles.highest.comparePositionTo(member.roles.highest) <= 0){
                errorMessage = "DeltaSierra ne peut pas Warn cet utilisateur.";
            }
            //Error Embed
            if (errorMessage !== '') {
                const occuredError = new EmbedBuilder()
                    .setColor(0xFFC600)
                    .setTitle(`\\⚠️ Une erreur est survenue.`)
                    .addFields({name: '‎', value: `\`\`\`diff\n- Détails de l'erreur : \n\n${errorMessage}\`\`\``})
                    .setTimestamp()
                    .setFooter({text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL()});

                return message.reply({embeds: [occuredError]});
            }
        }
            let ID = await bot.function.createID("WARN");

            try {

                const warnPrivate = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(`\\⚠️ Vous avez été Warn sur le serveur : \`${message.guild.name}\` `)
                    .addFields({ name: '‎', value: `\`\`\`md\n# Moderator #\n${message.user.tag}\n\n# WarnID #\n${ID}\`\`\``,inline:true},
                        { name: '‎', value: `\`\`\`md\n# Raison #\n${reason}\`\`\``,inline:true})
                    .setTimestamp()
                    .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });

                await user.send({embeds: [warnPrivate]});
            } catch (err) {
                console.log(err);
            }

            // Réponse sur le serveur
            const warnServer = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`\\⚠️ \`${message.user.tag}\`  à Warn  \`${user.tag}\``)
                .addFields({ name: '‎', value: `\`\`\`md\n# Moderator #\n${message.user.tag}\n\n# WarnID #\n${ID}\`\`\``,inline:true},
                    { name: '‎', value: `\`\`\`md\n# Raison #\n${reason}\`\`\``,inline:true})
                .setTimestamp()
                .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });

            await message.reply({embeds: [warnServer]});

            // Insertion dans la base de données
            db.query(`INSERT INTO warns (guildID, userID, authorID, warnID, reason, date) VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`);

        } catch (err) {
            console.log(err);
        }
    }
}