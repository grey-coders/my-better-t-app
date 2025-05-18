chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "SCRAPE_JOB_DESCRIPTION") {
    const jobDescription = document.body.innerText || "";
    sendResponse({ jobDescription });
  }
  return true;
});