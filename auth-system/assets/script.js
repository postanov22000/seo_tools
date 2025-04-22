// GitHub authentication handler
const GITHUB_TOKEN = 'YOUR_PERSONAL_ACCESS_TOKEN'; // Generate in GitHub Settings > Developer Settings
const REPO = 'YOUR_USERNAME/YOUR_REPO'; // e.g., 'yourusername/auth-system'

async function handleAuthRequest(action, data) {
    const response = await fetch(`https://api.github.com/repos/${REPO}/dispatches`, {
        method: 'POST',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.everest-preview+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            event_type: 'auth_request',
            client_payload: {
                action: action,
                data: data
            }
        })
    });
    
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    
    // Wait for the action to complete (simplified - in reality you'd need to poll)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get the latest commit to see changes
    const commits = await fetch(`https://api.github.com/repos/${REPO}/commits`, {
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`
        }
    }).then(r => r.json());
    
    return commits[0];
}

async function handleSignup(event) {
    event.preventDefault();
    
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    
    try {
        await handleAuthRequest('signup', userData);
        alert('Signup successful! Please login.');
        window.location.href = 'login.html';
    } catch (error) {
        alert('Error during signup: ' + error.message);
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const loginData = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };
    
    try {
        const result = await handleAuthRequest('login', loginData);
        const commitMessage = result.commit.message;
        
        if (commitMessage.includes('user_data')) {
            // Extract user data from commit message (simplified)
            const userData = JSON.parse(commitMessage.split('user_data=')[1].split(' ')[0]);
            localStorage.setItem('currentUser', JSON.stringify(userData));
            window.location.href = 'dashboard.html';
        } else {
            alert('Login failed. Please check your credentials.');
        }
    } catch (error) {
        alert('Error during login: ' + error.message);
    }
}

// Check if user is logged in
function checkAuth() {
    if (localStorage.getItem('currentUser') && !window.location.pathname.endsWith('dashboard.html')) {
        window.location.href = 'dashboard.html';
    } else if (!localStorage.getItem('currentUser') && window.location.pathname.endsWith('dashboard.html')) {
        window.location.href = 'login.html';
    }
}

// Run check on page load
checkAuth();
