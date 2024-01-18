const Discord = require("discord.js")
const {EmbedBuilder,  ChannelType} = require("discord.js");

module.exports = {
    name: "serverinfo",
    description: "Récupère des informations sur le serveur ou est saisie la commande",
    dm: false,
    category:"\\📋 • Informations :",


    async run(bot, message, args) {

        let guild_description = message.guild.description === null ? "Aucune renseignée" : message.guild.description;

        const embed = new Discord.EmbedBuilder()
            .setTitle(`\\📍 Informations du Serveur \`${message.guild.name}\``)
            .setThumbnail(message.guild.iconURL({dynamic: true}))
            .setDescription(`
            > **Nom :**  ${message.guild.name}
            > **ID :**  ${message.guild.id}
            > **Description :**  ${guild_description}
            > **Owner :**  <@${message.guild.ownerId}> | ID : \`${message.guild.ownerId}\`
            > **Boost(s) :**  \`${message.guild.premiumSubscriptionCount}\`
            > **Créer :**  <t:${parseInt(message.guild.createdTimestamp /1000)}:R>
            > **Niveau de Protection :**  \`${message.guild.verificationLevel}\`
            
            \\👤 • **__Informations Utilisateurs :__**

            > \\🤖 **Bots :**  \`${message.guild.members.cache.filter(m => m.user.bot).size}\`
            > \\👥 **Total Membres :**  \`${message.guild.memberCount}\`

            \\📝 • **__Autres Information :__**

            > Catégorie(s) : \`${message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildCategory).size}\`  |  Stage(s) :  \`${message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildStageVoice).size}\`  |  Vocaux :  \`${message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size}\`  |  Textuel(s) :  \`${message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size}\`
            > Rôles : \`${message.guild.roles.cache.size}\`  |  Emoji(s) : \`${message.guild.emojis.cache.size}\`
            `)
            .setTimestamp()
            .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() })

        message.reply({embeds: [embed]})
    }
}