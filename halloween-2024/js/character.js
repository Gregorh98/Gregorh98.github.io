function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function generate_character_info() {
    let character = getQueryParam("character")

    let characters = {
        "headless_horseman": {
            "name": "Headless Horseman",
            "desc": "Decapitated soldier who carries a sword and chases travelers.",
            "costume": "High-collared cape to hide head, carries a sword and maybe his own head"
        },
        "ogre_princess": {
            "name": "Ogre Princess",
            "desc": "",
            "costume": ""
        },
        "bigfoot": {
            "name": "Bigfoot",
            "desc": "",
            "costume": ""
        },
        "woolly_werewolf": {
            "name": "Woolly Werewolf",
            "desc": "",
            "costume": ""
        },
        "frankenstein": {
            "name": "Frankenstein",
            "desc": "",
            "costume": ""
        }
    }

    let char = characters[character]

    document.getElementById("character_name").innerText = char["name"]
    document.getElementById("character_desc").innerText = char["desc"]
    document.getElementById("costume_desc").innerText = char["costume"]

}