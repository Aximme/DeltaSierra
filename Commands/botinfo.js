const Discord = require("discord.js")
const {EmbedBuilder} = require("discord.js");

module.exports = {

    name: "botinfo",
    description: "Affiche la latence et des informations sur le bot.",
    permission: "Aucune",
    category:"<:info:1257466373286924288>  • Informations :",
    dm: true,


    async run(bot, message, args) {
        let webLatency = bot.ws.ping
        const startTime = Date.now();
        /*const msg = await message.reply(`<:ping:1257466386716954685>  • Calcul en cours...`);*/
        const endTime = Date.now();

        const infoEmbed = new EmbedBuilder()
            .setTitle("<:ping:1257466386716954685>  Statistiques du Bot")
            .setThumbnail(bot.user.displayAvatarURL())
            .setColor("#0099ff")
            .addFields({name:"Latence du WebSocket", value:`\`${webLatency} ms\``, inline:true},
                             {name:"Temps de Réponse du Serveur", value:`\`${endTime - startTime} ms\``, inline:true})
            .addFields({name:`Serveurs et Utilisateurs du Bot :`,value:`<:server:1257466390038839417>  Serveurs : \`${bot.guilds.cache.size}\`\n<:users:1257468292000514130>  Utilisateurs : \`${bot.users.cache.size}\` `})

        await message.reply({embeds: [infoEmbed] });
    },
};