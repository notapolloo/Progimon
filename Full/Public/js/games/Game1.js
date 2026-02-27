// cookie clicker with audio every 3 clicks
// every click changes the image a frame

// Update the array below to match the actual audio files in your project.
const filteredFilenames = [
    'haha.wav',
    'mc-dog.wav',
    'meow.wav',
    'meowrgh.wav',
    'nah.wav',
    'oiia.wav',
];


const directoryPath = '/music/sfx/meows';

var cookies = 0;
var cookieMult = 1; // increase cookie by multiplier of 1 on click

//-------------------------------------------------------------------

function randomSound(){
    const randomIndex = Math.floor(Math.random() * filteredFilenames.length);
    return directoryPath + '/' + filteredFilenames[randomIndex];
}

function makeCookie(){

cookies = cookies + cookieMult; // add 1 to cookie counter 
document.getElementById("num_of_cookies").innerHTML = cookies;

if(cookies % 4 === 0){
    var audio = new Audio(randomSound());
    audio.play();

}}