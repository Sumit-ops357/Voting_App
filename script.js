// DOM Elements
const createPollForm = document.getElementById('createPollForm');
const optionsContainer = document.getElementById('optionsContainer');
const addOptionButton = document.getElementById('addOption');
const pollsList = document.getElementById('pollsList');

// API URL
const API_URL = 'http://localhost:5000';

// Add new option input field
addOptionButton.addEventListener('click', () => {
    const newOption = document.createElement('input');
    newOption.type = 'text';
    newOption.className = 'option-input';
    newOption.placeholder = `Option ${optionsContainer.children.length + 1}`;
    newOption.required = true;
    optionsContainer.appendChild(newOption);
});

// Handle form submission
createPollForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const question = document.getElementById('question').value;
    const optionInputs = document.querySelectorAll('.option-input');
    const options = Array.from(optionInputs).map(input => ({
        text: input.value,
        votes: 0
    }));

    try {
        const response = await fetch(`${API_URL}/api/polls`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question, options })
        });

        if (response.ok) {
            createPollForm.reset();
            fetchPolls();
        } else {
            throw new Error('Failed to create poll');
        }
    } catch (error) {
        console.error('Error creating poll:', error);
        alert('Failed to create poll. Please try again.');
    }
});

// Fetch and display polls
async function fetchPolls() {
    try {
        const response = await fetch(`${API_URL}/api/polls`);
        const polls = await response.json();
        displayPolls(polls);
    } catch (error) {
        console.error('Error fetching polls:', error);
        pollsList.innerHTML = '<p>Error loading polls. Please try again later.</p>';
    }
}

// Display polls in the UI
function displayPolls(polls) {
    pollsList.innerHTML = '';
    polls.forEach(poll => {
        const pollElement = createPollElement(poll);
        pollsList.appendChild(pollElement);
    });
}

// Create poll element
function createPollElement(poll) {
    const div = document.createElement('div');
    div.className = 'poll-item';
    
    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
    
    const optionsHtml = poll.options.map(option => {
        const percentage = totalVotes > 0 ? (option.votes / totalVotes * 100).toFixed(1) : 0;
        return `
            <div class="poll-option">
                <button onclick="votePoll('${poll._id}', '${option._id}')" 
                        class="vote-button">
                    ${option.text}
                </button>
                <div class="vote-bar">
                    <div class="vote-progress" style="width: ${percentage}%"></div>
                    <span>${option.votes} votes (${percentage}%)</span>
                </div>
            </div>
        `;
    }).join('');

    div.innerHTML = `
        <h3>${poll.question}</h3>
        <div class="options-container">
            ${optionsHtml}
        </div>
        <p class="total-votes">Total votes: ${totalVotes}</p>
    `;
    
    return div;
}

// Handle voting
async function votePoll(pollId, optionId) {
    try {
        const response = await fetch(`${API_URL}/api/polls/${pollId}/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ optionId })
        });

        if (response.ok) {
            fetchPolls();
        } else {
            throw new Error('Failed to vote');
        }
    } catch (error) {
        console.error('Error voting:', error);
        alert('Failed to vote. Please try again.');
    }
}

// Initial load
fetchPolls();