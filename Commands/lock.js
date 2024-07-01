const Discord = require("discord.js")
const {EmbedBuilder} = require("discord.js");

module.exports = {
    name: "lock",
    description: "Permet de verouiller un salon.",
    permission: Discord.PermissionFlagsBits.Administrator,
    dm: false,
    category:"<:outils:1257469842404151337>  •  Outils :",
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
            .setTitle(`<:lock:1257466377711910972>  Le salon ${channel} est déjà Verrouillé.`)
            .setDescription(`<:users:1257468292000514130>  Rôle bloqué : ${role.name}`)
            .setTimestamp()
            .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });


        if(channel.permissionOverwrites.cache.get(role.id)?.deny.toArray(false).includes("SendMessages")) return message.reply({embeds: [alreadylock]})

        if(channel.permissionOverwrites.cache.get(role.id)) await channel.permissionOverwrites.edit(role.id, {SendMessages: false})
        else await channel.permissionOverwrites.create(role.id, {SendMessages: false})

        const lock = new EmbedBuilder()
            .setColor("#fc4e4e")
            .setTitle(`<:lock:1257466377711910972>  Le salon ${channel} a bien été Verrouillé.`)
            .setDescription(`<:users:1257468292000514130>  Rôle bloqué : ${role.name}`)
            .setTimestamp()
            .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });
        await message.reply({embeds: [lock]})

    }
}