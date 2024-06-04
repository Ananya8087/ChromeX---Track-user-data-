(function() {
  const desiredUrlPattern = /^https:\/\/mt\.ihx\.in\/services\/bill\/portal\/qc/;

  if (!desiredUrlPattern.test(window.location.href)) {
    console.log("Not the target page. Exiting script.");
    return;
  }

  if (!chrome.runtime || !chrome.runtime.sendMessage) {
    console.error("chrome.runtime.sendMessage is not available.");
    return;
  }

  let startTime = Date.now();
  let lastElement = null;

  function sendActivity(eventType, element) {
    const timestamp = new Date().toISOString();
    const endTime = Date.now();
    const timeSpent = endTime - startTime;
    startTime = endTime;

    const elementInfo = getElementInfo(element);

    if (elementInfo && (elementInfo.tag === 'BUTTON' || elementInfo.tag === 'INPUT')) {
      lastElement = elementInfo;
    }

    chrome.runtime.sendMessage({
      type: "TRACK_ACTIVITY",
      payload: {
        url: window.location.href,
        eventType,
        timestamp,
        timeSpent,
        elementInfo: lastElement
      }
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError);
      } else {
        console.log("Message sent:", response);
      }
    });
  }

  function getElementInfo(element) {
    if (!element) return null;
    const tag = element.tagName;
    const classes = element.className;
    const id = element.id;
    const name = element.name;
    return { tag, classes, id, name };
  }

  sendActivity("page_load", document.body);

  document.addEventListener("click", (e) => {
    sendActivity("click", e.target);
  });

  window.addEventListener("beforeunload", () => {
    sendActivity("page_unload", document.body);
  });
})();
