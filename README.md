## Overview

The code consists of a Node.js application that serves as a backend server for a game application. It uses Express.js as the web framework and MongoDB as the database to store player information. This player information is used to generate teams based on the player's indicated team preference. The application retrieves player data from the database and exposes it through a RESTful API endpoint.

## Quickstart:

### Backend:
For convenience, I have hosted the back-end code on Replit, which can be accessed at the following link:
https://replit.com/@LiamO2/mongo-teams

The following URLs can be used to access the API endpoint:
https://mongo-teams.liamo2.repl.co/
https://mongo-teams.liamo2.repl.co/

Further explanation of the use of these API endpoints is found in this report. These endpoints are connected to a MongoDB database hosted on mongodb.com

Replit sandboxes may become dormant, so there may be a momentary delay when accessing the API endpoints while the sandbox is reactivated.


### Frontend / GUI:
The frontend code is hosted on the code sandbox service Codepen, and can be accessed at the following link:
https://codepen.io/liamosler/pen/vYQZGob

This provides a minimal GUI with which to interact with the backend API. The GUI allows you to view the data hosted in the hosted database through fetch requests to the API endpoints hosted on the code sandbox service Replit. The front-end is written in basic HTML, CSS, and JavaScript.


## Running Locally: 

### Dependencies:
- **Node.js** (JavaScript runtime environment)
  - **Express** (Web framework and middleware)
  - **Mongoose** (MongoDB driver)
  - **MongoDB** (Database)

### Prerequisites

Before running the application, make sure you have the following:

- Node.js installed on your machine.
- MongoDB installed and running.
- A `.env` file in the project directory containing the necessary environment variables. (Refer to the `.env` file for the required variables.)


### Import the Sample Data:
A dump of the mongoDB database and its collections is provided in the root of the project repository as a JSON file. This can be imported into a mongoDB database. 

### Installation

1. Clone the repository or download the source code.
2. Navigate to the project directory.
3. Install the dependencies by running the following command:

```
npm install
```

### Configuration

Before running the application, make sure to configure the database connection. Open the `.env` file and set the following variables:
```env

DB_USER=<The username for connecting to the MongoDB server>
DB_PASS=<The password for connecting to the MongoDB server>
DB_URL=<The URL or hostname of the MongoDB server>
```

### Running the Application

To start the application, run the following command:

```
npm start
```

This will start the server, and you should see the message "Connected to DB" in the console if the database connection is successful.

## Code Explanation

### `app.js`

The `app.js` file is the main entry point of the application. It sets up the Express.js application, connects to the MongoDB database, and configures various middleware and routes.

- The `require("dotenv").config()` line loads the environment variables from the `.env` file into `process.env`.
- Required modules are imported using the `require` function.
- The database connection URI is constructed using the environment variables.
- The MongoDB connection is established using `mongoose.connect`.
- The application's view engine is set to EJS (Embedded JavaScript) for rendering dynamic views.
- Middleware functions such as `logger`, `express.json`, `cookieParser`, and `express.static` are configured.
- The routes for the index and players are defined using `app.use`.
- The error handling middleware functions handle 404 errors and other application errors.

## Route: GET '/players'

This route handles the HTTP GET request to retrieve player information. The behavior of the route depends on the query parameters provided in the request URL.

- The `console.log(req.query)` statement logs the query parameters to the console for debugging purposes.

### Case 1: No query parameters (default behavior)

If no query parameters are provided, the route returns all players in the database.

Example:
```
GET /players
```

### Case 2: Query parameter 'action' is 'findById'

If the query parameter 'action' is set to 'findById', the route retrieves a player with the specified ID.

Example:
```
GET /players?action=findById&id=64a2329dc348d68c6635112e
```

### Case 3: Query parameter 'action' is 'findByIdAndDelete'

If the query parameter 'action' is set to 'findByIdAndDelete', the route deletes a player with the specified ID.

Example:
```
GET /players?action=findByIdAndDelete&id=64a2329dc348d68c6635112e
```

### Case 4: Query parameter 'action' is 'findByIdAndUpdate'

If the query parameter 'action' is set to 'findByIdAndUpdate', the route updates a player with the specified ID using the provided fields.

Example:
```
GET /players?action=findByIdAndUpdate&id=64a2329dc348d68c6635112e&fname925=John&lname925=Doe&phone925=1234567890&preference925=1,2,3
```

### Case 5: Query parameter 'action' is 'create'

If the query parameter 'action' is set to 'create', the route creates a new player with the provided fields.

Example:
```
GET /players?action=create&fname925=John&lname925=Doe&phone925=1234567890&preference925=1,2,3
```

### Error Handling

- If any required fields are missing in the query parameters (e.g., 'fname925', 'lname925', 'phone925', 'preference925'), the route returns a JSON response with a 'message' field indicating the missing fields.
- If the requested player ID is not found in the database, the route returns a JSON response with a 'message' field indicating that there is no player with the requested ID.
- If any error occurs during the database operation, the route returns a JSON response with a 'message' field indicating that an error has occurred.

## Export

