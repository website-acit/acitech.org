// Get DOM elements

const startButton = document.getElementById('startButton');

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

    instructionsPara.textContent = 'Listening...';

    finalTranscript = ''; // Reset transcript

    isListening = true;



    recognition = new webkitSpeechRecognition();

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

        resultDiv.innerHTML = finalTranscript + '<span style="color:#ddd;">' + interimTranscript + '</span>';

    };



    recognition.onstart = () => {

        instructionsPara.textContent = 'Listening...';

        resetSilenceTimer(); // Start the timer when recognition starts

    };



    recognition.onspeechend = () => {

        instructionsPara.textContent = 'Stopped listening.';

        // Do NOT stop recognition here, the timer will handle it

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

}



// Function to create and download the text file

function downloadTranscript() {

    if (!finalTranscript.trim()) {

        instructionsPara.textContent = "No transcript to download.";

        return;

    }



    const blob = new Blob([finalTranscript], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;

    a.download = 'transcript.txt';

    document.body.appendChild(a); // Append, trigger, and remove

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url); // Clean up

    instructionsPara.textContent = "Transcript downloaded.";

}

// Function to reset the silence timer

function resetSilenceTimer() {

    clearTimeout(silenceTimeout); // Clear any existing timer

    silenceTimeout = setTimeout(handleSilence, 30000); // 30 seconds (30000 ms)

}



// Function to handle silence

function handleSilence() {

    stopRecognition(); // Stop recognition

    instructionsPara.textContent = 'Silence detected. Processing transcript...';

    downloadTranscript(); // Create and download file

}



// Event Listeners

startButton.addEventListener('click', startRecognition);
