const Discord = require("discord.js");
const {EmbedBuilder} = require("discord.js");

module.exports = {
    name: "setantispam",
    description: "Paramétrage de l'anti-spam.",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "<:admin:1257466365116289184>  • Administration :",
    options: [
        {
            type: "string",
            name: "état",
            description: "Etat de l'anti-spam (on ou off)",
            required: true,
            autocomplete: true,
        }
    ],

    async run(bot, message, args, db) {
        let etat = args.getString("état")
        if (etat !== "on" && etat !== "off") return message.reply("Merci d'indiquer \`ON\` ou \`OFF\` pour l'antispam.")

        if (etat === "off") {

            db.query(`UPDATE server SET antispam = 'false' WHERE guild = '${message.guildId}'`)
            const desac = new EmbedBuilder()
                .setColor("#fc4e4e")
                .setTitle(`<:bot:1257466368123732008>  L'anti-spam de \`${message.guild.name}\` a bien été **Désactivé**.`)
                .setDescription(`<:globe:1257703893266333786>  Etat actuel : \`${etat}\``)
                .setTimestamp()
                .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });
            await message.reply({embeds: [desac]})

        } else {

            db.query(`UPDATE server SET antispam = 'true' WHERE guild = '${message.guildId}'`)
            const activate = new EmbedBuilder()
                .setColor("#8efc6d")
                .setTitle(`<:bot:1257466368123732008>  L'anti-spam de \`${message.guild.name}\` a bien été **Activé**.`)
                .setDescription(`<:globe:1257703893266333786>  Etat actuel : \`${etat}\``)
                .setTimestamp()
                .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });

            await message.reply({embeds:[activate]})

        }
    }
}
