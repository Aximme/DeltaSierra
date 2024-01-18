const Discord = require("discord.js")
const {EmbedBuilder} = require("discord.js");

module.exports = {

    name: "botinfo",
    description: "Affiche la latence et des informations sur le bot.",
    permission: "Aucune",
    category:"\\📋 • Informations :",
    dm: true,


    async run(bot, message, args) {
        let webLatency = bot.ws.ping
        const startTime = Date.now();
        const msg = await message.reply(`Calcul en cours...`);
        const endTime = Date.now();

        const infoEmbed = new EmbedBuilder()
            .setTitle("\\📡 Statistiques du Bot")
            .setThumbnail(bot.user.displayAvatarURL())
            .setColor("#0099ff")
            .addFields({name:"Latence du WebSocket", value:`\`${webLatency} ms\``, inline:true},
                             {name:"Temps de Réponse du Serveur", value:`\`${endTime - startTime} ms\``, inline:true})
            .addFields({name:`Serveurs et Utilisateurs du Bot :`,value:`\\📟 Serveurs : \`${bot.guilds.cache.size}\`\n\\👥 Utilisateurs : \`${bot.users.cache.size}\` `})

        await msg.edit({embeds: [infoEmbed] });
    },
};