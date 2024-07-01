const Discord = require("discord.js")
const {EmbedBuilder} = require("discord.js");

module.exports = {
    name: "setstatus",
    description : "Permet de modifier le status de l'application.",
    permission: Discord.PermissionFlagsBits.Administrator,
    dm: true,
    category: "<:admin:1257466365116289184>  • Administration :",
    options: [
        {
            type:"string",
            name:"activité",
            description: "Activité de l'application.",
            required: true,
            autocomplete: true
        }, {
            type:"string",
            name:"status",
            description: "Status de l'application.",
            required: true,
            autocomplete: false
        }, {
            type:"string",
            name:"lien",
            description: "URL Twitch du stream.",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args, db) {

        let activity = args.getString("activité")
        if(activity !== "Listening" && activity !== "Playing" && activity !== "Competiting" && activity !== "Watching" && activity !== "Streaming") return message.reply("Merci de suivre l'autocomplete")

        let status = args.getString("status")
        if(activity === "Streaming" && args.getString("lien") === null) return message.reply("Merci d\'indiquer une URL")
        if(activity === "Streaming" && !args.getString("lien").match(new RegExp(/^(?:https?:\/\/)?(?:www\.|go\.)?twitch\.tv\/([a-z0-9_]+)($|\?)/))) return message.reply("Merci d\'indiquer une URL Twitch")

        if(activity ==="Streaming") await bot.user.setActivity(status,{type : Discord.ActivityType[activity], url: args.getString("lien")})
        else await bot.user.setActivity(status, {type: Discord.ActivityType[activity], url: args.getString("lien")})
        const changestatus = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`<:changed:1257466369927155832>  Status Modifié`)
            .addFields({ name: '‎', value: `\`\`\`md\n# Type d\'activité #\n${activity}\`\`\``, inline: true })
            .addFields({ name: '‎', value: `\`\`\`md\n# Status #\n ${status}\`\`\``, inline: true })

            .setTimestamp()
            .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });
        await message.reply({embeds:[changestatus], ephemeral: true})
    }
}