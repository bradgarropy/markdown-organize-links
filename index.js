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

const writeReferences = (markdown, links) => {
    let modifiedMarkdown = markdown + "\n\n"

    links.forEach((link, index) => {
        index = index + 1
        const {url} = link.groups
        const string = `[${index}]: ${url}`
        modifiedMarkdown = modifiedMarkdown + string + "\n"
    })

    modifiedMarkdown = modifiedMarkdown + "\n"
    return modifiedMarkdown
}

const replaceLinks = (markdown, links) => {
    let modifiedMarkdown = markdown

    links.forEach((link, index) => {
        const {url} = link.groups
        console.log(modifiedMarkdown)
        console.log(index + 1)
        modifiedMarkdown = modifiedMarkdown.replace(
            `(${url})`,
            `[${index + 1}]`,
        )
    })

    console.log("-------------------------------")
    console.log(modifiedMarkdown)

    return modifiedMarkdown
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

    // write references to bottom
    let modifiedMarkdown = writeReferences(markdown, links)

    // modify inline links
    modifiedMarkdown = replaceLinks(modifiedMarkdown, links)

    // write to file
    fs.writeFileSync(absolutePath, modifiedMarkdown)

    return
}

main()
