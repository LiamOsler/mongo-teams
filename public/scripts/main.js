
let playerList = document.createElement('ul');
playerList.id = 'playerList';


let main = document.getElementsByTagName('main')[0];

main.appendChild(playerList);

let playerArray;

function fetchPlayers () {
    fetch('http://localhost:3000/players')
        .then(function(response) {
        // The response is a Response instance.
        // You parse the data into a useable format using `.json()`
            return response.json();
        }).then(function(data) {
        // `data` is the parsed version of the JSON returned from the above endpoint.
            console.log(data);  // { "userId": 1, "id": 1, "title": "...", "body": "..." }
            
            for(let item of data) {
                let playerItem = document.createElement('li');
                playerItem.textContent = item.fname925 + ' ' + item.lname925;
                playerList.appendChild(playerItem);
            }
    });
}

fetchPlayers();

let game = document.createElement('div');
game.id = 'game';
