const express = require('express'); 
// get rid of cors errors
const cors = require('cors');
// const rateLimit = require('express-rate-limit');
const app = express();

app.use(cors());

// body parser middleware any income requests that has a content type of application json will be added to the body so we can access e.g. req.body
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello there'
  })
});

app.get('/calcWalks', (req, res) => {
  res.json({
    message: 'Please submit your walks to this URL using a post request :). Have a nice day - Hermes'
  })
});

app.post('/calcWalks', (req, res) => {
  // Interperate request and create groups
  let walkerGroups = defineWalkGroups(req);

  // Check if groups are the same as before
  if (checkIfSameGroupsAsBefore(walkerGroups)) defineWalkGroups(req);

  res.json({ 
    walk1: walkerGroups.walk1,
    walk2: walkerGroups.walk2 
  });
});


defineWalkGroups = (req) => {
  let walkObj = req.body;
  // Extract walkers array from the reqest obj
  let walkerArray = walkObj.walkers;
  // Extract previous walk arrays (group 1 & group 2)
  let previousWalkGroups = walkObj.previousWalk;

  // Shuffle array and create walking groups
  let walk1 = shuffleArray(walkerArray);
  let walk2 = walk1.splice(0, Math.ceil(walk1.length / 2)).sort();
  walk1.sort();

  return {
    walk1,
    walk2,
    walk1Str: walk1.toString(),
    walk2Str: walk2.toString(),
    lastWalk1Str: previousWalkGroups[0].toString(),
    lastWalk2Str: previousWalkGroups[1].toString(),
  }
}

// Fisher–Yates shuffle
shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

checkIfSameGroupsAsBefore = (walkerGroups) => {
  // Extract variables
  let walk1Str = walkerGroups.walk1Str;
  let walk2Str = walkerGroups.walk2Str;
  let lastWalk1Str = walkerGroups.lastWalk1Str;
  let lastWalk2Str = walkerGroups.lastWalk2Str;

  // Compare groups
  if (walk1Str == lastWalk1Str || walk1Str == lastWalk2Str) {
    console.log('Same groups as before');
    return true;
  } else if (walk2Str == lastWalk1Str || walk2Str == lastWalk2Str) {
    console.log('Same groups as before');
    return true;
  }
}

// app.use(rateLimit({
//   windowMs: 1000, // 1 per second
//   max: 1
// }));

app.listen(5000, () => {
  console.log('Listening on http://localhost:5000');
});