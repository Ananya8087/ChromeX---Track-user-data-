document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get('activityData', function(result) {
      const activityData = result.activityData || {};
      const activityDiv = document.getElementById('activity');
      activityDiv.innerHTML = '';
  
      console.log("Loaded activity data:", activityData);
  
      for (let url in activityData) {
        const events = activityData[url];
        const urlDiv = document.createElement('div');
        urlDiv.className = 'event';
        urlDiv.innerHTML = `<strong>${url}</strong><br>`;
  
        events.forEach(event => {
          let timeSpentText = '';
          if (event.timeSpent !== undefined) {
            const seconds = (event.timeSpent / 1000).toFixed(2);
            timeSpentText = ` (Time spent: ${seconds} seconds)`;
          }
          const elementInfoText = event.elementInfo
            ? ` on element <${event.elementInfo.tag} class="${event.elementInfo.classes}" id="${event.elementInfo.id}" name="${event.elementInfo.name}">`
            : '';
          urlDiv.innerHTML += `${event.timestamp}: ${event.eventType}${timeSpentText}${elementInfoText}<br>`;
        });
  
        activityDiv.appendChild(urlDiv);
      }
    });
  });
  