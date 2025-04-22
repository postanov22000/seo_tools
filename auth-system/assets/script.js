async function handleSignup(event) {
    event.preventDefault();

    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    const payload = {
        event_type: "auth_request",
        client_payload: {
            action: "signup",
            data: {
                email,
                password
            }
        }
    };

    const res = await fetch("https://api.github.com/repos/your-username/your-repo-name/dispatches", {
        method: "POST",
        headers: {
            "Authorization": "Bearer YOUR_GITHUB_PAT", // Replace this!
            "Accept": "application/vnd.github.everest-preview+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const message = document.getElementById("signupMessage");
    if (res.ok) {
        message.innerText = "Signup request sent!";
    } else {
        message.innerText = "Signup failed.";
        console.error(await res.text());
    }
}

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const payload = {
        event_type: "auth_request",
        client_payload: {
            action: "login",
            data: {
                email,
                password
            }
        }
    };

    const res = await fetch("https://api.github.com/repos/your-username/your-repo-name/dispatches", {
        method: "POST",
        headers: {
            "Authorization": "Bearer YOUR_GITHUB_PAT", // Replace this!
            "Accept": "application/vnd.github.everest-preview+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const message = document.getElementById("loginMessage");
    if (res.ok) {
        message.innerText = "Login request sent!";
    } else {
        message.innerText = "Login failed.";
        console.error(await res.text());
    }
}
