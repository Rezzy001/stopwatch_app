const body = document.querySelector('body');
const stopwatchContainer = document.querySelector('.stopwatch-container');

// Buttons
const display = document.getElementById('display');
const startButton = document.getElementById('startBtn');
const lapButton = document.getElementById('lapBtn');

// Table
const tableHeader = document.querySelector('.table-header');
const lapList = document.getElementById('lapList');

// Toggle feature
const toggle = document.getElementById('toggle');
const theme = document.querySelector('.theme')
const themeText = document.querySelector('.theme span');

// Variables for the timer
let timer = null;
let milliseconds = 0, seconds = 0, minutes = 0, hours = 0;
let lapCount = 0;
let lastLapTime = { milliseconds: 0, seconds: 0, minutes: 0, hours: 0 };

// To start the timer. If the timer has no value, the code inside the if block will run
function startTimer() {
  if (!timer) {
    timer = setInterval(runTimer, 10);
  }
}

// To run the timer and update the time variables
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

// To update the display of the stopwatch
function updateDisplay() {
  let ms = milliseconds < 10 ? '0' + milliseconds : milliseconds;
  let sec = seconds < 10 ? '0' + seconds : seconds;
  let min = minutes < 10 ? '0' + minutes : minutes;
  let hr = hours < 10 ? '0' + hours : hours;

  display.textContent = `${hr}:${min}:${sec}:${ms}`;
}

// to pause the timer
function pauseTimer() {
  clearInterval(timer);
  timer = null;
}

// To reset the timer
function resetTimer() {
    clearInterval(timer);
    timer = null;
    
    milliseconds = seconds = minutes = hours = 0;
    lapCount = 0;
    lastLapTime = { milliseconds: 0, seconds: 0, minutes: 0, hours: 0 };
    lapList.innerHTML = '';

    updateDisplay();
}

// to record the lap times
function recordLap() {
  lapCount++;

  // Calculate lap time
  let lapMilliseconds = milliseconds - lastLapTime.milliseconds;
  let lapSeconds = seconds - lastLapTime.seconds;
  let lapMinutes = minutes - lastLapTime.minutes;
  let lapHours = hours - lastLapTime.hours;

  // Adjust for negative values
  if (lapMilliseconds < 0) {
    lapMilliseconds += 100;
    lapSeconds--;
  }
  if (lapSeconds < 0) {
    lapSeconds += 60;
    lapMinutes--;
  }
  if (lapMinutes < 0) {
    lapMinutes += 60;
    lapHours--;
  }

  // Format and display lap times
  let lapTime = `${lapHours.toString().padStart(2, '0')}:${lapMinutes
    .toString()
    .padStart(2, '0')}:${lapSeconds.toString().padStart(2, '0')}:${lapMilliseconds
    .toString()
    .padStart(2, '0')}`;
    
  console.log(`Lap ${lapCount}: ${lapTime}`);

  let totalTime = display.textContent;

  // Create a new row for the lap time and add it to the lap list in the table
  let tableRow = document.createElement('tr');
  tableRow.innerHTML = `<td>${lapCount.toString().padStart(2, '0')}</td><td>${lapTime}</td><td>${totalTime}</td>`;
  lapList.appendChild(tableRow);
  lapButton.disabled = false;

  // Update last lap time
  lastLapTime = { milliseconds, seconds, minutes, hours };
}


// Button controls
startButton.addEventListener('click', () => {
    if (startButton.textContent === 'Start') {
        startTimer();
        startButton.textContent = 'Stop';
        startButton.style.backgroundColor = '#f13402';
        lapButton.disabled = false;
        lapButton.textContent = 'Lap';
        lapButton.style.backgroundColor = '#fff';
        lapButton.style.color = '#000';
        lapButton.style.border = '1px solid #00151b';
    } else if (startButton.textContent === 'Stop') {
        pauseTimer();
        startButton.textContent = 'Resume';
        startButton.style.backgroundColor = 'rgba(241, 52, 2, 0.7)';
        lapButton.textContent = 'Reset';
        lapButton.style.backgroundColor = '#00151b';
        lapButton.style.color = '#fff';
    } else {
        startTimer();
        startButton.textContent = 'Stop';
        startButton.style.backgroundColor = '#f13402';
        lapButton.textContent = 'Lap';
        lapButton.style.backgroundColor = '#fff';
        lapButton.style.color = '#000';
        lapButton.style.border = '1px solid #00151b';
    }
});

lapButton.addEventListener('click', () => {
    if (lapButton.textContent === 'Lap') {
      recordLap();
      tableHeader.innerHTML = `<tr><th>Lap</th><th>Lap Time</th><th>Total Time</th></tr>`;
    } else {
        resetTimer();
        startButton.textContent = 'Start';
        startButton.style.backgroundColor = '#019067';
        lapButton.textContent = 'Lap';
        lapButton.style.backgroundColor = '#ccc';
        lapButton.style.color = 'rgba(0, 0, 0, 0.3)';
        lapButton.style.border = 'none';
        lapButton.disabled = true;
        tableHeader.innerHTML = '';
    }
});

// Toggle dark/light mode
toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    body.classList.toggle('active');
    stopwatchContainer.classList.toggle('active');
    theme.classList.toggle('active');
    if (theme.classList.contains('active')) {
        themeText.textContent = 'Dark Mode';
        themeText.style.color = '#fff'
    } else {
        themeText.textContent = 'Light Mode';
    }
})