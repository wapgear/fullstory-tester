const DUMMY_CHAR = '*';
const CONTENT_EXCLUDED = 'Content excluded';

function createDummyString(length: number) {
  return DUMMY_CHAR.repeat(length);
}

function maskContent(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    // Mask text nodes
    if (node.textContent !== 'CONTENT_EXCLUDED') {
      node.textContent = node.textContent?.replace(/[a-zA-Z0-9]/g, DUMMY_CHAR);
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    if (node.tagName.toLowerCase() === 'input') {
      // Mask input element values
      node.value = createDummyString(node.value.length);
    } else {
      // Recursively mask child nodes, unless 'fs-unmask' is present
      if (!node.classList.contains('fs-unmask')) {
        Array.from(node.childNodes).forEach(maskContent);
      }
    }
  }
}

function processElement(element) {
  if (element.classList.contains('fs-exclude')) {
    // Replace 'fs-exclude' elements with a placeholder
    const replacement = document.createElement('div');
    replacement.style.backgroundColor = 'silver';
    replacement.style.border = '1px solid red';
    replacement.textContent = CONTENT_EXCLUDED;
    replacement.style.width = element.offsetWidth + 'px';
    replacement.style.height = element.offsetHeight + 'px';
    replacement.style.display = 'flex';
    replacement.style.justifyContent = 'center';
    replacement.style.alignItems = 'center';

    element.replaceWith(replacement);
  } else if (element.classList.contains('fs-mask')) {
    // Mask content of 'fs-mask' elements
    maskContent(element);
  }
}

function applyFullStoryRules() {
  document.querySelectorAll('.fs-exclude, .fs-mask').forEach(processElement);
}

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        processElement(node);
        // Additionally check all child elements
        (node as any).querySelectorAll('.fs-exclude, .fs-mask').forEach(processElement);
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });

const applyInterval = setInterval(() => {
  applyFullStoryRules();
}, 1000); // Runs every 1000 milliseconds (1 second)

function cleanUp() {
  clearInterval(applyInterval);
  observer.disconnect();
}

// Setup MutationObserver and event listeners as previously discussed

window.onload = applyFullStoryRules;
window.addEventListener('beforeunload', cleanUp);

//
// let isExtensionActive: boolean = false;
//
// chrome.runtime.onMessage.addListener((message: { action: string }, _sender, sendResponse) => {
//   console.log("message", message, sendResponse);
//   if (message.action === "toggleExtension") {
//     isExtensionActive = !isExtensionActive;
//   }
//   if (message.action === "getStatus") {
//     return sendResponse({ active: isExtensionActive });
//   }
// });
