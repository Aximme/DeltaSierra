const Discord = require("discord.js")
const {EmbedBuilder} = require("discord.js");

module.exports = {
    name: "unlock",
    description: "Permet de devérouiller un salon.",
    permission: Discord.PermissionFlagsBits.Administrator,
    dm: false,
    category:"<:outils:1257469842404151337>  •  Outils :",
    options: [
        {
            type:"channel",
            name:"salon",
            description:"Le salon a déverouiller",
            required: true,
            autocomplete: false,
        }, {
            type:"role",
            name:"role",
            description:"Le role a unlock dans ce salon.",
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


        const alreadyunlock = new EmbedBuilder()
            .setColor("#fca04e")
            .setTitle(`<:unlock:1257466400977588286>  Le salon ${channel} est déjà Déverrouillé.`)
            .setDescription(`<:users:1257468292000514130>  Rôle Déverrouillé : ${role.name}`)
            .setTimestamp()
            .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });


        if(channel.permissionOverwrites.cache.get(role.id)?.allow.toArray(false).includes("SendMessages")) return message.reply({embeds:[alreadyunlock]})

        if(channel.permissionOverwrites.cache.get(role.id)) await channel.permissionOverwrites.edit(role.id, {SendMessages: true})
        else await channel.permissionOverwrites.create(role.id, {SendMessages: true})

        const unlock = new EmbedBuilder()
            .setColor("#8efc6d")
            .setTitle(`<:unlock:1257466400977588286>  Le salon ${channel} a bien été Déverrouillé.`)
            .setDescription(`<:users:1257468292000514130>  Rôle Déverrouillé : ${role.name}`)
            .setTimestamp()
            .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });

        await message.reply({embeds:[unlock]})

    }
}