(function() {
  'use strict';

  // Configuration constants.
const CONFIG = {
  SALESFORCE_ORG_ID: '00D200000000gKF',
  SALESFORCE_DEPLOYMENT: 'Support_Messaging',
  SALESFORCE_ENDPOINT: 'https://altium.my.site.com/ESWSupportMessaging1750807287737',
  SALESFORCE_SCRT_URL: 'https://altium.my.salesforce-scrt.com',
  BASE_URL: 'https://www.altium.com',
  API_PATH: '/live-altium/isloggedin',
  MAX_RETRIES: 5,
  RETRY_DELAY: 1000,
  INIT_DELAY: 2000,
  API_TIMEOUT: 5000,
  DEBUG: false,
  COOKIE_NAME: 'ALU_UID_3'
};

// Logger utility.
const Logger = {
  debug: (message, data = null) => {
    if (!CONFIG.DEBUG) return;
    console.log(`[Salesforce Chat][DEBUG] ${message}`, data || '');
  },
  info: (message, data = null) => {
    console.log(`[Salesforce Chat][INFO] ${message}`, data || '');
  },
  warn: (message, data = null) => {
    console.warn(`[Salesforce Chat][WARN] ${message}`, data || '');
  },
  error: (message, error = null) => {
    console.error(`[Salesforce Chat][ERROR] ${message}`, error || '');
  }
};

// Cleanup manager.
const CleanupManager = {
  timeouts: new Set(),
  listeners: new Map(),
  abortControllers: new Set(),

  addTimeout: (timeoutId) => {
    CleanupManager.timeouts.add(timeoutId);
    return timeoutId;
  },

  clearTimeout: (timeoutId) => {
    clearTimeout(timeoutId);
    CleanupManager.timeouts.delete(timeoutId);
  },

  addListener: (element, event, handler) => {
    element.addEventListener(event, handler);
    const key = `${element}-${event}`;
    CleanupManager.listeners.set(key, { element, event, handler });
  },

  addAbortController: (controller) => {
    CleanupManager.abortControllers.add(controller);
    return controller;
  },

  cleanup: () => {
    // Clear all timeouts.
    CleanupManager.timeouts.forEach(timeout => clearTimeout(timeout));
    CleanupManager.timeouts.clear();

    // Remove all listeners.
    CleanupManager.listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    CleanupManager.listeners.clear();

    // Abort all fetch requests.
    CleanupManager.abortControllers.forEach(controller => {
      controller.abort();
    });
    CleanupManager.abortControllers.clear();

    Logger.debug('Cleanup completed');
  }
};


  // Function to read a cookie by name.
  function getCookie(name) {
    const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([$?*|{}\]\\\/+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  // Read ALU_UID_3 cookie.
  const aluUid = getCookie(CONFIG.COOKIE_NAME);

  // Determine authenticated session based on cookie presence.
  const AuthenticatedSession = aluUid ? "Yes" : "No";

  // accountID from cookie or null.
  const accountID = aluUid || null;

  // Generate a UUID for contactID.
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  const contactID = generateUUID();

  // Store user context globally.
  window.chatbotUserContext = {
    AuthenticatedSession,
    contactID,
    accountID
  };

  Logger.info('Chatbot user context initialized', window.chatbotUserContext);

  // Function to check user data via API.
  function checkUserData() {
    return new Promise((resolve, reject) => {
      const abortController = new AbortController();
      CleanupManager.addAbortController(abortController);

      const timeoutId = setTimeout(() => {
        abortController.abort();
        reject(new Error('API request timeout'));
      }, CONFIG.API_TIMEOUT);

      const apiUrl = CONFIG.BASE_URL + CONFIG.API_PATH;

      fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include',
        mode: 'cors',
        signal: abortController.signal
      })
      .then(response => {
        clearTimeout(timeoutId);
        CleanupManager.abortControllers.delete(abortController);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        Logger.debug('API response received', data);
        resolve(data);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        CleanupManager.abortControllers.delete(abortController);

        if (error.name === 'AbortError') {
          Logger.error('API request was aborted');
        } else {
          Logger.error('API request failed', error);
        }
        reject(error);
      });
    });
  }

  // Function to launch chat with retry logic.
  let retryTimeoutId = null;

  function launchChatWithRetry(retries = CONFIG.MAX_RETRIES, delay = CONFIG.RETRY_DELAY) {
    // Clear any existing retry timeout.
    if (retryTimeoutId) {
      CleanupManager.clearTimeout(retryTimeoutId);
    }
    const attempt = () => {
      try {
        // Check if chat button exists.
        const chatButton = document.querySelector('button.embeddedMessagingConversationButton');
        if (chatButton) {
          Logger.info('Chat button found, launching chat');
          embeddedservice_bootstrap.utilAPI.launchChat();
          Logger.info('Chat launched successfully');

          // Clean URL after successful launch.
          const newUrl = window.location.pathname + window.location.search.replace(/[?&]start-chat(&|$)/, '$1').replace(/&$/, '').replace(/^\?$/, '');
          history.pushState("", document.title, newUrl || window.location.pathname);
        } else if (retries > 0) {
          Logger.debug(`Chat button not ready, retrying in ${delay}ms (${retries} retries left)`);
          retryTimeoutId = CleanupManager.addTimeout(
            setTimeout(() => launchChatWithRetry(retries - 1, delay), delay)
          );
        } else {
          Logger.error('Chat button not found after all retries');
        }
      } catch (e) {
        Logger.error('Error launching chat', e);
        if (retries > 0) {
          Logger.debug(`Retrying in ${delay}ms (${retries} retries left)`);
          retryTimeoutId = CleanupManager.addTimeout(
            setTimeout(() => launchChatWithRetry(retries - 1, delay), delay)
          );
        }
      }
    };

    attempt();
  }

  // Function to intercept specific chat link and open chat via API.
  function interceptChatLinks() {
    // Find the specific chat link.
    const chatLink = document.querySelector('div.s-img-row__chat > a');

    if (chatLink && aluUid && (location.search.includes('start-chat') || location.hash.includes('#ai-chat'))) {
      Logger.info('Chat link found and user is authenticated, adding click handler');

      const clickHandler = function(e) {
        // Prevent default link behavior.
        e.preventDefault();
        e.stopPropagation();

        Logger.info('Chat link clicked by authenticated user, opening chat via API');

        // Check if embeddedservice_bootstrap is loaded.
        if (typeof embeddedservice_bootstrap !== 'undefined' &&
            embeddedservice_bootstrap.utilAPI &&
            embeddedservice_bootstrap.utilAPI.launchChat) {
          try {
            embeddedservice_bootstrap.utilAPI.launchChat();
            Logger.info('Chat opened via API');
          } catch (error) {
            Logger.error('Error opening chat', error);
            // Fallback: navigate to the original link.
            window.location.href = chatLink.href;
          }
        } else {
          Logger.info('Chat API not ready, attempting to initialize and retry');
          // If chat is not initialized yet, initialize it and try again.
          if (!window.chatbotInitialized) {
            initializeChatbot();
          }
          // Try to launch chat after a delay.
          CleanupManager.addTimeout(
            setTimeout(() => launchChatWithRetry(), CONFIG.INIT_DELAY)
          );
        }
      };

      CleanupManager.addListener(chatLink, 'click', clickHandler);
    } else if (chatLink && !aluUid) {
      Logger.info('Chat link found but user is not authenticated, link will work normally');
    } else if (!chatLink) {
      Logger.debug('Chat link not found on this page');
    }
  }

  // Initialize embedded messaging chatbot.
  function initEmbeddedMessaging() {
    try {
      embeddedservice_bootstrap.settings.language = 'en_US';
      embeddedservice_bootstrap.init(
        CONFIG.SALESFORCE_ORG_ID,
        CONFIG.SALESFORCE_DEPLOYMENT,
        CONFIG.SALESFORCE_ENDPOINT,
        {
          scrt2URL: CONFIG.SALESFORCE_SCRT_URL
        }
      );
    } catch (err) {
      Logger.error('Error loading Embedded Messaging', err);
    }
  }

  // Listen for embedded messaging ready event and set hidden pre-chat fields.
  const onMessagingReady = () => {
    Logger.info('Received the onEmbeddedMessagingReady event');
    window.chatbotReady = true;

    // Add class to body when chat is enabled
    document.body.classList.add('ai-chat-enabled');
    Logger.info('Added ai-chat-enabled class to body');

    const iframe = document.querySelector("iframe[src*='ESWSupportMessaging']");
    if (iframe) {
      iframe.setAttribute("sandbox", "allow-scripts allow-forms allow-same-origin");
      Logger.info('Sandbox attribute added to chatbot iframe');
    } else {
      Logger.warn('Chatbot iframe not found to add sandbox attribute');
    }

    embeddedservice_bootstrap.prechatAPI.setHiddenPrechatFields({
      "AuthenticatedSession": window.chatbotUserContext.AuthenticatedSession,
      "contactID": window.chatbotUserContext.contactID,
      "accountID": window.chatbotUserContext.accountID
    });

    // Check for start-chat parameter and open chat with delay.
    if (location.search.includes('start-chat') || location.hash.includes('#ai-chat')) {
      Logger.info('Start-chat parameter found, waiting for chat to be fully initialized');

      // Wait a bit for everything to be fully ready, then try to launch.
      CleanupManager.addTimeout(
        setTimeout(() => {
          launchChatWithRetry();
        }, CONFIG.INIT_DELAY)
      );
    }
  };

  CleanupManager.addListener(window, 'onEmbeddedMessagingReady', onMessagingReady);

  // Main initialization function with user data check.
  function initializeChatbot() {
    if (window.chatbotInitialized) {
      Logger.debug('Chatbot already initialized');
      return;
    }

    // Check user data first.
    checkUserData()
      .then(function(response) {
        if (response && response.uid) {
          Logger.info('User authenticated, initializing chatbot');
          window.chatbotInitialized = true;

          // Load the bootstrap script only if user is authenticated.
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = 'https://altium.my.site.com/ESWSupportMessaging1750807287737/assets/js/bootstrap.min.js';
          script.onload = initEmbeddedMessaging;
          document.head.appendChild(script);
        } else {
          Logger.info('User not authenticated, chatbot initialization skipped');
        }
      })
      .catch(function(error) {
        Logger.error('Failed to check user data, chatbot initialization skipped', error);
      });
  }

  // Add cleanup handler.
  window.addEventListener('beforeunload', () => {
    // Remove ai-chat-enabled class on cleanup
    document.body.classList.remove('ai-chat-enabled');
    CleanupManager.cleanup();
  });

  // Start the initialization process when DOM is ready.
  function initialize() {
    initializeChatbot();
    interceptChatLinks(); // Set up link interception.
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();
