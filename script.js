// Restore state on reload
window.addEventListener('load', () => {
  const savedData = JSON.parse(localStorage.getItem('stopwatchData'));
  if (savedData) {
    hours = savedData.hours || 0;
    minutes = savedData.minutes || 0;
    seconds = savedData.seconds || 0;
    milliseconds = savedData.milliseconds || 0;
    displayLapList.innerHTML = savedData.laps || '';
    isRunning = savedData.isRunning || false;
  }

  display.textContent = `${hours.toString().padStart(2, 0)}:${minutes
    .toString()
    .padStart(2, 0)}:${seconds.toString().padStart(2, 0)}:${milliseconds
    .toString()
    .padStart(2, 0)}`;

  if (isRunning) {
    startTimer();
  }
});


// Stopwatch building begins
const body = document.querySelector('body');
const display = document.getElementById('display');
const container = document.querySelector('.container');
const stopwatchContainer = document.querySelector('.stopwatch-container');
const toggle = document.querySelector('.theme');
const themeText = document.querySelector('.theme-text');

// buttons
const startButton = document.getElementById('startBtn');
const lapButton = document.getElementById('lapBtn');
const resetButton = document.getElementById('resetBtn');

//table
const tableContainer = document.querySelector('.table-container');
const displayLapList = document.getElementById('laplist');
const tableHeader = document.querySelector('.table-header');

// initialise variables
let timer = null;
let isRunning = false;
let milliseconds = 0,
  seconds = 0,
  minutes = 0,
  hours = 0;
let lapCount = 0;
let lastLapTime = { milliseconds: 0, seconds: 0, minutes: 0, hours: 0 };

// for the timer to run
function startTimer() {
  if (!timer) {
    timer = setInterval(runTimer, 10);
  }
}

// function to run the timer
function runTimer() {
  milliseconds++;
  if (milliseconds === 100) {
    seconds++;
    milliseconds = 0;
  }
  if (seconds === 60) {
    minutes++;
    seconds = 0;
  }
  if (minutes === 60) {
    hours++;
    minutes = 0;
  }

  updateDisplay();
}

// to update the timer
function updateDisplay() {
  let ms = milliseconds < 10 ? '0' + milliseconds : milliseconds;
  let secs = seconds < 10 ? '0' + seconds : seconds;
  let mins = minutes < 10 ? '0' + minutes : minutes;
  let hrs = hours < 10 ? '0' + hours : hours;

  display.textContent = `${hrs}:${mins}:${secs}:${ms}`;

  // save automatically every second
  if (milliseconds >= 100) {
    milliseconds = 0;
    seconds++;
  }
  if (seconds >= 60) {
    seconds = 0;
    minutes++;
  }
  if (minutes >= 60) {
    minutes = 0;
    hours++;
  }

  // update display
  display.textContent = `${hours.toString().padStart(2, 0)}:${minutes
    .toString()
    .padStart(2, 0)}:${seconds.toString().padStart(2, 0)}:${milliseconds
    .toString()
    .padStart(2, 0)}`;

  // Auto-save every second
  if (milliseconds === 0) {
    saveStopwatchData();
  }
}

// to pause the timer
function pauseTimer() {
  clearInterval(timer);
  timer = null;
}

// reset the timer
function resetTimer() {
  clearInterval(timer);
  timer = null;
  milliseconds = 0;
  seconds = 0;
  minutes = 0;
  hours = 0;
  lapCount = 0;
  lastLapTime = { milliseconds: 0, seconds: 0, minutes: 0, hours: 0 };

  displayLapList.innerHTML = '';
  updateDisplay();

  localStorage.removeItem('stopwatchData');
}

// to record lap times
function displayLapTime() {
  lapCount++;

  // calculate lap time
  let lapMs = milliseconds - lastLapTime.milliseconds;
  let lapSec = seconds - lastLapTime.seconds;
  let lapMins = minutes - lastLapTime.minutes;
  let lapHr = hours - lastLapTime.hours;

  // Adjust for negative values
  if (lapMs < 0) {
    lapMs += 100;
    lapSec--;
  }
  if (lapSec < 0) {
    lapSec += 60;
    lapMins--;
  }
  if (lapMins < 0) {
    lapMins += 60;
    lapHr--;
  }
  if (lapHr < 0) {
    lapHr = 0; // This is to prevent negative hours.
  }

  // format how the lap time is displayed
  let lapTime = `${lapHr.toString().padStart(2, 0)}:${lapMins
    .toString()
    .padStart(2, 0)}:${lapSec.toString().padStart(2, 0)}:${lapMs
    .toString()
    .padStart(2, 0)}`;
  let totalTime = display.textContent;

  // Show table header
  let lapCountText = 'Lap';
  let lapTimeText = 'Lap Time';
  let totalTimeText = 'Total Time';
  tableHeader.innerHTML = `<tr><th>${lapCountText}</th><th>${lapTimeText}</th><th>${totalTimeText}</th></tr>`;

  // create a new row for the lap list
  let row = document.createElement('tr');
  row.innerHTML = `<td>${lapCount
    .toString()
    .padStart(2, 0)}</td><td>${lapTime}</td><td>${totalTime}</td>`;

  displayLapList.prepend(row); // This is for the users to see the recent lap at the top of the table.

  lastLapTime = { milliseconds, seconds, minutes, hours };
}

