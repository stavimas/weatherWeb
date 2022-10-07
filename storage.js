export function saveCurrentCity(name) {
    return localStorage.setItem('current', name);
}

export function getCurrentCity() {
    return localStorage.getItem('current');
}

export function saveFavouriteCities(cities) {
    cities.forEach((city, idx) => {
        localStorage.setItem(`city-${idx}`, JSON.stringify(city));
    })
}

export function getFavouriteCities() {
    let list = [];
    for (let key in localStorage) {
        if (!localStorage.hasOwnProperty(key) || key === 'current') { continue; }
        list.push(JSON.parse(localStorage.getItem(key)));
    }
    return list;
}

export function deleteCity(name) {
    for (let key in localStorage) {
        if (!localStorage.hasOwnProperty(key) || key === 'current') { continue; }
        const city = localStorage.getItem(key);
        const obj = JSON.parse(city);
        if (obj === name) { localStorage.removeItem(key); }
    }
    console.log(localStorage);
}