// Get DOM elements
const startButton = document.getElementById('startButton');
const resultDiv = document.getElementById('result');
const instructionsPara = document.getElementById('instructions');

// Check for Web Speech API support
if ('webkitSpeechRecognition' in window) {
    // Create a new Speech Recognition object
    const recognition = new webkitSpeechRecognition(); // For Chrome-based browsers
    recognition.continuous = true; // Keep listening even when the user pauses
    recognition.interimResults = true; // Provide interim results for a smoother experience

    // Event Listeners
    startButton.addEventListener('click', startRecognition);

    recognition.onstart = function() {
        instructionsPara.textContent = "Listening...";
    };

    recognition.onspeechend = function() {
        instructionsPara.textContent = "Stopped listening.";
        recognition.stop();
    };

    recognition.onerror = function(event) {
        instructionsPara.textContent = 'Error: ' + event.error;
    };

    recognition.onresult = function(event) {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        resultDiv.innerHTML = finalTranscript + '<span style="color:#ddd;">' + interimTranscript + '</span>';
    };

    // Function to start speech recognition
    function startRecognition() {
        resultDiv.innerHTML = '';
        instructionsPara.textContent = '';
        recognition.start();
    }

} else {
    // Speech Recognition not supported
    instructionsPara.textContent = 'Web Speech API is not supported in this browser.';
    startButton.disabled = true;
}
