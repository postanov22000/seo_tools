class CookieManager {
  static set(name, value, days = 365, essential = false) {
    if (!essential && !this.getConsent()) return false;
    
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
    return true;
  }

  static get(name) {
    const cookies = decodeURIComponent(document.cookie).split('; ');
    for (const cookie of cookies) {
      const [cookieName, ...cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return cookieValue.join('=');
      }
    }
    return null;
  }

  static delete(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  static getConsent() {
    return this.get('cookie_consent') === 'true';
  }
}

class CookieConsent {
  static init() {
    if (CookieManager.get('cookie_consent') === null) {
      this.showBanner();
    }
    this.setupEventListeners();
  }

  static showBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) banner.style.display = 'block';
  }

  static hideBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) banner.style.display = 'none';
  }

  static setupEventListeners() {
    const acceptBtn = document.getElementById('accept-cookies');
    const rejectBtn = document.getElementById('reject-cookies');
    
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        CookieManager.set('cookie_consent', 'true', 365, true);
        this.hideBanner();
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', () => {
        CookieManager.set('cookie_consent', 'false', 365, true);
        this.hideBanner();
      });
    }
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  CookieConsent.init();
});
