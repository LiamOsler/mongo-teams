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
function assignTeamsFast(players) {
    //Find the unique team names:
    let teams = {};

    for(let player of players) {
        for(let preference of player.preference925) {
            if(teams[preference] === undefined) {
                teams[preference] = [];
            }
        }
    }


    let playersPerTeam = Math.floor(players.length / Object.keys(teams).length);

    
    
    //Add the players to the teams:
    for(let player of players) {
        if(teams[player.preference925[0]].length < playersPerTeam) {
            teams[player.preference925[0]].push(player);
        }
        else if(teams[player.preference925[1]].length < playersPerTeam) {
            teams[player.preference925[1]].push(player);
        }
        else if(teams[player.preference925[2]].length < playersPerTeam) {
            teams[player.preference925[2]].push(player);
        }
    }

    //Calculate the score of the teams:
    let totalScore = 0;
    for(let team in teams) {
        let score = 0;
        for(let player of teams[team]) {
            if(player.preference925[0] === team) {
                totalScore += 5;
                player.score = 5;
            }
            else if(player.preference925[1] === team) {
                totalScore += 4;
            }
            else if(player.preference925[2] === team) {
                totalScore += 3;
            }
        }
    }
    return {teams: teams, totalScore: totalScore};
}

function permuteArray(array) {
    let permutations = [];
    for(let i = 0; i < array.length; i++) {
        let temp = array[i];
        array[i] = array[0];
        array[0] = temp;
        permutations.push(array.slice());
    }
    return permutations;
}


function assignTeamsOptimized(players) {
    //Find the unique team names:
    let teams = {};

    for(let player of players) {
        for(let preference of player.preference925) {
            if(teams[preference] === undefined) {
                teams[preference] = [];
            }
        }
    }

    let playersPerTeam = Math.floor(players.length / Object.keys(teams).length);


    //Create every permutation of the players:
    let permutations = permuteArray(players);
    // console.log(permutations.length);

    let teamsPermutations = [];

    for(let permutation of permutations) {
        let permutationTeams = {};
        for(let player of permutation) {
            if(permutationTeams[player.preference925[0]].length < playersPerTeam) {
                permutationTeams[player.preference925[0]].push(player);
            }
            else if(teams[player.preference925[1]].length < playersPerTeam) {
                permutationTeams[player.preference925[1]].push(player);
            }
            else if(teams[player.preference925[2]].length < playersPerTeam) {
                permutationTeams[player.preference925[2]].push(player);
            }
        }
    
        //Calculate the score of the teams:
        let totalScore = 0;
        for(let team in permutationTeams) {
            let score = 0;
            for(let player of teams[team]) {
                if(player.preference925[0] === team) {
                    totalScore += 5;
                    player.score = 5;
                }
                else if(player.preference925[1] === team) {
                    totalScore += 4;
                }
                else if(player.preference925[2] === team) {
                    totalScore += 3;
                }
            }
        }
           
    }


    console.log(teams);
}

/* GET home page. */
//Description:
// This route will sort the players into teams
router.get('/', async function(req, res, next) {
    //If a list of players in the game is not provided:
    if(req.query.action === undefined ) {
        await Players.find()
            .then((docs) => {
                let teamsFast = assignTeamsFast(docs);
                let teamsOptimized = assignTeamsOptimized(docs);
                res.send(teamsFast);
            })
            .catch((err) => {
                console.error(err);
                res.send(err);
            }
        );
    }
});

module.exports = router;