// To save user data on reload
function saveStopwatchData() {
  const data = {
    hours,
    minutes,
    seconds,
    milliseconds,
    laps: displayLapList.innerHTML,
    lapCount,
    tableHeader: tableHeader.innerHTML,
    theme: body.classList.contains('active') ? 'dark' : 'light',
    isRunning,
  };
  localStorage.setItem('stopwatchData', JSON.stringify(data));
}

// Restore data
function restoreStopwatchData() {
  const savedData = JSON.parse(localStorage.getItem('stopwatchData'));
  
  if (!savedData) {
    return;
  }
  
  hours = savedData.hours || 0;
  minutes = savedData.minutes || 0;
  seconds = savedData.seconds || 0;
  milliseconds = savedData.milliseconds || 0;
  displayLapList.innerHTML = savedData.laps || '';
  lapCount = savedData.lapCount || 0;
  tableHeader.innerHTML = savedData.tableHeader || '';
  isRunning = savedData.isRunning || false;
  
  if (savedData) {
    // 🌗 Restore theme
    if (savedData.theme === 'dark') {
      body.classList.add('active');
      toggle.classList.add('active');
      container.classList.add('active');
      themeText.innerText = 'Dark Mode';
      toggle.style.textAlign = 'left';
      toggle.style.paddingLeft = '1rem';
      toggle.style.paddingRight = '0';
    } else {
      body.classList.remove('active');
      toggle.classList.remove('active');
      container.classList.remove('active');
      themeText.innerText = 'Light Mode';
      toggle.style.textAlign = 'right';
      toggle.style.paddingRight = '0.5rem';
    }
    
    // Resume stopwatch if it was running
    if (isRunning) {
      startTimer();
    }
  }
}

// Table scroll effect
tableContainer.addEventListener('scroll', () => {
  tableHeader.style.position = 'sticky';
  tableHeader.style.top = '0';

  const darkMode = body.classList.contains('active');
  
  if (tableContainer.scrollTop > 0) {
    tableHeader.style.backgroundColor = darkMode ? 'rgb(177, 38, 37)' : 'rgb(20, 20, 20)';
    tableHeader.style.color = '#fff';
  } else {
    tableHeader.style.backgroundColor = 'rgb(255, 255, 255)';
    tableHeader.style.color = 'rgb(20, 20, 20)';
  }
});


// button controls
startButton.addEventListener('click', () => {
  if (startButton.textContent === 'Start') {
    startTimer();
    startButton.textContent = 'Stop';
    startButton.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    resetButton.style.backgroundColor = 'rgba(251, 219, 104, 1)';
    startButton.style.color = 'rgba(20, 20, 20, 1)';
    lapButton.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    lapButton.style.color = 'rgba(20, 20, 20, 1)';
    lapButton.disabled = false;
  } else if (startButton.textContent === 'Stop') {
    pauseTimer();
    startButton.textContent = 'Resume';
    startButton.style.backgroundColor = 'rgba(251, 219, 104, 1)';
    startButton.style.color = 'rgba(20, 20, 20, 1)';
    lapButton.disabled = true;
    lapButton.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    lapButton.style.color = 'rgba(20, 20, 20, 1)';
  } else {
    startTimer();
    startButton.textContent = 'Stop';
    startButton.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    startButton.style.color = 'rgba(20, 20, 20, 1)';
    lapButton.disabled = false;
  }
});

resetButton.addEventListener('click', () => {
  if (resetButton.textContent === 'Reset') {
    resetTimer();
    tableContainer.style.height = 'none';
    startButton.textContent = 'Start';
    startButton.style.backgroundColor = 'rgba(251, 219, 104, 1)';
    lapButton.disabled = true;
    lapButton.style.backgroundColor = 'rgba(251, 237, 237, 0.6)';
    lapButton.style.color = 'rgba(20, 20, 20, 0.6)';
    resetButton.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    tableHeader.innerHTML = '';
  }
});

lapButton.addEventListener('click', () => {
  if (lapButton.textContent === 'Lap') {
    displayLapTime();
    tableContainer.style.height = '100vh';
  }
});

// toggle dark and light mode
toggle.addEventListener('click', () => {
  toggle.classList.toggle('active');
  body.classList.toggle('active');
  container.classList.toggle('active');
  if (toggle.classList.contains('active')) {
    themeText.innerText = 'Dark Mode';
    toggle.style.textAlign = 'left';
    toggle.style.paddingLeft = '1rem';
    toggle.style.paddingRight = '0';
  } else {
    themeText.innerText = 'Light Mode';
    toggle.style.textAlign = 'right';
    toggle.style.paddingRight = '0.5rem';
  } 
  
  saveStopwatchData();
});


setInterval(saveStopwatchData, 1000);

document.addEventListener('DOMContentLoaded', restoreStopwatchData);