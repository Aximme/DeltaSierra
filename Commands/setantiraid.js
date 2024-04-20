const Discord = require("discord.js");

module.exports = {
    name:"setantiraid",
    description: "Paramétrages de l'antiraid.",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "\\🛡️ •  Administration :",
    options:[
        {
            type:"string",
            name:"état",
            description:"Etat de l'antiraid (on ou off)",
            required:true,
            autocomplete:true,
        }
    ],

    async run(bot, message, args, db) {
        let etat = args.getString("état")
        if(etat !== "on" && etat !== "off") return message.reply("Merci d'indiquer \`ON\` ou \`OFF\` pour l'antiraid.")

        if(etat === "off") {

            db.query(`UPDATE server SET antiraid = 'false' WHERE guild = '${message.guildId}'`)
            await message.reply(`L'antiraid est bien desactivé, etat : \`${etat}\`.`)

        } else {

            db.query(`UPDATE server SET antiraid = 'true' WHERE guild = '${message.guildId}'`)
            await message.reply(`L'antiraid est bien activé, etat : \`${etat}\`.`)

        }
    }
}//https://www.youtube.com/watch?v=n-XUMcaOWvg&t=209s