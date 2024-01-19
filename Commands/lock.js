const Discord = require("discord.js")
const {EmbedBuilder} = require("discord.js");

module.exports = {
    name: "lock",
    description: "Verouille un salon.",
    permission: Discord.PermissionFlagsBits.ManageChannels,
    dm: false,
    category:"\\🛡️ •  Modération :",
    options: [
        {
            type:"channel",
            name:"salon",
            description:"Le salon a verouiller",
            required: true,
            autocomplete: false,
        }, {
            type:"role",
            name:"role",
            description:"Le role a lock dans ce salon.",
            required: false,
            autocomplete: false,
        }
    ],

    async run(bot, message, args) {

        let channel = args.getChannel("salon")
        if(!message.guild.channels.cache.get(channel.id)) return message.reply("<:orangeerror:1197921812890263724> Pas de salon trouvé.")
        if(channel.type !== Discord.ChannelType.GuildText && channel.type !== Discord.ChannelType.GuildPublicThread && channel.type !== Discord.ChannelType.GuildPrivateThread) return message.reply("Il faut que le salon selectionné soit un salon textuel.")

        let role = args.getRole("role")
        if(role && !message.guild.roles.cache.get(role.id)) return message.reply("<:orangeerror:1197921812890263724> Le role mentionné n'existe pas.")
        if(!role) role = message.guild.roles.everyone;

        const alreadylock = new EmbedBuilder()
            .setColor("#fca04e")
            .setTitle(`<:alreadylock:1197927574538563625> Le salon ${channel} est déjà Verrouillé.`)
            .setDescription(`<:barrierred:1197929516551634974> Rôle bloqué : ${role.name}`)
            .setTimestamp()
            .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });


        if(channel.permissionOverwrites.cache.get(role.id)?.deny.toArray(false).includes("SendMessages")) return message.reply({embeds: [alreadylock]})

        if(channel.permissionOverwrites.cache.get(role.id)) await channel.permissionOverwrites.edit(role.id, {SendMessages: false})
        else await channel.permissionOverwrites.create(role.id, {SendMessages: false})

        const lock = new EmbedBuilder()
            .setColor("#fc4e4e")
            .setTitle(`<:redlock:1197926789188702228> Le salon ${channel} a bien été Verrouillé.`)
            .setDescription(`<:barrierred:1197929516551634974> Rôle bloqué : ${role.name}`)
            .setTimestamp()
            .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });
        await message.reply({embeds: [lock]})

    }
}