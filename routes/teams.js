var express = require('express');
var router = express.Router();

var Players = require('../models/Players');



// 1. Teams will have an equal number of players,
// 2. Players will be sorted by their preference
// 3. If the number of players is not divisible by the number of teams, the remaining players will not be added to a team
// 4. The score of the sorting will be determined by the players preference
// 5. Players assigned to their first preference will have a score of 5
// 6. Players assigned to their second preference will have a score of 4
// 7. Players assigned to their third preference will have a score of 3
function sortPlayers(players) {

    //Find the unique teams:
    let teams = [];
    
    for(let player of players) {
        if(!teams.includes(player.team925)) {
            teams.push(player.team925);
        }
    }

    console.log(teams);



    // console.log(players)


    //Assign teams to players

    

}

/* GET home page. */
//Description:
// This route will sort the players into teams
// THh route accepts a list of player ids, and  retrieves them from the database. If no list is provided, all players will be retrieved and sorted

router.get('/', async function(req, res, next) {
    //If a list of players in the game is not provided:
    if(req.query.action === undefined ) {
        await Players.find()
            .then((docs) => {
                sortPlayers(docs);
                res.send(docs);
            })
            .catch((err) => {
                console.error(err);
                res.send(err);
            }
        );
    }
});

module.exports = router;
