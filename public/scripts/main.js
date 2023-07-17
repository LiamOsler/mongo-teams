const playerTable = document.getElementById('player-table');

async function updatePlayerTable () {
    playerTable.innerHTML = "";
    fetch('https://mongo-teams.liamo2.repl.co/players', {cache: "no-cache"})
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            for(let player of data) {
               const row = playerTable.insertRow(-1);
               const id = row.insertCell(0);
               const name = row.insertCell(1);
               const phone = row.insertCell(2);
               const preferences = row.insertCell(3);

                id.innerHTML = player._id;
                name.innerHTML = player.fname925 + " " + player.lname925;
                phone.innerHTML = player.phone925;
                preferences.innerHTML = player.preference925;
            }
    });
}

updatePlayerTable();




async function addPlayer(fname, lname, phone, preferences){
    let URLString = `https://mongo-teams.liamo2.repl.co/players?action=create&fname925=${fname}&lname925=${lname}&phone925=${phone}&preference925=${preferences}`;
    
    await fetch(URLString).
        then(function(response) {
            return response.json();
        }).then(function(data) {
            console.log(data);
        });

    updatePlayerTable();

}


const addPlayerForm = document.getElementById('add-player');

addPlayerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fname = document.getElementById('player-fname').value;
    const lname = document.getElementById('player-lname').value;
    const phone = document.getElementById('player-phone').value;
    const preferences = document.getElementById('player-preferences').value;

    addPlayer(fname, lname, phone, preferences)
});



async function updatePlayer(fname, lname, phone, preferences, id){
    let URLString = `https://mongo-teams.liamo2.repl.co/players?action=findByIdAndUpdate&fname925=${fname}&lname925=${lname}&phone925=${phone}&preference925=${preferences}&id=${id}`;

    await fetch(URLString).
        then(function(response) {
            return response.json();
        }).then(function(data) {
            console.log(data);
        });

    updatePlayerTable();
}


const updatePlayerForm = document.getElementById('update-player');

updatePlayerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const fname = document.getElementById('player-fname-update').value;
    const lname = document.getElementById('player-lname-update').value;
    const phone = document.getElementById('player-phone-update').value;
    const preferences = document.getElementById('player-preferences-update').value;
    const id = document.getElementById('player-id-update').value;

    updatePlayer(fname, lname, phone, preferences, id);
});



async function deletePlayer(id){
    let URLString = `https://mongo-teams.liamo2.repl.co/players?action=findByIdAndDelete&id=${id}`;

    await fetch(URLString).
        then(function(response) {
            return response.json();
        }).then(function(data) {
            console.log(data);
        });
        updatePlayerTable();

}


const deletePlayerForm = document.getElementById('delete-player');

deletePlayerForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const id = document.getElementById('player-id-delete').value;
    deletePlayer(id);
});

let teamResults = document.getElementById('team-results');

function updateTeamsTable(data) {
    teamResults.innerHTML = "";

    let totalScore = document.createElement('h2');
    totalScore.innerHTML = "Total Score: " + data.totalScore;
    teamResults.appendChild(totalScore);

    for(let team in data.teams) {
        let teamDiv = document.createElement('div');
        let teamName = document.createElement('h3');
        teamName.innerHTML = team;
        teamDiv.appendChild(teamName);

        for(let player of data.teams[team]) {
            let playerNameElement = document.createElement('p');
            playerNameElement.innerHTML = "Name: " + player.fname925 + " " + player.lname925;
            teamDiv.appendChild(playerNameElement);

            let playerPhoneElement = document.createElement('p');
            playerPhoneElement.innerHTML = "Phone: " + player.phone925;
            teamDiv.appendChild(playerPhoneElement);

            let preferencesElement = document.createElement('p');
            preferencesElement.innerHTML = "Preferences: " + player.preference925;
            teamDiv.appendChild(preferencesElement);

            let scoreElement = document.createElement('p');
            scoreElement.innerHTML = "Score: " + player.score;
            teamDiv.appendChild(scoreElement);

            teamDiv.appendChild(document.createElement('hr'));

        }

        teamResults.appendChild(teamDiv);

        console.log(data.teams[team]);
    }

}


async function getQuickTeams(){
    let URLString = `https://mongo-teams.liamo2.repl.co/teams/quick`;

    await fetch(URLString).
        then(function(response) {
            return response.json();
        }).then(function(data) {
            updateTeamsTable(data);
        });
}

const runQuick = document.getElementById('run-quick');

runQuick.addEventListener('click', function(e) {
    getQuickTeams();
});



async function getBruteTeams(){
    let URLString = `/teams/optimized`;
    console.log(URLString);

    teamResults.innerHTML = "Loading...";

    await fetch(URLString).
        then(function(response) {
            return response.json();
        }).then(function(data) {
            updateTeamsTable(data);
            // console.log(data);
        });
    }

const runBrute = document.getElementById('run-brute');

runBrute.addEventListener('click', function(e) {
    getBruteTeams();
});

