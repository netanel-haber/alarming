chrome.action.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0].id;
    if (activeTab === undefined) return;
    chrome.tabs.sendMessage(activeTab, { message: "POPUP_OPEN" });
  });
});