The `router` object defined in the code is exported to be used by other parts of the application.

Example usage:
```javascript
const playersRouter = require('./routes/players');

// ...
app.use('/players', playersRouter);
```

## Players.js code:
    
```javascript
var express = require('express');
var router = express.Router();

var Players = require('../models/Players');

router.get('/', async function(req, res, next) {
  //If the query is empty, return all players
  //Ex: http://localhost:3000/players
  if(req.query.action === undefined ) {
    console.log("hello");
    await Players.find({})
      .then((docs) => {
        res.send(docs);
      })
      .catch((err) => {
        console.error(err);
        res.send(err);
      });
    }

    else {
      //If the req action is findById, return the player with the id
      //Ex: http://localhost:3000/players?action=findById&id=64a2329dc348d68c6635112e
      if(req.query.action === "findById"){
        await Players.findById(req.query.id)
          .then((docs) => {
            if(docs == null) {
              res.json({message: "No player with requested id"});
            }
            else {
              res.send(docs);
            }
          })
          .catch((err) => {
            console.error(err);
            res.json({message: "Encountered an error"});
          });
      }
      //If the req action is findByIdAndDelete, delete the player with the id
      //Ex: http://localhost:3000/players?action=findByIdAndDelete&id=64a2329dc348d68c6635112e
      else if(req.query.action === "findByIdAndDelete"){
        await Players.findByIdAndDelete(req.query.id)
          .then((docs) => {
            if(docs == null) {
              res.json({message: "No player with requested id"});
            }
            else {
              res.send(docs);
            }
          })
          .catch((err) => {
            console.error(err);
            res.json({message: "Encountered an error"});
          });
       }
       //If the req action is findByIdAndUpdate, update the player with the id
       // Ex: http://localhost:3000/players?action=findByIdAndUpdate&id=64a2329dc348d68c6635112e&fname925=John&lname925=Doe&phone925=1234567890&preference925=1,2,3
       else if(req.query.action === "findByIdAndUpdate"){
        //Check if the required fields are missing
        if(
          req.query.fname925 === undefined ||
          req.query.lname925 === undefined ||
          req.query.phone925 === undefined ||
          req.query.preference925 === undefined
        ){
          res.json({message: "Missing required fields"});
        }else{
          //If all required fields are present, update the player
          await Players.findByIdAndUpdate(req.query.id,
            {
              fname925: req.query.fname925,
              lname925: req.query.lname925,
              phone925: req.query.phone925,
              preference925: req.query.preference925.split(",")
            })
          .then((docs) => {
            if(docs == null) {
              res.json({message: "No player with requested id"});
            }
            else {
              res.send(docs);
            }
          })
          .catch((err) => {
            console.error(err);
            res.json({message: "Encountered an error"});
          });
        }
      }
      //If the req action is create, create a new player
      //Ex: http://localhost:3000/players?action=create&fname925=John&lname925=Doe&phone925=1234567890&preference925=1,2,3
      else if(req.query.action === "create"){
        //Check if the required fields are missing
        if(
          req.query.fname925 === undefined ||
          req.query.lname925 === undefined ||
          req.query.phone925 === undefined ||
          req.query.preference925 === undefined
        ){
          res.json({message: "Missing required fields"});
        }else{
          //If all required fields are present, create the player
          await Players.create(
            {
              fname925: req.query.fname925,
              lname925: req.query.lname925,
              phone925: req.query.phone925,
              preference925: req.query.preference925
            })
          .then((docs) => {
            if(docs == null) {
              res.json({message: "Encountered an error"});
            }
            else {
              res.send(docs);
            }
          })
          .catch((err) => {
            console.error(err);
            res.json({message: "Encountered an error"});
          });
        }
      }
      else{
        res.json({message: "Invalid action"});
      }
    } 
});

module.exports = router;
```

### Sorting the players in to teams:

In the assignment specification, students were given instructions to sort the players into teams based on their preferences. Based on the result of the sorting, a goodness score is applied:
- If a player is assigned to their first preference, they get 5 points.
- If a player is assigned to their second preference, they get 4 points.
- If a player is assigned to their third preference, they get 3 points.
  
Based on this specification we can gather three things:
- The player's preferences are ordered from most preferred to least preferred.
- The player's preferences are unique.
- The player can only be assigned to one team.
- The player can only indicate three preferences.

There are some unknown factors that we need to consider:
- How many teams are there? This can be determined in two ways:
  - A parameter is passed to the application that indicates the number of teams.
  - The number of teams is determined by the number of unique preferences indicated by the players.

There are two approaches to completing this problem:
- The first approach is to sort the players into teams based on their preferences based on the initial order. This approach is more efficient, but it does not guarantee that all players will be assigned to a team or an optimized score.

```javascript
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

```

Accessing these routes is done by sending a GET request to the following URLs:
/teams/quick <- Assigns players to teams using the quick algorithm, placing them in their preferred teams first, by order which they are listed in the array.
/teams/optimized <- Assigns players to teams while trying to find the best possible arrangement of players, by calculating the score of each permutation of players and returning the permutation with the highest score.

