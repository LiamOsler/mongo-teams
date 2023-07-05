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
function assignTeamsQuick(players) {
    //Set a score of 0 to each player:
    for(let player of players) {
        player.score = 0;
    }

    //Find the unique team names:
    let teams = {};
    for(let player of players) {
        for(let preference of player.preference925) {
            if(teams[preference] === undefined) {
                teams[preference] = [];
            }
        }
    }

    //Find the number of players per team:
    let playersPerTeam = Math.floor(players.length / Object.keys(teams).length);

    let totalScore = 0;

    //Assign players to their first preference, adding the appropriate score to the object representing the player:
    for(let i = 0; i < players.length; i++) {
        if(teams[players[i].preference925[0]].length < playersPerTeam) {
            totalScore += 5;
            players[i].score = 5;
            teams[players[i].preference925[0]].push(players[i]);
        }
        else if(teams[players[i].preference925[1]].length < playersPerTeam) {
            totalScore += 4;
            players[i].score = 4;
            teams[players[i].preference925[1]].push(players[i]);
        }
        else if(teams[players[i].preference925[2]].length < playersPerTeam) {
            totalScore += 3;
            players[i].score = 3;
            teams[players[i].preference925[2]].push(players[i]);
        }
    }

    return {teams: teams, totalScore: totalScore};
}

function assignTeamsNoPreference(players) {
    //Set a score of 0 to each player:
    for(let player of players) {
        player.score = 0;
    }

    //Find the unique team names:
    let teams = {};
    for(let player of players) {
        for(let preference of player.preference925) {
            if(teams[preference] === undefined) {
                teams[preference] = [];
            }
        }
    }

    //Find the number of players per team:
    let playersPerTeam = Math.floor(players.length / Object.keys(teams).length);

    let totalScore = 0;

    for(let i = 0; i < players.length; i++) {
        for(let key in teams) {
            if(teams[key].length < playersPerTeam) {
                if(players[i].preference925[0] === key) {
                    totalScore += 5;
                    players[i].score = 5;
                }
                else if(players[i].preference925[1] === key) {
                    totalScore += 4;
                    players[i].score = 4;
                }
                else if(players[i].preference925[2] === key) {
                    totalScore += 3;
                    players[i].score = 3;
                }
                teams[key].push(players[i]);
                break;
            }
        }
    }

    return {teams: teams, totalScore: totalScore};
}
        

//Generate all the combinations with the same cardinality as the number of players:
function permutePlayers(players) {
    var results = [];
  
    //Recursively generate all the permutations:
    function permute(arr, previousArray) {
      var currentArray
      var previousArray = previousArray || [];
  
      for (var i = 0; i < arr.length; i++) {
        currentArray = arr.splice(i, 1);
        if (arr.length === 0) {
          results.push(previousArray.concat(currentArray));
        }
        permute(arr.slice(), previousArray.concat(currentArray));
        arr.splice(i, 0, currentArray[0]);
      }
  
      return results;
    }
  
    return permute(players);
  }


//Generate all permutations of the players, then run the quick algorithm on each permutation to calculate its score:
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

    //Get each possible permutation of the players:
    let playerPermutations = permutePlayers(players);

    //Create an array to store each possible permutation of the player arrangement:
    let teamPermutations = [];

    //For each permutation of the players, run the quick algorithm to calculate the score and push it to the array:
    for(let permutation of playerPermutations) {
        let result = assignTeamsNoPreference(permutation);
        teamPermutations.push(result);
    }

    console.log(teamPermutations);
    
    let largestScore = 0;
    let largestScoreIndex = 0;

    //Find the permutation with the highest score:
    for(let i = 0; i < teamPermutations.length; i++) {
        if(teamPermutations[i].totalScore > largestScore) {
            largestScore = teamPermutations[i].totalScore;
            largestScoreIndex = i;
        }
    }
    //Return the first item in the array, which will be the permutation with the highest score:
    return teamPermutations[largestScoreIndex];

}

//Description:
// This route will sort the players into teams, in order, according to their indicated preference:
router.get('/', async function(req, res, next) {
    //If a list of players in the game is not provided:
    if(req.query.action === undefined ) {
        await Players.find()
            .then((docs) => {
                let teamsQuick = assignTeamsQuick(docs);
                res.send(teamsQuick);
            })
            .catch((err) => {
                console.error(err);
                res.send(err);
            }
        );
    }
});

//Description:
// This route will sort the players into teams, in order, according to their indicated preference:
router.get('/quick', async function(req, res, next) {
    //If a list of players in the game is not provided:
    if(req.query.action === undefined ) {
        await Players.find()
            .then((docs) => {
                let teamsQuick = assignTeamsQuick(docs);
                res.send(teamsQuick);
            })
            .catch((err) => {
                console.error(err);
                res.send(err);
            }
        );
    }
});

//Description:
// This route will sort the players into teams, trying to optimize for the highest score:
router.get('/optimized', async function(req, res, next) {
    //If a list of players in the game is not provided:
    if(req.query.action === undefined ) {
        await Players.find()
            .then((docs) => {
                let teamsOptimized = assignTeamsOptimized(docs);
                res.send(teamsOptimized);
            })
            .catch((err) => {
                console.error(err);
                res.send(err);
            }
        );
    }
});

module.exports = router;
