window.DriftChat = function(options) {
  this.options = {
    geoUrl: options?.geoUrl || "https://www.altium.com/geoip",
    sessionId: options?.sessionId || "geoip",
  };

  this.init = function() {
    this.injectStyles();
    this.createButton();
    this.createChatWrapper();

    const oldButtons = document.querySelectorAll(".chat-btn");
    oldButtons?.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        this.openChat();
      });
    });

    this.fetchGeoData().then((geoData) => {
      this.updateLinksByGeo(geoData);
    })
  };

  this.updateLinksByGeo = function(geoData) {
    const contactLinks = this.chatWrapper.querySelector('.chat-links.contact-info');
    const phoneLink = contactLinks.querySelector('a[data-phone]');
    const additionalPhoneLink = contactLinks.querySelector('a[data-additional-phone]');
    const emailLink = contactLinks.querySelector('a[data-email]');
    const contactUsLink = this.chatWrapper.querySelector('a[data-contact-us]');

    if (!geoData) {
      contactLinks.style.display = 'none';
      return;
    }

    const mainPhone = geoData?.phone || geoData?.contact_phone || undefined;
    const additionalPhone = geoData?.additional_phone || undefined;
    const email = geoData?.email || undefined;

    if (mainPhone || additionalPhone || email) {
      contactLinks.style.display = 'block';
      contactUsLink.parentNode.style.display = 'none';
    }

    if (mainPhone) {
      phoneLink.href = `tel:${mainPhone}`;
      phoneLink.innerHTML = `<span>📞</span> ${mainPhone}`;
    } else {
      phoneLink.parentNode.style.display = 'none';
    }

    if (additionalPhone) {
      additionalPhoneLink.href = `tel:${additionalPhone}`;
      additionalPhoneLink.innerHTML = `<span>📞</span> ${additionalPhone}`;
    } else {
      additionalPhoneLink.parentNode.style.display = 'none';
    }

    if (email) {
      emailLink.href = `mailto:${email}`;
      emailLink.innerHTML = `<span>✉️</span> ${email}`;
    } else {
      emailLink.parentNode.style.display = 'none';
    }
  }

  this.fetchGeoData = async () => {
    const sessionGeo = sessionStorage.getItem(this.options.sessionId);
    if (sessionGeo) {
      const geoData = JSON.parse(sessionGeo);
      if (geoData) {
        return geoData;
      }
    }

    try {
      const response = await fetch(this.options.geoUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching geo data:", error);
      return null;
    }
  };

  this.injectStyles = function() {
    const style = document.createElement("style");
    style.innerHTML = `
          .chat-button {
            font-family: Inter;
            letter-spacing: -0.03em;
            z-index: 99;
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: none;
            background-color: #F2F4F6;
            color: #111;
            font-size: 12px;
            cursor: pointer;
            outline: none;
            transition: background-color 0.3s ease, color 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          @media (min-width: 768px) {
            .chat-button {
              width: 64px;
              height: 64px;
              font-size: 18px;
            }
          }
          
          .chat-button:hover, .chat-button.opened {
            background-color: #111;
            color: #fff;
          }
          .chat-button span {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.3s ease;
          }
          .icon-default {
            opacity: 1;
          }
          .icon-alternate {
            opacity: 0;
          }

          .chat-wrapper {
            font-family: Inter;
            letter-spacing: -0.03em;
            z-index: 99;
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 248px;
            background-color: #fff;
            box-shadow: 0px -0.967px 1.935px 0px rgba(37, 42, 58, 0.10), 0px 1.935px 3.87px 0px rgba(37, 42, 58, 0.12), 0px 9.675px 29.024px 0px rgba(37, 42, 58, 0.08);
            border-radius: 12px;
            display: none;
            flex-direction: column;
            font-size: 12px;
          }
          @media (min-width: 768px) {
            .chat-wrapper {
              bottom: 108px;
              font-size: 14px;
            }
          }

          .chat-header {
            gap: 12px;
            display: flex;
            align-items: center;
            padding: 16px;
            border-bottom: 1px solid #E6EAF0;
          }
          .chat-header span {
            font-weight: 500;
          }
          .chat-header img {
            width: 24px;
            height: 24px;
          }
          @media (min-width: 768px) {
            .chat-header img {
              width: 32px;
              height: 32px;
            }
          }
          
          .chat-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            margin-left: auto;
            font-weight: 400;
            padding: 2px 8px;
            margin-right: -8px;
          }
          
          .chat-links-wrap {
            padding: 12px 16px;
          }
          @media (min-width: 768px) {
            .chat-links {
              padding: 20px;
            }
          }

          .chat-links {
            list-style: none;
            margin: 0;
            padding: 0;
          }
          
          .contact-info {
            border-bottom: 1px solid #E6EAF0;
            padding-bottom: 8px;
            margin-bottom: 8px;
          }
          
          ul.chat-links li {
            margin: 0;
            padding: 0;
          }
          
          .chat-links a {
            display: flex;
            align-items: center;
            padding: 10px 12px;
            color: #111;
            text-decoration: none;
            transition: background-color 0.3s ease;
            border-radius: 12px;
            font-weight: 500;
          }
          @media (min-width: 768px) {
            .chat-links a {
              padding: 16px 20px;
            }
          }
          
          .chat-links a:hover {
            background-color: #F2F4F6;
          }
          .chat-links a span {
            margin-right: 12px;
          }
          
          body.ai-chat-enabled > .chat-button, body.ai-chat-enabled > .chat-wrapper {
            display: none !important;
          }
        `;
    document.head.appendChild(style);
  };

  this.createButton = function() {
    this.chatButton = document.createElement("button");
    this.chatButton.className = "chat-button";
    this.chatButton.ariaLabel = "Toggle Chat";

    this.defaultIcon = document.createElement("span");
    this.defaultIcon.className = "icon-default";
    this.defaultIcon.textContent = "💬";

    this.alternateIcon = document.createElement("span");
    this.alternateIcon.className = "icon-alternate";
    this.alternateIcon.textContent = "🙌";

    this.chatButton.appendChild(this.defaultIcon);
    this.chatButton.appendChild(this.alternateIcon);

    this.chatButton.addEventListener("click", () => {
      if (this.chatWrapper.style.display === "block") {
        this.closeChat();
      } else {
        this.openChat();
      }
    });

    document.body.appendChild(this.chatButton);
  };

  this.createChatWrapper = function() {
    this.chatWrapper = document.createElement("div");
    this.chatWrapper.className = "chat-wrapper";

    this.chatWrapper.innerHTML = `
          <div class="chat-header">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAVgSURBVHgB7Zs9UONGFMefhWGugBmnYoAiugbSnfko3EXXXQFz10IT0kC6S2ZorjrTJVWOEhpClxIGikt1SkcB2GlpomuA0qEKMIb7/43ksY1Wli2tLHvuNyNLSDaj97Fv3+6+zYhmCoWCeXt7axmG8eLh4cHELRPnHM8tX3UymUyFZzz/B9fl4eHh8vHxsSMayYgGFhYWLJxe39/fv5GngnYKFWPj2Ds5ObElZmJTgGVZuevr67e4/BlHTvTg4NgcGRmx4/KMyApISPBWKmhSf2Sz2a2oihiSCMzPz7+9ubnZx+UrHM8kOZ4hThSq1eqbiYmJ/y4vL8vSJV15AAPb3d3dLl7CknTgoFm87MYbOvYAWh2a/xOX30l6yOGdVuENN/CG405+2JEC5ubmfsepKMm6e1j4Tq+gBIES/g77o9AKgPC7OP0k6ceanJw0oYSDMF8OFQPg9iW097z0EUykTk9PZ9t9z2j3BVq+34QnfGcYbrfd9wKbAIR/L4/9e7+Sn5qayl1cXPyl+oJSAYz2OP0qfQ7zBTdX8O0dfGOAO4ApSXKZnW4qyBNm/fIE3xgA4T/J4AhPckzc/B48aQJo96s4rcrgYfo1haYm4Lo+rW/KYFLBEP15uVyueDeamgCEZ+AzZXDJYRTZ1KvVPaCXgW9sbEwWFxdlZmZGkMU1PUMyI9vb2xIjTV6Q9e5y2koSFp6Cr6ysyPLycu3aD/ThEjOeFxT5R7bhwXtJEFqalm21eCsqxUSETb3Ii1oMcOfwTEmIsMKT0dFR0UDOlflRAciWfpAEWVtbCyW8TtwJ27oCLEkIpNiytLQkKeA1PwxGf0nQ/dfX133vq4KdRk8x8/m8aSBFTGyoS2HoAX4cHh5K0qA3sIwkx/ps+35gwYPTWNID8gZmTl5IAtD6qrZ/dHSkjPaausEaXKpjEDQlAVTWZ9un+6sE1akANIFvDXehUitB1meq2ysoeyIeoLI+2dnZqZ11WjoAs+2kaFSCrM/g53V/QQrQmTRpV0CQ9Rn8PHrkAXoVEGR9L/h59FIBjmgiyPq9DH4NOFmWpSAaStwEWd+jUUFc01PBZxrmBbh6VOF8gIMj9mwwyPokDQMijAg/Mw/4LDETxvppgOuHjAFdV1eoaGf9TtEVIKmALNzARkoocUHrW5alfF4sFp/c4zhgY2ND+RtdCqhWq+UsZkcdLIY4ElNGSNdXvTATH79hL5UWpABNOJTdM32oYoJ2UBBOb6toTHxSgM2PmgLQBPYlBmj9oLRV1fcHdYGNz6enp2NLiyHzXu3MD7cCsyIR8BY3VNi2Hakv50wSF07aKSskjld12rgusCUR1gb4YrSwyspBU16cDQp6fn5+Xju86xjY9C7qS2OYIOSKyb8yWMvifnBpbJYBkH/U+z93rWxLBp89T3jSlABAMx8kYixIOY4rY52mAomrq6v/WW0pj7W/g8gvpVLJbrzhWyOEiPspRXXAceGcnZ09b73pmwMjRfxRBqspMPC99HvgWyaHplAZsKbwDq7/0e+Bsk6QxURQwje4LEh/swnXV9Y7BlaKQgkfkXqy3fRdqSxBHNuD5QMrXb8WS0sI+I+4a0v6BFo+jPAk9H4BNId9xAR6jCXpZgtuH3pfQ0c7RqAEm9WW8hgY07ZrhN32OwS8Yic/6mrTVK2ywjBSU1HKjZXMXRpz/NC/lQi4dcUcQpvSG2h1dnMfpEsi7Rvkfr3x8fEDWICK5C6ypJoFBf8N2d1ya27fKbFtnXWbhSV6PaI2ZOeIrrHgOQraNk9zHx8c43uJYfM0jgPOW6Z687QKesbQ0FCeiZRbjxRm+zxXq8pxbpJW8QXHej+/Iv/WCAAAAABJRU5ErkJggg=="
              width="64"
              height="64"
              alt="Altium"
            >
            <span>Need Help?</span>
            <button class="chat-close" aria-label="Close Chat">&times;</button>
          </div>
          <div class="chat-links-wrap">
            <ul class="chat-links contact-info">
              <li><a data-phone href=""><span>📞</span>phone</a></li>
              <li><a data-additional-phone href=""><span>📞</span>phone</a></li>
              <li><a data-email href="mailto:sales.na@altium.com"><span>✉️</span>sales.na@altium.com</a></li>
            </ul>
            <ul class="chat-links default-links">
              <li><a href="https://www.altium.com/support" target="_blank"><span>🛟</span>Support Center</a></li>
              <li><a href="mailto:global.training@altium.com" target="_blank"><span>🎓</span>Training Support</a></li>
              <li><a href="https://forum.live.altium.com/" target="_blank"><span>📣</span>Ask Community</a></li>
              <li><a data-contact-us href="https://www.altium.com/contact-us" target="_blank"><span>📞</span>Contact Us</a></li>
            </ul>
          </div>
        `;

    const closeBtn = this.chatWrapper.querySelector(".chat-close");
    closeBtn.addEventListener("click", () => {
      this.closeChat();
    });

    document.body.appendChild(this.chatWrapper);
  };

  this.openChat = function() {
    if (this.chatWrapper) {
      this.chatWrapper.style.display = "block";
      this.chatButton.classList.add("opened");
      this.defaultIcon.style.opacity = "1";
      this.alternateIcon.style.opacity = "0";
    }
  };

  this.closeChat = function() {
    if (this.chatWrapper) {
      this.chatWrapper.style.display = "none";
      this.chatButton.classList.remove("opened");
      this.defaultIcon.style.opacity = "0";
      this.alternateIcon.style.opacity = "1";

      setTimeout(() => {
        this.defaultIcon.style.opacity = "1";
        this.alternateIcon.style.opacity = "0";
      }, 2000);
    }
  };
};

(function() {
  // document.addEventListener("DOMContentLoaded", () => {
  //   const chat = new window.DriftChat();
  //   chat.init();
  // });
})();
