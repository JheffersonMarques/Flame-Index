let base = "https://www.dnd5eapi.co";

let endpoints = {
    "/api/spells": "spell"
}


async function APISearch(endpoint, searchParam) {
    let fetchResult = await fetch(`${base}${endpoint}?name=${searchParam}`)
        .then((text) => {
            return text.json()
        })

    return fetchResult;
}

function APISearchAllEndpoints(searchParam) {
    let tasks = [];
    Object.keys(endpoints).forEach(async element => {
        tasks.push(
            fetch(`${base}${element}?name=${searchParam}`)
                .then((text) => {
                    return text.json()
                }).then(json => {
                    return {
                        from: element,
                        results: json.results
                    };
                })
        )
    });
    return Promise.allSettled(tasks);
}

async function APIFetchContent(endpoint, name) {
    let fetchResult = await fetch(`${base}${endpoint}/${name}`)
        .then((text) => {
            return text.json()
        })

    return fetchResult;
}

async function APIFetchContent(endpoint) {
    let fetchResult = await fetch(`${base}${endpoint}`)
        .then((text) => {
            return text.json()
        })

    return fetchResult;
}