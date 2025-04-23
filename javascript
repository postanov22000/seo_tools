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
