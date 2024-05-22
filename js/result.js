const handlers = {
    "spells": buildSpell,
}

const names = {
    spells: "Spell"
}

const toRemove = [
    "/api/spells/"
]

/**
 * 
 * @param {String} string 
 * @returns {String}
 */
function indexToName(string){
    return string.split("-").map(e => e[0].toUpperCase() + e.substring(1,e.length)).join(" ");
}

async function handlePageData() {
    const searchParams = new URLSearchParams(window.location.search);

    let item = searchParams.get('item');
    let kind = searchParams.get('kind');

    var data = await APIFetchContent(item);

    var elem = document.getElementById("result-container");

    var name = indexToName(item.replace(toRemove.filter((str) => str.search(item))[0], ""));
    var type = names[kind];
    document.getElementsByTagName("title")[0].innerHTML = `${type}: ${name} - Flame Index`

    handlers[kind](data,elem);
    elem.setAttribute("class", "loaded")
}
