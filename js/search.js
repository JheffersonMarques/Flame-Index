let _GLOBAL;

window.addEventListener("load", () => {
    _GLOBAL = {
        offset: 0,
        gap: 10,
        max: 0,
    }
});

let icons = {
    "/api/spells": "./imgs/icon/sparkles.svg"
}

async function search() {
    let text = document.getElementById("search-data");
    let content = document.getElementById("results");
    content.setAttribute("class", "")
    
    const promises = await APISearchAllEndpoints(text.value);
    
    let data = []
    
    for (const idx in promises) {
        const element = promises[idx];
        const temp = await element.value;
        
        for (const result of temp.results) {
            data.push({
                from: temp.from,
                result: result
            })
        }
        
    }
    
    _GLOBAL.offset = 0;
    
    _GLOBAL.data = data.sort((a, b) => ('' + a.result.name).localeCompare(b.result.name));
    _GLOBAL.max = data.length;
    
    document.getElementById("value").innerText = `${parseInt(_GLOBAL.offset / _GLOBAL.gap)} out of ${parseInt(_GLOBAL.max / _GLOBAL.gap)}`
    update(content, data.slice(_GLOBAL.offset, _GLOBAL.offset + _GLOBAL.gap));
    content.setAttribute("class", "loaded")
}

function changeOffsetAndUpdate(incr) {
    let content = document.getElementById("results");
    content.setAttribute("class", "")
    
    let offset = _GLOBAL.offset;

    if (incr && _GLOBAL.offset + _GLOBAL.gap < _GLOBAL.max) {
        _GLOBAL.offset += _GLOBAL.gap
    } else if (!incr && _GLOBAL.offset - _GLOBAL.gap >= 0) {
        _GLOBAL.offset -= _GLOBAL.gap
    }

    document.getElementById("value").innerText = `${parseInt(_GLOBAL.offset / _GLOBAL.gap)} out of ${parseInt(_GLOBAL.max / _GLOBAL.gap)}`

    update(content, _GLOBAL.data.slice(_GLOBAL.offset, _GLOBAL.offset + _GLOBAL.gap));

    document.getElementById('value').scrollIntoView();
    if(offset != _GLOBAL.offset)
        content.setAttribute("class", "loaded")
}



function update(content, data) {

    content.innerHTML = "";
    
    data.forEach(elem => {
        content.innerHTML += `<div class="result-block">
            <a class="block-link" href="result/?item=${elem.from + "/" + elem.result.index}&kind=${elem.from.replace("/api/", "")}">
                <div class="result-block-content">
                    <div class="result-icon">
                        <img src="${icons[elem.from]}">
                    </div>
                    <div>
                        <h3>${elem.result.name}</h3>
                        <span>${elem.result.index}</span>
                    </div>
                </div>
            </a>
        </div>`
    });
}
