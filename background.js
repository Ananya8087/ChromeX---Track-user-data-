let activityData = {};

function sendActivityToGoogleSheet(data) {
  const webAppUrl = 'https://script.google.com/macros/s/AKfycbz7zsRbTS5vAwkHV6Ry4iR8wi8m_oy_FjB-BScXGxhlV4AOeRYxKUuQhl6waBc2ICFXig/exec';

  fetch(webAppUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    console.log('Data sent to Google Sheet:', result);
  })
  .catch(error => {
    console.error('Error sending data to Google Sheet:', error);
  });
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("Enhanced Activity Tracker Extension installed.");
  chrome.storage.local.set({ activityData: {} });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "TRACK_ACTIVITY") {
    const { url, eventType, timestamp, timeSpent, elementInfo } = message.payload;

    if (!activityData[url]) {
      activityData[url] = [];
    }

    activityData[url].push({ eventType, timestamp, timeSpent, elementInfo });

    chrome.storage.local.set({ activityData }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving activity data:", chrome.runtime.lastError);
      } else {
        console.log("Activity data saved:", activityData);
      }
      sendResponse({ status: "success" });
    });

    // Send data to Google Sheet
    sendActivityToGoogleSheet([{ url, eventType, timestamp, timeSpent, elementInfo }]);

    return true; // Indicate that sendResponse will be called asynchronously
  }
});
