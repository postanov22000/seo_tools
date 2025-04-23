<body>
    
// Set a cookie with name, value, and expiration days
function setCookie(name, value, daysToLive) {
    const date = new Date();
    date.setTime(date.getTime() + (daysToLive * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`;
}

// Get a cookie by name
function getCookie(name) {
    const cookieDecoded = decodeURIComponent(document.cookie);
    const cookieArray = cookieDecoded.split('; ');
    let result = null;
    
    cookieArray.forEach(cookie => {
        if (cookie.indexOf(name + '=') === 0) {
            result = cookie.substring(name.length + 1);
        }
    });
    return result;
}

// Delete a cookie by name
function deleteCookie(name) {
    setCookie(name, null, -1);
}
// Store user's name
function saveUserName(name) {
    setCookie('user_name', name, 30);
    updateGreeting(name);
}

function updateGreeting(name) {
    const greetingElement = document.getElementById('user-greeting');
    if (greetingElement) {
        greetingElement.textContent = `Welcome back, ${name}!`;
    }
}

// Check for saved name on load
window.addEventListener('DOMContentLoaded', function() {
    const userName = getCookie('user_name');
    if (userName) {
        updateGreeting(userName);
    }
});
// Example: Remember if user dismissed a banner
function dismissBanner() {
    setCookie('banner_dismissed', 'true', 7);
    document.getElementById('promo-banner').style.display = 'none';
}

// Check if banner was dismissed
window.addEventListener('DOMContentLoaded', function() {
    if (getCookie('banner_dismissed') === 'true') {
        document.getElementById('promo-banner').style.display = 'none';
    }
});
// Cookie consent functions
function showCookieConsent() {
    if (!getCookie('cookie_consent')) {
        document.getElementById('cookie-consent-banner').style.display = 'block';
    }
}

function acceptCookies() {
    setCookie('cookie_consent', 'true', 365);
    document.getElementById('cookie-consent-banner').style.display = 'none';
    // Now you can set your other cookies
}

function rejectCookies() {
    setCookie('cookie_consent', 'false', 365);
    document.getElementById('cookie-consent-banner').style.display = 'none';
    // Delete all non-essential cookies
    deleteCookie('user_theme');
    deleteCookie('user_name');
    // ... other non-essential cookies
}

// Show consent banner if no decision made
window.addEventListener('DOMContentLoaded', showCookieConsent);
</body>
