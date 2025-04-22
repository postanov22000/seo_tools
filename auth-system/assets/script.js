// GitHub authentication handler
const GITHUB_TOKEN = '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'; // Generate in GitHub Settings > Developer Settings
const REPO = 'postanov22000/auth-system'; // e.g., 'yourusername/auth-system'

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
    const currentUser = localStorage.getItem('currentUser');
    const currentPath = window.location.pathname;
    
    // If user is logged in
    if (currentUser) {
        // Redirect to dashboard if trying to access auth pages
        if (currentPath.endsWith('login.html') || currentPath.endsWith('index.html')) {
            window.location.href = 'dashboard.html';
        }
        
        // If on dashboard, parse and display user data
        if (currentPath.endsWith('dashboard.html')) {
            try {
                const user = JSON.parse(currentUser);
                document.getElementById('userInfo').innerHTML = `
                    <p>Name: ${user.name}</p>
                    <p>Email: ${user.email}</p>
                    <p>Member since: ${new Date(user.createdAt).toLocaleDateString()}</p>
                `;
            } catch (e) {
                console.error("Error parsing user data:", e);
                logout();
            }
        }
    }
    // If user is not logged in
    else {
        // Redirect to login if trying to access protected pages
        if (currentPath.endsWith('dashboard.html')) {
            window.location.href = 'login.html';
        }
    }
}
function logout() {
    localStorage.removeItem('currentUser');
    
    // For GitHub Pages deployment
    if (window.location.pathname.includes('github.io')) {
        window.location.href = '/<repo-name>/login.html';
    } else {
        window.location.href = 'login.html';
    }
}
async function handleLogin(event) {
    event.preventDefault();
    
    const loginData = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };
    
    try {
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
                    action: 'login',
                    data: loginData
                }
            })
        });

        if (!response.ok) throw new Error('Login request failed');
        
        // Wait for GitHub Action to process (simulate async)
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Verify login by checking users.json
        const usersResponse = await fetch(`https://raw.githubusercontent.com/${REPO}/main/data/users.json`);
        const users = await usersResponse.json();
        const user = users.find(u => u.email === loginData.email);
        
        if (user) {
            // Store minimal user data in localStorage
            localStorage.setItem('currentUser', JSON.stringify({
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }));
            window.location.href = 'dashboard.html';
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please check your credentials.');
    }
}

// Run check on page load
checkAuth();
