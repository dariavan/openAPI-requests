const https = require('https');
const fs = require('fs');
const readline = require('readline');
var ProgressBar = require('progress');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const urlMale = "https://randomuser.me/api/?results=1&inc=name,gender,email,phone&gender=male&noinfo"
const urlFemale = "https://randomuser.me/api/?results=1&inc=name,gender,email,phone&gender=female&noinfo";
const urlBoth = "https://randomuser.me/api/?results=1&inc=name,gender,email,phone&noinfo";

var parsedData;
var bestCandidates = [];

return yourPreferences()
.then( url =>{
   return pickCands(url)
}
)
.catch(function(e) {
  console.log(e.message); 
})

function yourPreferences(){
    console.log("Welcome to Tinder console-nopicture-edition! ")
    return new Promise(function(resolve, reject) {
    rl.question("Are you interested in \n1) men \n2) women \n3) both? \n", (answer) => {
        switch(answer){
            case "1": {
                console.log("Men seems good");
                resolve(urlMale);
                break;
            }
            case "2": {
                console.log("Women seems good");
                 resolve(urlFemale);   
                  break;           
            }
            case "3": {
                console.log("Both seems good");
                resolve(urlBoth);
                 break;
            }
            default: {
               resolve(urlBoth);
                break;
            }
        }
    })});}

function getCandidate(url){
    https.get(url, (res) => {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
    try {
        parsedData = JSON.parse(rawData);
        console.log(`${parsedData.results[0].name.first} ${parsedData.results[0].name.last}
    Gender: ${parsedData.results[0].gender}`);
    } catch (e) {
      console.error("Smth went wrong with getting a candidate" + e.message);
    }
  });
})
}

function pickCands(url){
        getCandidate(url);
        rl.question(`Listen to your heart and type "ok" to save to fav \n`, (answer) => {
            if (answer == "ok"){
                bestCandidates[bestCandidates.length] = parsedData;
               if (bestCandidates.length != 3) console.log(`Pick ${3 - bestCandidates.length} more`);
                if (bestCandidates.length == 3) {
                      fs.writeFile("candidates.json", JSON.stringify(bestCandidates, null, '\t'));
                      rl.close();
                      fakeBestMatch();
                   }else{
                pickCands(url);
            }
        }else{
            console.log("No is no");
            pickCands(url);
        }
    })
}

function fakeBestMatch(){
   var randomMatch = Math.abs(Math.ceil(Math.random()*3-1));
    console.log("So....Best match is preparing...");
    var bar = new ProgressBar(':bar :current/:total', { total: 3 });
    var timer = setInterval(function () {
        bar.tick();
        if (bar.complete) {
            clearInterval(timer);
            console.log(`  Your potential life partner: ${bestCandidates[randomMatch].results[0].name.first}
        If you are not a sociopath - here comes the phone number: ${bestCandidates[randomMatch].results[0].phone}
        else the email: ${bestCandidates[randomMatch].results[0].email}`);
    }}, 500);
}

