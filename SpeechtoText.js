// Get DOM elements
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const downloadButton = document.getElementById('downloadButton');
const resultDiv = document.getElementById('result');
const instructionsPara = document.getElementById('instructions');

// Global variables
let recognition;
let finalTranscript = '';
let silenceTimeout;
let isListening = false;

// Function to start speech recognition
function startRecognition() {
    if (isListening) return; // Prevent multiple instances

    resultDiv.innerHTML = '';
    instructionsPara.textContent = 'Listening for PA System...';
    finalTranscript = ''; // Reset transcript
    isListening = true;

    startButton.disabled = true;
    stopButton.disabled = false;
    downloadButton.disabled = true;

    recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US'; // You can change the language here

    // Reset silence timer on any speech
    recognition.onresult = (event) => {
        resetSilenceTimer();
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + ' ';
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        resultDiv.innerHTML = finalTranscript + '<span style="color:#999;">' + interimTranscript + '</span>';
    };

    recognition.onstart = () => {
        instructionsPara.textContent = 'Listening for PA System...';
        resetSilenceTimer(); // Start the timer when recognition starts
    };

    recognition.onspeechend = () => {
        // Instructions will be updated by the silence timer or stop button
    };

    recognition.onerror = (event) => {
        instructionsPara.textContent = 'Error: ' + event.error;
        stopRecognition();
    };

    recognition.start();
}

// Function to stop speech recognition
function stopRecognition() {
    if (recognition) {
        recognition.stop();
        recognition = null;
    }
    isListening = false;
    clearTimeout(silenceTimeout); // Clear any pending timeout

    startButton.disabled = false;
    stopButton.disabled = true;
    downloadButton.disabled = finalTranscript.trim() !== '';
    instructionsPara.textContent = 'Stopped listening.';
}

// Function to create and download the text file with timestamp
function downloadTranscript() {
    if (!finalTranscript.trim()) {
        instructionsPara.textContent = "No transcript to save.";
        return;
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    const filename = `transcript_${timestamp}.txt`;

    const blob = new Blob([finalTranscript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a); // Append, trigger, and remove
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up
    instructionsPara.textContent = `Transcript saved as ${filename}`;
}

// Function to reset the silence timer
function resetSilenceTimer() {
    clearTimeout(silenceTimeout); // Clear any existing timer
    silenceTimeout = setTimeout(handleSilence, 30000); // 30 seconds (30000 ms)
}

// Function to handle silence
function handleSilence() {
    stopRecognition(); // Stop recognition
    instructionsPara.textContent = 'Silence detected. Preparing to save transcript...';
    downloadTranscript(); // Create and download file
}

// Event Listeners
startButton.addEventListener('click', startRecognition);
stopButton.addEventListener('click', stopRecognition);
downloadButton.addEventListener('click', downloadTranscript);
