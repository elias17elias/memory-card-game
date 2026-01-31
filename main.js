// declerations
const timer = document.querySelector(".timer");
const endscreen = document.querySelector(".end-screen");
const cards = document.querySelectorAll(".card");
const cardHolders = document.querySelectorAll(".card-holder");
let timerId;
const startButton = document.querySelector(".start");
let lock = false;
// start
startButton.onclick = startGame;

// functions
// start function
function startGame() {
    startButton.style.display = "none"; // hide start button
    // randomize the cards
    for (let i = 0; i < cardHolders.length; i++) {
        cardHolders[i].style.order = `${(Math.round(Math.random() * cardHolders.length)).toString()}`;
    }
    // game is started:
    // fast look on the cards
    for (let i = 0; i < cards.length; i++) {
        setTimeout(function () {
            cards[i].classList.toggle("flipped")
        }, i * 100);
        setTimeout(function () {
            cards[i].classList.toggle("flipped");
        }, 500 + i * 100);
    }

    // timer
    // start after the fast look
    setTimeout(function () {
        timerId = setInterval(function () {
            timer.innerHTML = 1 + +timer.innerHTML;
        }, 1000);
    }, 2200);

    // flip the clicked card and start the game
    // start after the fast look
        setTimeout(function () {
        for (let i = 0; i < cards.length; i++) {
            cards[i].onclick = function () {
                if (this.classList.contains("done")) return; //prevent flip if it's done

                this.classList.toggle("flipped"); //flip
                const flipped = document.querySelectorAll(".flipped");
                const backOfFlipped = document.querySelectorAll(".flipped .back");
                if (flipped.length < 2) return;
                lock = true;
                    //check the colors
                    if (backOfFlipped[0].style.backgroundColor === backOfFlipped[1].style.backgroundColor) { 
                        // same => done
                        flipped[0].classList.add("done");
                        flipped[1].classList.add("done");
                    }
                    // not same => close card (flip back) + remove flipped class even if same (preparing to the next pair)
                    setTimeout(function () {
                        flipped[1].classList.remove("flipped");
                        flipped[0].classList.remove("flipped");
                        lock = false;
                    }, 500);
                

                // end of game
                if (document.querySelectorAll(".done").length === cards.length) {
                    clearInterval(timerId);
                    setTimeout(function () {
                        setTimeout(function () {
                            // close all cards (flip back)
                            for (let i = 0; i < cards.length; i++) {
                                cards[i].classList.remove("done");
                            }
                        }, 1000);
                        endScreen();//open endscreen
                    }, 500);
                }
            }
        }
    }, 2200)
}

// end screen function
function endScreen() {
    // show endscreen
    endscreen.style.transform = "translateY(0%)";
    const newScore = document.querySelector(".score span");
    newScore.innerHTML = timer.innerHTML + "s"; //show the current score
    //change best score if needed in local storage
    if (window.localStorage.getItem("bestScore")) {
        window.localStorage.setItem("bestScore", Math.min(+timer.innerHTML, window.localStorage.getItem("bestScore")));
    }
    //set the new score as best score in local storage if it's first play
    else {
        window.localStorage.setItem("bestScore", +timer.innerHTML);
    }
    const bestScore = document.querySelector(".best-score span");
    bestScore.innerHTML = window.localStorage.getItem("bestScore") + "s"; //show the best score
    // restart
    document.querySelector(".restart").onclick = restartGame;
}

// restart function
function restartGame() {
    timer.innerHTML = 0; //reset timer
    endscreen.style.transform = "translateY(100%)"; //close endscreen
    // remove the event (preparing for next play)
    for (let i = 0; i < cards.length; i++) {
        cards[i].onclick = function () { };
    }
    //start again
    setTimeout(startGame,1000);
}
