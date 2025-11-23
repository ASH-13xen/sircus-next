import React, { useEffect } from 'react';

const Chatbot = () => {
  useEffect(() => {
    const scriptMain = document.createElement('script');
    scriptMain.src = 'https://cdn.botpress.cloud/webchat/v3.2/inject.js';
    scriptMain.defer = true;

    scriptMain.onload = () => {
      const scriptBot = document.createElement('script');
      scriptBot.src = 'https://files.bpcontent.cloud/2025/08/04/12/20250804125400-HCG8SNDE.js';
      scriptBot.defer = true;
      document.body.appendChild(scriptBot);
    };

    document.body.appendChild(scriptMain);

    return () => {
      // Attempt to destroy Chatbot API if available
      if (window.botpressWebChat && typeof window.botpressWebChat.destroy === 'function') {
        window.botpressWebChat.destroy();
      }

      // Remove injected scripts
      document.body.removeChild(scriptMain);
      const botScript = document.querySelector(
        'script[src="https://files.bpcontent.cloud/2025/08/04/12/20250804125400-HCG8SNDE.js"]'
      );
      if (botScript) {
        document.body.removeChild(botScript);
      }

      // Manually remove Chatbot container injected by Botpress
      const bpWidget = document.getElementById('bp-webchat');
      if (bpWidget && bpWidget.parentNode) {
        bpWidget.parentNode.removeChild(bpWidget);
      }

      // Remove any other Botpress UI container if present
      const botpressContainers = document.querySelectorAll('[class^="bp-widget"], [id^="bp-webchat"]');
      botpressContainers.forEach((el) => {
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    };
  }, []);

  return (
    <div
      id="bp-webchat"
      style={{ position: 'fixed', bottom: 0, right: 0, zIndex: 10000 }}
    />
  );
};

export default Chatbot;
