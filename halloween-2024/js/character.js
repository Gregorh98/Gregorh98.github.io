function playMusic() {
    let audio = new Audio('assets/music.mp3');
    audio.play();
}


function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function generate_character_info() {
    let character = getQueryParam("character")

    let characters = {
        "headless_horseman": {
            "name": "Headless Horseman",
            "desc": "You are a cursed soldier forever searching for your lost head. Clad in a tattered high-collared cape, you ride through the night, brandishing a sword and creating an aura of terror wherever you go.",
            "costume": "You might consider wearing a black cape with a high collar, dark pants, and boots. Carrying a toy sword and perhaps a pumpkin or skull prop could represent your missing head."
        },
        "ogre_princess": {
            "name": "Ogre Princess",
            "desc": "As a formidable giantess, you rule your domain with a fierce presence. With a booming voice and an even louder laugh, you’re both terrifying and endearing, especially to your mate.",
            "costume": "You could opt for a colorful, tattered gown made from inexpensive fabric. Adding oversized costume jewelry and using face paint for green skin might enhance your look."
        },
        "bigfoot": {
            "name": "Bigfoot",
            "desc": "You are a mysterious, elusive creature that roams the forests. Known for your enormous size and gentle nature, you leave a trail of broken branches and large footprints behind you.",
            "costume": "You might wear a full-body furry suit or a brown hoodie and pants with faux fur accents. Oversized slippers for feet and a simple mask or face paint could help mimic Bigfoot's features."
        },
        "werewolf": {
            "name": "Werewolf",
            "desc": "You are a creature of the night, torn between human and beast. As you howl at the moon, your razor-sharp claws and insatiable hunger reveal the horror within.",
            "costume": "Dressing in torn clothing or a flannel shirt with ripped jeans could work well. Adding faux fur gloves and a wolf mask or makeup might create an animalistic look that’s both scary and fun."
        },
        "frankenstein": {
            "name": "Frankenstein's Monster",
            "desc": "You are an amalgamation of body parts, brought to life through unnatural means. Despite your intimidating appearance, you yearn for acceptance in a world that fears you.",
            "costume": "You could wear a dark oversized jacket and pants, and add green face paint with stitches drawn on. Using faux bolts on your neck and messy hair might help capture the classic look."
        },
        "lady_dracula": {
            "name": "Lady Dracula",
            "desc": "You are a seductive and powerful vampiress, exuding an air of elegance and mystery. With a penchant for the dramatic, you charm your way into hearts and then turn them into your next meal.",
            "costume": "You might wear a long, flowing black or red gown with a high collar. Adding a cape, dramatic makeup with dark lipstick, and fangs would complete your look."
        },
        "swamp_thingy": {
            "name": "Swamp Thingy",
            "desc": "You are a creature of the marsh, emerging from the depths of the swamp. Covered in mud and vines, you embody the untamed wild, blending in with nature while watching over your territory.",
            "costume": "You could wear a green bodysuit or clothing covered with leaves and fake vines. Using face paint to mimic swamp elements and adding moss or fake plants would enhance your look."
        }
    };


    let char = characters[character]

    document.getElementById("character_name").innerText = char["name"]
    document.getElementById("character_desc").innerText = char["desc"]
    document.getElementById("costume_desc").innerText = char["costume"]

}