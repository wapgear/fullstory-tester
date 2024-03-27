document.getElementById('toggleButton')!.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "toggleExtension" });
  updateStatus();
});

function updateStatus(): void {
  console.log("updateStatus");
  chrome.runtime.sendMessage({ action: "getStatus" }, response => {
    console.log("response", response);
    const statusElement = document.getElementById('status');
    if (statusElement) {
      statusElement.textContent = response.active ? 'Active' : 'Inactive';
    }
  });
}

// Run on popup open
// updateStatus();
