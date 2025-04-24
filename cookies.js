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

  static init() {
    if (this.get('cookie_consent') === 'false') {
      this.delete('user_theme');
      this.delete('user_name');
    }
  }
}

class Personalization {
  static init() {
    this.loadTheme();
    this.loadUserName();
    this.setupThemeSelector();
  }

  static loadTheme() {
    const theme = CookieManager.get('user_theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }

  static loadUserName() {
    const name = CookieManager.get('user_name');
    if (name && document.getElementById('user-greeting')) {
      document.getElementById('user-greeting').textContent = `Welcome back, ${name}!`;
    }
  }

  static setupThemeSelector() {
    document.querySelectorAll('[data-theme]').forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        document.documentElement.setAttribute('data-theme', theme);
        CookieManager.set('user_theme', theme, 365, false);
      });
    });
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
    const configBtn = document.getElementById('configure-cookies');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        CookieManager.set('cookie_consent', 'true', 365, true);
        this.hideBanner();
        Personalization.init();
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', () => {
        CookieManager.set('cookie_consent', 'false', 365, true);
        this.hideBanner();
        CookieManager.delete('user_theme');
        CookieManager.delete('user_name');
      });
    }

    if (configBtn) {
      configBtn.addEventListener('click', () => {
        alert('Cookie preferences configuration would appear here');
      });
    }
  }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  CookieManager.init();
  CookieConsent.init();
  
  if (CookieManager.getConsent()) {
    Personalization.init();
  }
});
