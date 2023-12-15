const fs = require("fs");

module.exports = async bot => {
    const files = fs.readdirSync("./Commands").filter(f => f.endsWith(".js"));

    for (const file of files) {
        let command = require(`../Commands/${file}`);
        if (!command.name || typeof command.name !== "string") {
            throw new TypeError(`⚠️ La commande ${file.slice(0, file.length - 3)} n'a pas de nom.`);
        }
        await bot.commands.set(command.name, command);
        console.log(`          > 🔗Command ${file} loaded.`);
    }
};
