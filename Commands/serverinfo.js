const Discord = require("discord.js")
const {EmbedBuilder,  ChannelType} = require("discord.js");

module.exports = {
    name: "serverinfo",
    description: "Informations du serveur.",
    dm: false,
    category:"<:info:1257466373286924288>  • Informations :",


    async run(bot, message, args) {

        let guild_description = message.guild.description === null ? "Aucune renseignée" : message.guild.description;

        const embed = new Discord.EmbedBuilder()
            .setTitle(`<:info:1257466373286924288>  Informations du Serveur \`${message.guild.name}\``)
            .setThumbnail(message.guild.iconURL({dynamic: true}))
            .setDescription(`
            > **Nom :**  ${message.guild.name}
            > **ID :**  ${message.guild.id}
            > **Description :**  ${guild_description}
            > **Owner :**  <@${message.guild.ownerId}> | ID : \`${message.guild.ownerId}\`
            > **Boost(s) :**  \`${message.guild.premiumSubscriptionCount}\`
            > **Créer :**  <t:${parseInt(message.guild.createdTimestamp /1000)}:R>
            > **Niveau de Protection :**  \`${message.guild.verificationLevel}\`
            
            <:user:1257466404211265576>  • **__Informations Utilisateurs :__**

            > <:bot:1257466368123732008> **Bots :**  \`${message.guild.members.cache.filter(m => m.user.bot).size}\`
            > <:users:1257468292000514130>  **Total Membres :**  \`${message.guild.memberCount}\`

            <:moreplus:1257466379133648966>  • **__Autres Information :__**

            > Catégorie(s) : \`${message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildCategory).size}\`  |  Stage(s) :  \`${message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildStageVoice).size}\`  |  Vocaux :  \`${message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size}\`  |  Textuel(s) :  \`${message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size}\`
            > Rôles : \`${message.guild.roles.cache.size}\`  |  Emoji(s) : \`${message.guild.emojis.cache.size}\`
            `)
            .setTimestamp()
            .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() })

        message.reply({embeds: [embed]})
    }
}