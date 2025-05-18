const cvInput = document.getElementById('cv-input');
const saveBtn = document.getElementById('save-cv-btn');
const runBtn = document.getElementById('run-btn');
const resultDiv = document.getElementById('result');

// Load saved CV on popup open
window.onload = () => {
  const savedCV = localStorage.getItem('userCV');
  if (savedCV) cvInput.value = savedCV;
};

// Save CV to localStorage
saveBtn.onclick = () => {
  const cv = cvInput.value.trim();
  if (cv) {
    localStorage.setItem('userCV', cv);
    alert('CV saved!');
  } else {
    alert('Please enter your CV.');
  }
};

// Run match: get job description from content script and compare
runBtn.onclick = () => {
  resultDiv.textContent = 'Analyzing...';
  const userCV = localStorage.getItem('userCV');
  if (!userCV) {
    resultDiv.textContent = 'Please save your CV first.';
    return;
  }
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    chrome.tabs.sendMessage(
      tabId,
      { type: "SCRAPE_JOB_DESCRIPTION" },
      (response) => {
        if (!response || !response.jobDescription) {
          resultDiv.textContent = 'Could not read job description from page.';
          return;
        }
        const jobDescription = response.jobDescription;
        // Simple matching: count common words
        const cvWords = new Set(userCV.toLowerCase().split(/\W+/));
        const jdWords = new Set(jobDescription.toLowerCase().split(/\W+/));
        let matchCount = 0;
        cvWords.forEach(word => {
          if (jdWords.has(word)) matchCount++;
        });
        const score = Math.round((matchCount / cvWords.size) * 100);
        resultDiv.textContent = `Match Score: ${isNaN(score) ? 0 : score}%`;
      }
    );
  });
};