const Discord = require('discord.js');

module.exports = {
    name: "reboot",
    description: "Redémarrage forcé de l\'application.",
    permission: Discord.PermissionFlagsBits.Administrator,
    dm: false,
    category: "<:admin:1257466365116289184>  • Administration :",
    options: [],

    async run(bot, message, args) {
        if (!message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            return message.reply("Vous n'avez pas la permission d'utiliser cette commande.");
        }
        await message.reply("<:admin:1257466365116289184>  Le bot est en cours de redémarrage...");
        console.log(`Redémarrage demandé par : ${message.user.tag}`);
        process.exit(0);
    }
};
