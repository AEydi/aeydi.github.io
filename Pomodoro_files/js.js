// Credit: Mateusz Rybczonec

const FULL_DASH_ARRAY = 283;
const P_TIME = 25;
const L_TIME = 15;
const S_TIME = 5;
var TIME_LIMIT = P_TIME;
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
let startBtn = document.getElementById("start");
let timePassed = 0;
let timeLeft = TIME_LIMIT*60;
let timerInterval = null;
var timer = document.getElementById("base-timer-label");
var target = 0;
let resetText = "00:00";

function resetTime(){
    stop_timer = true;
    timeLeft = TIME_LIMIT*60;
    if (TIME_LIMIT == P_TIME){
        colorElement.classList.remove(COLOR_CODES.teal.color);
        colorElement.classList.remove(COLOR_CODES.amber.color);
        colorElement.classList.add(COLOR_CODES.red.color);
        startBtn.classList.remove(COLOR_CODES.teal.color);
        startBtn.classList.remove(COLOR_CODES.amber.color);
        startBtn.classList.add(COLOR_CODES.red.color);
    } else if (TIME_LIMIT == S_TIME){
        colorElement.classList.remove(COLOR_CODES.teal.color);
        colorElement.classList.add(COLOR_CODES.amber.color);
        colorElement.classList.remove(COLOR_CODES.red.color);
        startBtn.classList.remove(COLOR_CODES.teal.color);
        startBtn.classList.add(COLOR_CODES.amber.color);
        startBtn.classList.remove(COLOR_CODES.red.color);
    } else if (TIME_LIMIT == L_TIME){
        colorElement.classList.add(COLOR_CODES.teal.color);
        colorElement.classList.remove(COLOR_CODES.amber.color);
        colorElement.classList.remove(COLOR_CODES.red.color);
        startBtn.classList.add(COLOR_CODES.teal.color);
        startBtn.classList.remove(COLOR_CODES.amber.color);
        startBtn.classList.remove(COLOR_CODES.red.color);
    }
    timer.innerHTML = resetText;
}

function setTime(time){
    if(time == 'P_TIME'){
        time = P_TIME
    }
    else if(time == 'L_TIME'){
        time = L_TIME
    }
    else if(time == 'S_TIME')
    {
        time = S_TIME
    }
    TIME_LIMIT = time;
    var t = time.toString();
    if (time < 10){
        t = "0" + time.toString();
    }
    resetText = t + ":00"; 
    resetTime();
    (new Audio("./Pomodoro_files/tick.mp3")).play()
}

function onTimesUp() {
    clearInterval(timerInterval);
    stop_timer = true;
    if (TIME_LIMIT == P_TIME){
        (new Audio("./Pomodoro_files/alert-work.mp3")).play()
    } else if (TIME_LIMIT == S_TIME){
        (new Audio("./Pomodoro_files/alert-short-break.mp3")).play()
    } else if (TIME_LIMIT == L_TIME){
        (new Audio("./Pomodoro_files/alert-long-break.mp3")).play()
    }
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
        (new Audio("./Pomodoro_files/tick.mp3")).play()
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