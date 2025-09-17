const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");
let isTyping = false;

// Sidebar toggle functionality
function toggleSidebar() {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('show');
}

// Close sidebar when clicking overlay
sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('show');
});

// Close sidebar on window resize if screen becomes large
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('show');
    }
});

// Auto-resize textarea
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 200) + 'px';
});

// Send message on Enter (but not Shift+Enter)
userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
    }
});

function formatTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function showTypingIndicator() {
    if (isTyping) return;
    isTyping = true;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing-message';
    typingDiv.innerHTML = `
    <div class="message-header">
        <div class="message-author">Rose</div>
    </div>
    <div class="typing-indicator">
        <div class="typing-dots">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        </div>
        Thinking...
    </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingMessage = document.querySelector('.typing-message');
    if (typingMessage) {
    typingMessage.remove();
    }
    isTyping = false;
}

function addMessage(content, isUser, isError = false, meta = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}${isError ? ' error-message' : ''}`;
    
    const authorName = isUser ? 'You' : 'Rose';
    
    let metaHtml = '';
    if (meta && !isUser) {
    metaHtml = `<div class="message-meta">Topic: ${meta.topic} | Summary: ${meta.summary}</div>`;
    }
    
    messageDiv.innerHTML = `
    <div class="message-header">
        <div class="message-author">${authorName}</div>
        <div class="message-time">${formatTime()}</div>
    </div>
    <div class="message-content">${content}</div>
    ${metaHtml}
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function loadChatHistory() {
    try {
        const response = await fetch("/history");
        const history = await response.json();

        history.forEach(msg => {
            const meta = (!msg.topic || !msg.summary) ? null : { topic: msg.topic, summary: msg.summary };
            addMessage(msg.content, msg.role === "human", false, meta);
        });

        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        console.error("Failed to load history:", error);
    }
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message || isTyping) return;

    // Disable input and button
    userInput.disabled = true;
    sendBtn.disabled = true;

    // Add user message
    addMessage(message, true);
    userInput.value = "";
    userInput.style.height = 'auto';

    // Show typing indicator
    showTypingIndicator();

    try {
    const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });

    const data = await response.json();
    
    hideTypingIndicator();

    if (data.error) {
        addMessage(`Error: ${data.error}`, false, true);
    } else {
        addMessage(data.reply, false, false, { topic: data.topic, summary: data.summary });
    }
    } catch (error) {
    hideTypingIndicator();
    addMessage(`Connection error: ${error.message}`, false, true);
    } finally {
    // Re-enable input and button
    userInput.disabled = false;
    sendBtn.disabled = false;
    userInput.focus();
    }
}

async function getUserInfo() {
    const username = document.getElementById("username");
    try {
    const response = await fetch("/api/userinfo");
    const data = await response.json();
    if (data.username) {
        username.textContent = data.username;
    } else {
        username.textContent = "Guest";
    }
    } catch (error) {
    console.error("Failed to fetch user info:", error);
    username.textContent = "Guest";
    }
}

function LogOut() {
    setInterval(() => {
        window.location.href = '/logout';
    }, 1000);
}

// Focus input on page load
window.addEventListener('load', () => {
    userInput.focus();
    loadChatHistory();
    getUserInfo();
});