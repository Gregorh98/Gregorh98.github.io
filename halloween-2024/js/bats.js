function create_bats(number) {
    let snowflakes_container = document.getElementById("snowflakes");
    for (let i = 1; i <= number; i++) {
        let bat_id = "bat" + i;
        snowflakes_container.innerHTML += `
            <div class="snowflake">
                <img src="assets/bat.gif" class="bat" id="${bat_id}" alt="Flying Bat" onclick="delete_bat('${bat_id}')">
            </div>`;
    }
}

function delete_bat(id) {
    let audio = new Audio('assets/bat_splat.wav');
    audio.play();
    document.getElementById(id).hidden = true
}