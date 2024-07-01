const Discord = require("discord.js")
const {EmbedBuilder} = require("discord.js");

module.exports = {
    name: "userinfo",
    description: "Récupère des informations sur un utilisateur du serveur.",
    permission: "Aucune",
    dm: false,
    category:"<:info:1257466373286924288>  • Informations :",
    options: [
        {
            type:"user",
            name:"membre",
            description:"utilisateur dont vous voulez les informations",
            required: true,
            autocomplete: false,
        }
    ],

    async run(bot, message, args) {

        let errorMessage = '';


        let user = args.getUser("membre");
        let userok = await message.guild.members.fetch(user.id).catch(() => null);
        if (!user) {
            errorMessage = "Le membre à afficher n'a pas été trouvé.\nVérifiez les paramètres entrés et réessayez.";
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

        let checkbot = " "; if(user.bot) checkbot = "\\✔️"; else checkbot = "\\❌"


        const userRoles = userok.roles.cache
            .filter(role => role.id !== message.guild.id) // Exclure le rôle @everyone
            .map(role => role.toString())
            .join(', ') || 'Aucun';

        const userInfoEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('<:users:1257468292000514130>  Informations Utilisateur')
            .setThumbnail(userok.displayAvatarURL())
            .setDescription(`
            > **Nom d\'utilisateur :** ${user.tag} | ${user.toString()}
            > **Tag :** ${user.tag}
            > **ID :** ${user.id}
            > **Bot : ** ${checkbot}
            > **Statut :** ${userok.presence ? userok.presence.status : 'Indisponible'}
            > **Compte créer :** <t:${parseInt(user.createdTimestamp /1000)}:R>

            __**Informations Relatives au Serveur**__
            
            > **A rejoint le serveur :** <t:${parseInt(userok.joinedTimestamp / 1000)}:R>
            > **Rôle(s) :** ${userRoles}
            `)
            .setTimestamp()
            .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });

        await message.reply({ embeds: [userInfoEmbed] });

    }
}