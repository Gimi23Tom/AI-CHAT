document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // פונקציה להוספת הודעה לתיבת הצ'אט
    function addMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        messageElement.innerHTML = `<p>${message}</p>`;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // גלילה אוטומטית למטה
    }

    // פונקציה לשליחת הודעה לשרת הבינה המלאכותית
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return; // לא שולחים הודעה ריקה

        addMessage(message, 'user');
        userInput.value = ''; // ניקוי שדה הקלט

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message }),
            });

            const data = await response.json();
            addMessage(data.message, 'bot');

        } catch (error) {
            console.error('Error sending message:', error);
            addMessage('אירעה שגיאה. אנא נסה שוב מאוחר יותר.', 'bot');
        }
    }

    // אירועים
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});