const cli = require("./cli")
const path = require("path")
const fs = require("fs")

const matchAll = (string, regex) => {
    let matches = []
    let match

    do {
        match = regex.exec(string)
        match && matches.push(match)
    } while (match)

    return matches
}

const findLinks = markdown => {
    const regex = new RegExp(/\[(?<text>.*?)\]\((?<url>.*?)\)/g)
    const links = matchAll(markdown, regex)
    return links
}

const createReferences = links => {
    const references = links.map((link, index) => {
        index = index + 1
        const {url} = link.groups
        const reference = `[${index}]: ${url}`

        return reference
    })

    return references
}

const main = () => {
    // parse cli
    const {args} = cli.parse()
    const filePath = args[0]

    // read file in
    const absolutePath = path.resolve(filePath)
    const markdown = fs.readFileSync(absolutePath).toString()

    // find all links
    const links = findLinks(markdown)

    // create references
    const references = createReferences(links)
    const referencesString = "\n\n" + references.join("\n") + "\n"

    // write references to bottom
    fs.appendFileSync(absolutePath, referencesString)

    // modify inline links

    return
}

main()
