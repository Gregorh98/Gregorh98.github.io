function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function generate_character_info() {
    let character = getQueryParam("character")

    let characters = {
        "headless_horseman": {
            "name": "Headless Horseman",
            "desc": "A cursed soldier forever searching for his lost head. Clad in a tattered high-collared cape, he rides through the night on a ghostly steed, brandishing a sword with terrifying determination.",
            "costume": "Flowing high-collared cape, dark armor, a sword, and a pumpkin or skull to represent his missing head."
        },
        "ogre_princess": {
            "name": "Ogre Princess",
            "desc": "A formidable giantess with a heart of gold for her mate, she rules her domain with a fearsome presence. With a booming voice and an even louder laugh, she’s both terrifying and endearing.",
            "costume": "Royal gown made of rugged materials, oversized jewelry, and makeup that features exaggerated facial features, like bright green skin and wild hair."
        },
        "bigfoot": {
            "name": "Bigfoot",
            "desc": "A mysterious, elusive creature that roams the forests, known for its enormous size and gentle nature. Its presence is often marked by a trail of broken branches and large footprints.",
            "costume": "A full-body furry suit with realistic detailing, oversized feet, and a mask with expressive eyes to showcase its playful personality."
        },
        "werewolf": {
            "name": "Werewolf",
            "desc": "A creature of the night, torn between human and beast, the werewolf howls at the moon. With razor-sharp claws and an insatiable hunger, they embody both horror and intrigue.",
            "costume": "Tattered clothing, faux fur accents, a wolf mask with fangs, and makeup to create a fierce, animalistic look."
        },
        "frankenstein": {
            "name": "Frankenstein's Monster",
            "desc": "An amalgamation of body parts, brought to life through unnatural means. This misunderstood creature yearns for acceptance in a world that fears him.",
            "costume": "Patchwork clothing made from various fabrics, bolts on the neck, green skin makeup, and messy hair for an unsettling yet tragic appearance."
        }
    };


    let char = characters[character]

    document.getElementById("character_name").innerText = char["name"]
    document.getElementById("character_desc").innerText = char["desc"]
    document.getElementById("costume_desc").innerText = char["costume"]

}