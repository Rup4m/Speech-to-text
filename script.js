window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

const transcriptElement = document.getElementById('textOutput');
const startStopBtn = document.getElementById('startStopBtn');
const newSpeechBtn = document.getElementById('newSpeechBtn');
const body = document.body;

let listening = false;

// Web Audio API for beep sound
function playBeep() {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = 'sine'; // Beep sound type
  oscillator.frequency.setValueAtTime(1000, context.currentTime); // 1000 Hz frequency
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.2); // Beep duration
}

// Event Listener for Start/Stop button
startStopBtn.addEventListener('click', () => {
  if (!listening) {
    playBeep(); // Play beep when recording starts
    recognition.start();
    startStopBtn.textContent = '🎤 Listening...';
    listening = true;

    // Apply glowing effect to the text-output during recording
    transcriptElement.classList.add('glow');
  }
});

recognition.addEventListener('result', (event) => {
  const transcript = Array.from(event.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join(' ');

  transcriptElement.textContent = transcript;

  if (event.results[0].isFinal) {
    listening = false;
    startStopBtn.textContent = '🎤 Start Listening';
    
    // Remove glowing effect when recording stops
    transcriptElement.classList.remove('glow');
  }
});

recognition.addEventListener('end', () => {
  listening = false;
  startStopBtn.textContent = '🎤 Start Listening';

  // Remove glowing effect when recording stops
  transcriptElement.classList.remove('glow');
});

newSpeechBtn.addEventListener('click', () => {
  transcriptElement.textContent = 'Your speech will appear here...';
});