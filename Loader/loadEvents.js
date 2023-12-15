const fs = require("fs");

module.exports = async bot => {
    const files = fs.readdirSync("./Events").filter(f => f.endsWith(".js"));

    for (const file of files) {
        let event = require(`../Events/${file}`);
        bot.on(file.split(".js").join(""), event.bind(null, bot))
        console.log(`          >> ➕ Event ${file} loaded.`)
    }
};