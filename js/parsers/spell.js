let toPropertiesTable = {
    ritual: makeTableMapper("Ritual", "boolean"),
    concentration: makeTableMapper("Concentration", "boolean"),
    duration: makeTableMapper("Duration", "string"),
    casting_time: makeTableMapper("Casting Time", "string"),
    attack_type: makeTableMapper("Attack Type", "string"),
    material: makeTableMapper("Material", "string"),
    classes: makeTableMapper("Classes", "indexed_object"),
    subclasses: makeTableMapper("Sub classes", "indexed_object"),
    dc: makeTableMapper("Difficulty Class", "dc"),
    area_of_effect: makeTableMapper("Area of Effect", "aoe"),
}

let toDamageOrHealingTable = {
    damage: makeTableMapper("Damage at level", "damage"),
    damage_at_slot_level: makeTableMapper("", "at_slot"),
    heal_at_slot_level: makeTableMapper("Heal at level", "at_slot")
}

let formatters = {
    boolean: (value) => value ? "Yes" : "No",
    string: (value) => value,
    indexed_object: (value) => value.map((obj) => obj.name).join(", "),
    damage: (value) => value.damage_type.name,
    dc: (value) => value.dc_success + " of " + value.dc_type.name + " value",
    aoe: (value) => value.type + " of " + value.size + "ft",
    at_slot: (value) => {
        let final = ""
        let keys = Object.keys(value);
        for (let i = 0; i < keys.length; i++) {
            final += `<tr>
                <td class="properties-table-row">${keys[i]}</td>
                <td class="properties-table-row">${value[keys[i]]}</td>
            </tr>`;
        }
        return final;
    }
}

/**
 * 
 * @param {String} name 
 * @param {String} kind 
 * @returns {Object}
 */
function makeTableMapper(name, kind) {
    return {
        name: name,
        kind: kind
    }
}



function buildSpell(data, target) {
    document.getElementsByTagName("head")[0].innerHTML += `<link rel="stylesheet" href="../css/spells.css">`
    
    let page = target.innerHTML;

    page += `<a class="return" href="/">
                <img src="../imgs/return.svg"/>
            </a>`

    page += `<div class="spell-name">
        <h1>${data.name}</h1>
    </div>`;

    // Build spell school
    let spellType = data.level == 0 ? "Cantrip" : data.level + "° level"
    page += `<span class="spell-school">${spellType} of ${data.school.index}</span>`;

    // Build spell description
    page += `<div class="spell-desc"> <h2 class="spell-desc-title">Description</h2><div>`

    let table = ""
    data.desc.forEach(element => {
        if (element.includes("|")) {
            table += element + "\n"
        } else if (table != "") {
            page += `<div class="spell-desc-content spell-desc-content-table">${marked.parse(table)}</div>`
            table = ""
        } else {
            page += `<p class="spell-desc-content">${marked.parse(element)}</p>`
        }

    });



    page += `</div> </div>`;

    // Build spell at higher levels
    if (data.higher_level != undefined && data.higher_level.length > 0) {
        page += `<div class="spell-desc"> <h2 class="spell-desc-title">At Higher Levels</h2><div>`
        data.higher_level.forEach(element => {
            page += `<p class="spell-desc-content">${element}</p>`
        });
        page += `</div> </div>`;
    }

    //Components
    if (data.components != undefined && data.components.length > 0) {
        page += `<h2  class="components-section">Components</h2>`;
        page += `<div class="components-container">`
        data.components.forEach(element => {
            page += `<span class="component">${element}</span>`;
        })
        page += `</div>`;
    }


    page += `<div class="table">`
    page += `<table class="properties-table">
        <tr>
            <th class="properties-table-header">Properties</th>
            <th class="properties-table-header">Values</th>
        </tr>`;

    let mapperKeys = Object.keys(toPropertiesTable);
    for (let i = 0; i < mapperKeys.length; i++) {
        const element = mapperKeys[i];
        const content = data[element];

        if (content != undefined) {
            const mapper = toPropertiesTable[element];
            if (!Array.isArray(content) || (Array.isArray(content) && content.length != 0)) {
                page += `<tr>
                    <td class="properties-table-row">${mapper.name}</td>
                    <td class="properties-table-row">${formatters[mapper.kind](content)}</td>
                </tr>`
            }
        }
    }
    page += `</table> </div>`


    mapperKeys = Object.keys(toDamageOrHealingTable);
    for (let i = 0; i < mapperKeys.length; i++) {
        const element = mapperKeys[i];
        const content = data[element];

        if (content != undefined) {
            const mapper = toDamageOrHealingTable[element];
            page += `<div class="table">`
            page += `<table class="properties-table">
            <tr>
                <th class="properties-table-header">${mapper.name}</th>
                <th class="properties-table-header">${mapper.kind == "damage" ? formatters[mapper.kind](content) : ""}</th>
            </tr>`;

            if (!Array.isArray(content) || (Array.isArray(content) && content.length != 0)) {
                if (mapper.kind == "damage") {
                    if (content.damage_at_slot_level != undefined) {
                        page += formatters.at_slot(content.damage_at_slot_level)
                    }
                    else if (content.damage_at_character_level != undefined) {
                        page += formatters.at_slot(content.damage_at_character_level)
                    }
                } else {
                    page += formatters.at_slot(content)
                }
            }


        }
    }
    page += `</table> </div>`

    target.innerHTML = page;
}