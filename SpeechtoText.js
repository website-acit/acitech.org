document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const transcriptionDiv = document.getElementById('transcription');
    const pastTranscriptionsDiv = document.getElementById('pastTranscriptions');
    let recognition;
    let isListening = false;
    const stopListeningTimeout = 5000; // 5 seconds
    const transcribedText = [];

    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false; // Set to false for single utterance
        recognition.interimResults = true;

        recognition.onstart = () => {
            isListening = true;
            startButton.textContent = 'Listening...';
            transcriptionDiv.textContent = ''; // Clear previous transcription
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    const finalTranscript = event.results[i][0].transcript.trim();
                    const timestamp = new Date().toLocaleString();
                    const newEntry = `${timestamp}: ${finalTranscript}`;
                    transcribedText.push(newEntry);
                    displayTranscription(newEntry);
                    saveToFile(newEntry + '\n'); // Append to the file
                    stopRecognition(); // Stop after final result
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            transcriptionDiv.textContent = interimTranscript; // Display interim results
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            isListening = false;
            startButton.textContent = 'Start Listening';
            transcriptionDiv.textContent = `Error: ${event.error}`;
        };

        recognition.onend = () => {
            isListening = false;
            startButton.textContent = 'Start Listening';
            if (transcriptionDiv.textContent === '') {
                transcriptionDiv.textContent = 'No speech detected within the time limit.';
            }
        };

        startButton.addEventListener('click', () => {
            if (!isListening) {
                startRecognition();
            }
        });

        let stopTimeout;
        function startRecognition() {
            recognition.start();
            clearTimeout(stopTimeout);
            stopTimeout = setTimeout(stopRecognition, stopListeningTimeout);
        }

        function stopRecognition() {
            if (isListening) {
                recognition.stop();
                clearTimeout(stopTimeout);
            }
        }

        function displayTranscription(textWithTimestamp) {
            const p = document.createElement('p');
            p.classList.add('transcription-item');
            p.textContent = textWithTimestamp;
            pastTranscriptionsDiv.appendChild(p);
        }

        function saveToFile(text) {
            // This will trigger a download in the browser.
            // For a true "flat file" saving on the server, you would need a server-side implementation.
            const filename = 'transcriptions.txt';
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    } else {
        transcriptionDiv.textContent = 'Speech recognition is not supported in this browser.';
    }
});
