// Credit: Mateusz Rybczonec

const FULL_DASH_ARRAY = 283;
var TIME_LIMIT = 25*60;
var stop_timer = true;
var COLOR_CODES = {
    teal: {
        color: "Teal"
    },
    amber: {
        color: "Amber"
    },
    red: {
        color: "Red"
    }
};
let colorElement = document.getElementById("base-timer-path-remaining");

let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
var timer = document.getElementById("base-timer-label");
var target = 0;
let resetText = "00:00";

function resetTime(){
    stop_timer = true;
    timeLeft = TIME_LIMIT*60;
    if (TIME_LIMIT == 25){
        colorElement.classList.remove(COLOR_CODES.teal.color);
        colorElement.classList.remove(COLOR_CODES.amber.color);
        colorElement.classList.add(COLOR_CODES.red.color);
    } else if (TIME_LIMIT == 5){
        colorElement.classList.remove(COLOR_CODES.teal.color);
        colorElement.classList.add(COLOR_CODES.amber.color);
        colorElement.classList.remove(COLOR_CODES.red.color);
    } else if (TIME_LIMIT == 15){
        colorElement.classList.add(COLOR_CODES.teal.color);
        colorElement.classList.remove(COLOR_CODES.amber.color);
        colorElement.classList.remove(COLOR_CODES.red.color);
    }
    timer.innerHTML = resetText;
}

function setTime(time){
    TIME_LIMIT = time;
    var t = time.toString();
    if (time < 10){
        t = "0" + time.toString();
    }
    resetText = t + ":00"; 
    resetTime();
}

function onTimesUp() {
    clearInterval(timerInterval);
    stop_timer = true;
}

function startTimer() {
    if (stop_timer){
        target = Date.now() + TIME_LIMIT*60*1000;
        stop_timer = false;
        started = false
        timerInterval = setInterval(() => {
            if (stop_timer){
                clearInterval(timerInterval);
                setCircleDasharray();
            } else {
                    timeLeft = Math.ceil((target - Date.now())/1000);
                    timer.innerHTML = formatTime(
                        timeLeft
                    );
                    setCircleDasharray();
            }
            if (timeLeft === 0) {
                onTimesUp();
            }
            
        }, 50);
    }
    
}

function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    return `${minutes}:${seconds}`;
}

function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / (TIME_LIMIT*60);
    return rawTimeFraction - (1 / (TIME_LIMIT*60)) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
    const circleDasharray = `${(calculateTimeFraction() * FULL_DASH_ARRAY).toFixed(0)} 283`;
    colorElement.setAttribute("stroke-dasharray", circleDasharray);
}