So, for instance, if we have the following objects in our database:

```json
[{
    "_id": "64a2316ec348d68c6635112c",
    "fname925": "Grace",
    "lname925": "Hopper",
    "phone925": "555-555-5555",
    "preference925": ["red", "green", "blue"]
}, {
    "_id": "64a2329dc348d68c6635112e",
    "fname925": "John",
    "lname925": "Doe",
    "phone925": "1234567890",
    "preference925": ["red", "green", "blue"]
}, {
    "_id": "64a232b1c348d68c6635112f",
    "fname925": "Jane",
    "lname925": "Doe",
    "phone925": "1-555-555-5555",
    "preference925": ["blue", "green", "red"]
}, {
    "_id": "64a232f5c348d68c66351131",
    "fname925": "Alan",
    "lname925": "Turing",
    "phone925": "1-555-555-5555",
    "preference925": ["blue", "green", "red"]
}, {
    "_id": "64a2330ac348d68c66351132",
    "fname925": "Ada",
    "lname925": "Lovelace",
    "phone925": "1-555-555-5555",
    "preference925": ["blue", "green", "red"]
}, {
    "_id": "64a2332bc348d68c66351133",
    "fname925": "Steve",
    "lname925": "Wozniak",
    "phone925": "1-555-555-5555",
    "preference925": ["blue", "red", "green"]
}]
```

You will receive a JSON response like this with the players sorted into teams, using the quick algorithm:
```json
{
    "teams": {
        "red": [{
            "_id": "64a2316ec348d68c6635112c",
            "fname925": "Grace",
            "lname925": "Hopper",
            "phone925": "555-555-5555",
            "preference925": ["red", "green", "blue"],
            "score": 5
        }, {
            "_id": "64a2329dc348d68c6635112e",
            "fname925": "John",
            "lname925": "Doe",
            "phone925": "1234567890",
            "preference925": ["red", "green", "blue"],
            "score": 5
        }],
        "green": [{
            "_id": "64a2330ac348d68c66351132",
            "fname925": "Ada",
            "lname925": "Lovelace",
            "phone925": "1-555-555-5555",
            "preference925": ["blue", "green", "red"],
            "score": 4
        }, {
            "_id": "64a2332bc348d68c66351133",
            "fname925": "Steve",
            "lname925": "Wozniak",
            "phone925": "1-555-555-5555",
            "preference925": ["blue", "red", "green"],
            "score": 3
        }],
        "blue": [{
            "_id": "64a232b1c348d68c6635112f",
            "fname925": "Jane",
            "lname925": "Doe",
            "phone925": "1-555-555-5555",
            "preference925": ["blue", "green", "red"],
            "score": 5
        }, {
            "_id": "64a232f5c348d68c66351131",
            "fname925": "Alan",
            "lname925": "Turing",
            "phone925": "1-555-555-5555",
            "preference925": ["blue", "green", "red"],
            "score": 5
        }]
    },
    "totalScore": 27
}
```
Which yields a total score of 27. 

By instead using optimized score algorithm, we can yield 28 instead:
```json
{
    "teams": {
        "red": [{
            "_id": "64a2316ec348d68c6635112c",
            "fname925": "Grace",
            "lname925": "Hopper",
            "phone925": "555-555-5555",
            "preference925": ["red", "green", "blue"],
            "score": 4
        }, {
            "_id": "64a2329dc348d68c6635112e",
            "fname925": "John",
            "lname925": "Doe",
            "phone925": "1234567890",
            "preference925": ["red", "green", "blue"],
            "score": 4
        }],
        "green": [{
            "_id": "64a232b1c348d68c6635112f",
            "fname925": "Jane",
            "lname925": "Doe",
            "phone925": "1-555-555-5555",
            "preference925": ["blue", "green", "red"],
            "score": 3
        }, {
            "_id": "64a232f5c348d68c66351131",
            "fname925": "Alan",
            "lname925": "Turing",
            "phone925": "1-555-555-5555",
            "preference925": ["blue", "green", "red"],
            "score": 3
        }],
        "blue": [{
            "_id": "64a2330ac348d68c66351132",
            "fname925": "Ada",
            "lname925": "Lovelace",
            "phone925": "1-555-555-5555",
            "preference925": ["blue", "green", "red"],
            "score": 5
        }, {
            "_id": "64a2332bc348d68c66351133",
            "fname925": "Steve",
            "lname925": "Wozniak",
            "phone925": "1-555-555-5555",
            "preference925": ["blue", "red", "green"],
            "score": 5
        }]
    },
    "totalScore": 28
}
```

There is some drawbacks to using this algorithm as it depends on permuting the array, thus the complexity of the algorithm is n!. For a database with 6 items, this is only 720 permutations, but for a database with 10 items, this is 3,628,800 permutations. This is why the quick algorithm is used by default, but the optimized algorithm is available if you want to use it.


## Conclusion

This readme file provides an overview of the code structure and functionality. By following the installation and configuration instructions, you should be able to run the application and retrieve player data from the MongoDB database. Feel free to explore and modify the code to meet your specific requirements.