// Chatbot section 
const markedScript = document.createElement('script');
markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
document.head.appendChild(markedScript);

let chatHistory = [{ role: "user", content: "Sekarang nama kamu adalah alita, assistant virtual yang dirancang untuk membantu menjawab pertanyaan dan memberikan informasi, tidak perlu mencontohkan cara berkomunikasi atau bertanya antara user dan you, jawablah pertanyaan layaknya manusia, gunakan aku dan kamu untuk mengganti kata saya dan anda, gunakan gaya bahasa yang santai dan tidak formal" }];
let hasMessages = false;
let isWaitingForResponse = false;
let previousActionButtons = null;

const textInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatForm = document.getElementById('chatForm');
const chatContainer = document.getElementById('chatContainer');
const commandList = document.getElementById('commandList');
const commandListItems = document.getElementById('commandListItems');

function selectCommand(command) {
  textInput.value = command;
  commandList.style.display = 'none';
  textInput.focus();
}
const commands = [
  { command: '/help', description: 'Get help' }
];


function renderCommandList(filteredCommands) {
  commandListItems.innerHTML = filteredCommands.map(cmd => `<li onclick="selectCommand('${cmd.command}')"><strong>${cmd.command}</strong><p class="text-xs">${cmd.description}</p></li>`).join('');
}
document.addEventListener('DOMContentLoaded', () => {
  if (chatForm && textInput && sendButton) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleSubmit();
    });

    textInput.addEventListener('input', function () {
      const value = this.value;
      if (value.startsWith('/')) {
        const filteredCommands = commands.filter(cmd => cmd.command.startsWith(value));
        if (filteredCommands.length > 0) {
          renderCommandList(filteredCommands);
          commandList.style.display = 'block';
        } else {
          commandList.style.display = 'none';
        }
      } else {
        commandList.style.display = 'none';
      }

      this.style.height = "auto";
      this.style.height = Math.min(this.scrollHeight, 150) + "px";
      updateSendButtonState();
    });

    textInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendButton.click();
      }
    });

    document.addEventListener('click', function (event) {
      if (!commandList.contains(event.target) && !textInput.contains(event.target)) {
        commandList.style.display = 'none';
      }
    });

    function updateSendButtonState() {
      if (textInput.value.trim() !== "") {
        sendButton.classList.remove('hidden');
      } else {
        sendButton.classList.add('hidden');
      }
    }
    function addMessage(message, type, imageUrl = null) {
      if (!hasMessages) {
        const initialState = document.getElementById('initialState');
        if (initialState) {
          initialState.classList.add('hidden');
        }
        hasMessages = true;
      }

      if (previousActionButtons) {
        previousActionButtons.remove();
        previousActionButtons = null;
      }

      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${type}`;

      const bubbleDiv = document.createElement('div');
      bubbleDiv.className = `message-bubble ${type === 'user' ? 'bg-gray-100' : ''}`;

      if (type === 'ai' && message === 'Thinking...') {
        const loadingDots = document.createElement('div');
        loadingDots.className = 'loading-dots';
        loadingDots.innerHTML = 'Typing <span></span><span></span><span></span>';
        bubbleDiv.appendChild(loadingDots);
      } else if (type === 'ai') {
        const contentDiv = document.createElement('div');
        contentDiv.className = 'flex flex-col gap-3';

        marked.setOptions({
          breaks: true,
          gfm: true,
          headerIds: false,
          mangle: false
        });
        const textDiv = document.createElement('div');
        textDiv.innerHTML = marked.parse(message);

        textDiv.querySelectorAll('pre').forEach(preBlock => {
          const codeBlock = preBlock.querySelector('code');
          const wrapper = document.createElement('div');
          wrapper.className = 'relative';
          preBlock.parentNode.insertBefore(wrapper, preBlock);
          wrapper.appendChild(preBlock);
          codeBlock.className = 'p-4 block bg-gray-100 rounded-xl overflow-x-auto no-scrollbar';

          const copyButton = document.createElement('button');
          copyButton.innerHTML = '<span class="material-icons text-white" style="font-size: 1rem">content_copy</span>';
          copyButton.className = 'absolute top-2 right-2 p-1.5 bg-gray-200 rounded-md transition';
          copyButton.addEventListener('click', () => {
            const code = codeBlock.textContent;
            navigator.clipboard.writeText(code).then(() => {
              copyButton.innerHTML = '<span class="material-icons text-gray-700" style="font-size: 1rem">check</span>';
              copyButton.title = 'Copied!';
              setTimeout(() => {
                copyButton.innerHTML = '<span class="material-icons text-gray-700" style="font-size: 1rem">content_copy</span>';
                copyButton.title = '';
              }, 1500);
            }).catch(err => {
              console.error('Failed to copy: ', err);
            });
          });
          codeBlock.appendChild(copyButton);
        });

        textDiv.querySelectorAll('p').forEach(p => { p.className = 'mb-4 last:mb-0'; });
        textDiv.querySelectorAll('ul, ol').forEach(list => { list.className = 'mb-4 pl-6'; });
        textDiv.querySelectorAll('li').forEach(item => { item.className = 'mb-2 last:mb-0'; });
        textDiv.querySelectorAll('blockquote').forEach(quote => { quote.className = 'border-l-4 border-gray-200 pl-4 my-4 italic'; });

        contentDiv.appendChild(textDiv);
        bubbleDiv.appendChild(contentDiv);

        if (type === 'ai' && message !== 'Thinking...') {
          const actionButtons = document.createElement('div');
          actionButtons.className = 'flex gap-3 mt-3 justify-start';

          const copyButton = document.createElement('button');
          copyButton.innerHTML = '<span class="material-icons text-white" style="font-size: 1rem;">content_copy</span>';
          copyButton.title = 'Copy message';
          copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(message).then(() => {
              modalAlert('Message copied to clipboard');
            }).catch(err => {
              console.error('Failed to copy: ', err);
              modalAlert('Failed to copy message');
            });
          });

          actionButtons.appendChild(copyButton);
          bubbleDiv.appendChild(actionButtons);

          previousActionButtons = actionButtons;
        }
      } else {
        bubbleDiv.textContent = message;
      }

      messageDiv.appendChild(bubbleDiv);
      chatContainer.appendChild(messageDiv);
      chatContainer.scrollTop = chatContainer.scrollHeight;

      if (type === 'ai' && message === 'Thinking...') {
        messageDiv.scrollIntoView({ behavior: 'smooth' });
      }
      return messageDiv;
    }
    async function handleSubmit() {
      if (isWaitingForResponse) return;

      const message = textInput.value.trim();
      if (!message) return;

      isWaitingForResponse = true;
      updateSendButtonState();

      addMessage(message, 'user');
      const loadingMessage = addMessage('Thinking...', 'ai');

      textInput.value = '';
      updateSendButtonState();
      textInput.style.height = '20px';

      try {
        chatHistory.push({ role: "user", content: message });

        try {
          const blackbox = await (await fetch('/api/blackbox', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              prompt: message,
              history: chatHistory
            })
          })).json()
          let text = ""
          if (blackbox.search[0]) {
            text += blackbox.search.slice(0, 3).map((v) => `<blockquote class="flex items-center"> <a href="${v.link}"><strong>${v.title}</strong></a></blockquote>`).join("\n")
          }
          const data = await (await fetch('/api/gpt', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              prompt: blackbox.status ? `Perbaiki kalimat ini tanpa menambahkan kalimat baru!\n${blackbox.message}` : message,
              history: chatHistory
            })
          })).json()
          if (data.status) {
            chatHistory.push({ content: data.message + `\n\n${text}`, role: "assistant" });
            addMessage(data.message + `\n\n${text}`, 'ai');
          } else {
            addMessage('Error: ' + (data.error || 'Something went wrong'), 'ai');
            console.error(data)
          }
        } catch (error) {
          addMessage('Error: ' + error.message, 'ai');
          console.error(error)
        }
      } catch (error) {
        addMessage('Error: ' + error.message, 'ai');
        console.error(error)
      } finally {
        loadingMessage.remove();
        isWaitingForResponse = false;
      }
    }
    document.addEventListener('DOMContentLoaded', () => {
      updateSendButtonState();
    });
    document.querySelectorAll('.suggestion-bubble').forEach(bubble => {
      bubble.addEventListener('click', function () {
        textInput.value = this.textContent.trim();
        textInput.focus();
        updateSendButtonState();
      });
    });
  }
});
// end chatbot 

// statistik data
async function fetchVisitorData() {
  const response = await fetch('/tes');
  const data = await response.json();
  let visit = document.getElementById('total-visitors')
  let request = document.getElementById('total-request')
  let endpoint = document.getElementById('total-endpoint')
  if (!visit) return
  visit.innerText = data.config.visitor;
  request.innerText = data.config.request;
  endpoint.innerText = data.config.endpoint;
}
document.addEventListener('DOMContentLoaded', fetchVisitorData);
// statistik data

// dropdown menu 
function toggleDropdown() {
  const dropdown = document.getElementById('dropdown');
  const icon = document.getElementById('dropdown-icon');
  dropdown.classList.toggle('open');
  if (dropdown.classList.contains('open')) {
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-times');
  } else {
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
  }
}
function closeDropdown(event) {
  const dropdown = document.getElementById('dropdown');
  const icon = document.getElementById('dropdown-icon');
  if (!dropdown.contains(event.target)) {
    dropdown.classList.remove('open');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
  }
}
document.addEventListener('click', closeDropdown);
// dropdown menu 

// api documentation 
function searchAPI() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const apiSections = document.querySelectorAll('.api-section');
  apiSections.forEach(section => {
    const title = section.querySelector('h3').innerText.toLowerCase();
    if (title.includes(input)) {
      section.style.display = 'block';
    } else {
      section.style.display = 'none';
    }
  });
}
function toggleDocumentation(id, iconId) {
  const doc = document.getElementById(id);
  const icon = document.getElementById(iconId);
  doc.classList.toggle('hidden');
  if (doc.classList.contains('hidden')) {
    icon.classList.remove('fa-times');
    icon.classList.add('fa-chevron-down');
  } else {
    icon.classList.remove('fa-chevron-down');
    icon.classList.add('fa-times');
  }
}
function closeAllDocumentation(event) {
  const docs = document.querySelectorAll('.documentation');
  const icons = document.querySelectorAll('.toggle-icon');
  docs.forEach(doc => {
    if (!doc.contains(event.target)) {
      doc.classList.add('hidden');
    }
  });
  icons.forEach(icon => {
    icon.classList.remove('fa-times');
    icon.classList.add('fa-chevron-down');
  });
}
document.addEventListener('click', function (event) {
  const isClickInside = event.target.closest('.api-section');
  if (!isClickInside) {
    closeAllDocumentation(event);
  }
});
// api documentation