const cmdr = require("commander")

const parse = () => {
    cmdr.arguments("<path>", "Markdown file path.")
    const args = cmdr.parse(process.argv)

    return args
}

module.exports = {
    parse,
}
