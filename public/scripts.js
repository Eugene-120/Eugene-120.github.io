window.onload = function () {
    var chatMessages = document.getElementById('chat-messages');
    var messageInput = document.getElementById('message-input');
    var sendButton = document.getElementById('send-button');
    var recordButton = document.getElementById('record-button');
    var stopRecordButton = document.getElementById('stop-record-button');
    var playButton = document.getElementById('play-button');
    var recordingIndicator = document.getElementById('recording-indicator');
    var mediaRecorder;
    var recordedChunks = [];

    sendButton.onclick = function () {
        sendMessage(messageInput.value.trim());
    };

    messageInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage(messageInput.value.trim());
        }
    });

    recordButton.onclick = function () {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                recordedChunks = [];

                mediaRecorder.ondataavailable = function (e) {
                    recordedChunks.push(e.data);
                };

                mediaRecorder.onstop = function () {
                    var audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
                    var audioUrl = URL.createObjectURL(audioBlob);
                    var audio = new Audio(audioUrl);
                    audio.controls = true;
                    chatMessages.appendChild(audio);

                    playButton.disabled = false;
                    stopRecordButton.disabled = true;
                    recordButton.disabled = false;
                    recordingIndicator.textContent = '';
                };

                stopRecordButton.disabled = false;
                recordButton.disabled = true;
                recordingIndicator.textContent = 'Идет запись...';
            })
            .catch(function (err) {
                console.error('Error recording audio: ', err);
            });
    };

    stopRecordButton.onclick = function () {
        if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        }
    };

    playButton.onclick = function () {
        var audioElements = chatMessages.getElementsByTagName('audio');
        if (audioElements.length > 0) {
            audioElements[audioElements.length - 1].play();
        }
    };

    function sendMessage(text) {
        if (text !== '') {
            appendMessage('Вы', text);
            messageInput.value = '';

            // Генерация ответа на основе ключевых слов
            var response = generateResponse(text);
            if (response !== '') {
                setTimeout(function () {
                    appendMessage('Автор', response);
                }, 1000); // Добавим небольшую задержку для имитации обработки
            }
        }
    }

    function appendMessage(sender, text) {
        var messageDiv = document.createElement('div');
        messageDiv.textContent = sender + ': ' + text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function generateResponse(message) {
        // Простой пример генерации ответа на основе ключевых слов
        var keywords = {
            'привет': 'Привет! Как у тебя дела?',
            'дела': 'У меня все отлично, спасибо за вопрос! Как тебя зовут?',
            'зовут':'Меня зовут Иванов Евгений, я студент образовательной программы ПМ в высшей школе экономики!'
        };

        for (var keyword in keywords) {
            if (message.toLowerCase().includes(keyword)) {
                return keywords[keyword];
            }
        }
        return '';
    }
};