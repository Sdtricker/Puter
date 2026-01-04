document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const modelList = document.getElementById('model-list');
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const currentModelName = document.getElementById('current-model-name');
    const currentModelIcon = document.getElementById('current-model-icon');
    const typingIndicator = document.getElementById('typing-indicator');
    const clearChatBtn = document.getElementById('clear-chat');

    // State
    let currentModel = null;
    let chatHistory = [];

    // Initialize
    fetchModels();
    setupEventListeners();

    // Fetch Models
    async function fetchModels() {
        try {
            const response = await fetch('/models');
            const models = await response.json();
            
            renderModels(models);
            
            // Set default model
            if (models.length > 0) {
                setModel(models[0]);
            }
        } catch (error) {
            console.error('Failed to fetch models:', error);
            modelList.innerHTML = '<div style="padding:1rem; color:red;">Error loading models</div>';
        }
    }

    // Render Models
    function renderModels(models) {
        modelList.innerHTML = '';
        models.forEach(model => {
            const btn = document.createElement('button');
            btn.className = 'model-btn';
            btn.dataset.id = model.id;
            btn.innerHTML = `
                <span class="model-icon">${model.icon}</span>
                <span class="model-name">${model.name}</span>
            `;
            btn.addEventListener('click', () => setModel(model));
            modelList.appendChild(btn);
        });
    }

    // Set Active Model
    function setModel(model) {
        currentModel = model;
        
        // Update UI
        document.querySelectorAll('.model-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.id === model.id) btn.classList.add('active');
        });
        
        currentModelName.textContent = model.name;
        currentModelIcon.textContent = model.icon;
    }

    // Setup Listeners
    function setupEventListeners() {
        sendBtn.addEventListener('click', sendMessage);
        
        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Auto-resize textarea
        userInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });

        clearChatBtn.addEventListener('click', () => {
            chatContainer.innerHTML = `
                <div class="welcome-message">
                    <h1>Welcome to Nexus AI</h1>
                    <p>Select a model from the left and start creating.</p>
                </div>
            `;
            chatHistory = [];
        });
    }

    // Send Message
    async function sendMessage() {
        const text = userInput.value.trim();
        if (!text || !currentModel) return;

        // Clear input
        userInput.value = '';
        userInput.style.height = 'auto';

        // Remove welcome message if exists
        const welcome = document.querySelector('.welcome-message');
        if (welcome) welcome.remove();

        // Add User Message
        addMessage(text, 'user');
        chatHistory.push({ role: 'user', content: text });

        // Show Loading
        typingIndicator.classList.remove('hidden');

        try {
            // Using Puter.js directly as requested by user (no API key needed)
            // puter.ai.chat(prompt, options)
            
            // Format messages for Puter.js
            // If Puter.js supports chat history in its .chat method directly:
            // The docs say puter.ai.chat(prompt, { model: '...' })
            // For multi-turn, we might need to send the full history string or an array if supported.
            // Based on user example, it's simple prompt. We will concat history for context if needed, 
            // but let's try sending just the prompt or look for multi-turn support.
            // For now, let's send the last user message as the prompt, 
            // and maybe prepend previous context if we want to be fancy.
            
            // Simple approach: Send current text
            const response = await puter.ai.chat(text, { model: currentModel.id });
            
            // Hide Loading
            typingIndicator.classList.add('hidden');
            
            // Extract text from Puter response object
            // User example: .then(puter.print) which logs it.
            // We need the string. Usually response is an object or string.
            // Let's inspect it or assume it has a toString or .message field.
            // Based on typical Puter.js usage, response can be the object.
            
            let aiText = "";
            if (typeof response === 'string') {
                aiText = response;
            } else if (response && response.message && response.message.content) {
                aiText = response.message.content;
            } else {
                 // Fallback
                 aiText = JSON.stringify(response);
            }

            // Add AI Message
            addMessage(aiText, 'ai');
            chatHistory.push({ role: 'assistant', content: aiText });

        } catch (error) {
            typingIndicator.classList.add('hidden');
            addMessage('System Error: Failed to connect to backend.', 'ai');
            console.error(error);
        }
    }

    // Add Message to UI
    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `message ${sender}`;
        
        const icon = sender === 'ai' ? currentModel.icon : '<i class="fa-solid fa-user"></i>';
        
        // Simple markdown parsing (bold, code blocks) could be added here
        // For now, just preserving newlines
        const formattedText = text.replace(/\n/g, '<br>');

        div.innerHTML = `
            <div class="avatar ${sender}">${icon}</div>
            <div class="message-content">${formattedText}</div>
        `;
        
        chatContainer.appendChild(div);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
});
