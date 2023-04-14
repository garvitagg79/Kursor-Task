// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ASK_KURSOR") {
    let originalActiveElement;
    let text;

    // If there's an active text input
    if (
      document.activeElement &&
      (document.activeElement.isContentEditable ||
        document.activeElement.nodeName.toUpperCase() === "TEXTAREA" ||
        document.activeElement.nodeName.toUpperCase() === "INPUT")
    ) {
      // Set as original for later
      originalActiveElement = document.activeElement;
      // Use selected text or all text in the input
      text =
        document.getSelection().toString().trim() ||
        document.activeElement.textContent.trim();
    } else {
      // If no active text input use any selected text on page
      text = document.getSelection().toString().trim();
    }

    if (!text) {
      alert("No text found.");
      return;
    }

    // Create the floating window element
    const floatingWindow = document.createElement("div");
    floatingWindow.id = "floating-window";
    floatingWindow.style.position = "fixed";
    floatingWindow.style.top = "50%";
    floatingWindow.style.left = "50%";
    floatingWindow.style.transform = "translate(-50%, -50%)";
    floatingWindow.style.padding = "10px";
    floatingWindow.style.borderRadius = "5px";
    floatingWindow.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.3)";
    floatingWindow.style.zIndex = "9999";

    // Check the current color scheme of the browser and set the background color of the floating window
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      floatingWindow.style.backgroundColor = "#2d2d2d"; // Dark background color
    } else {
      floatingWindow.style.backgroundColor = "#ffffff"; // Light background color
    }

    // Add text input element to the floating window
    const textInput = document.createElement("textarea");
    textInput.id = "floating-window-text";
    textInput.style.width = "100%";
    textInput.style.height = "150px";
    textInput.style.border = "none";
    textInput.style.outline = "none";
    textInput.style.resize = "none";
    textInput.style.overflow = "auto";
    textInput.value = text;

    // Check the current color scheme of the browser and set the text color of the floating window
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      textInput.style.color = "#ffffff"; // Dark background color
      textInput.style.backgroundColor = "#2d2d2d";
    } else {
      textInput.style.color = "#000000";
      textInput.style.backgroundColor = "#ffffff"; // Light background color
    }
    floatingWindow.appendChild(textInput);

    // Add action buttons to the floating window
    const actionButtons = document.createElement("div");
    actionButtons.style.display = "flex";
    actionButtons.style.justifyContent = "space-between";
    actionButtons.style.marginTop = "10px";
    const copyButton = document.createElement("button");
    copyButton.textContent = "Copy to Clipboard";
    copyButton.style.padding = "5px 10px";
    copyButton.style.border = "none";
    copyButton.style.borderRadius = "5px";
    copyButton.style.backgroundColor = "#007bff";
    copyButton.style.color = "#ffffff";
    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText(textInput.value);
      alert("Text is copied to clipboard.");
    });
    actionButtons.appendChild(copyButton);
    const shareButton = document.createElement("button");
    shareButton.textContent = "Share";
    shareButton.style.padding = "5px 10px";
    shareButton.style.marginLeft = "5px";
    shareButton.style.border = "none";
    shareButton.style.borderRadius = "5px";
    shareButton.style.backgroundColor = "#007bff";
    shareButton.style.color = "#ffffff";
    shareButton.addEventListener("click", () => {
      const mailtoLink = `mailto:?body=${encodeURIComponent(textInput.value)}`;
      window.open(mailtoLink);
    });
    actionButtons.appendChild(shareButton);

    //close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.padding = "5px 10px";
    closeButton.style.marginLeft = "5px";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "5px";
    closeButton.style.backgroundColor = "#ff0000";
    closeButton.style.color = "#ffffff";
    closeButton.addEventListener("click", () => {
      document.body.removeChild(floatingWindow);
    });
    actionButtons.appendChild(closeButton);

    floatingWindow.appendChild(actionButtons);

    // Add event listeners to make
    // Add event listeners to make the floating window draggable
    let isDragging = false;
    let offset = { x: 0, y: 0 };
    floatingWindow.addEventListener("mousedown", (e) => {
      isDragging = true;
      offset.x = e.clientX - floatingWindow.offsetLeft;
      offset.y = e.clientY - floatingWindow.offsetTop;
    });
    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        floatingWindow.style.left = e.clientX - offset.x + "px";
        floatingWindow.style.top = e.clientY - offset.y + "px";
      }
    });
    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Append the floating window to the body
    document.body.appendChild(floatingWindow);
    return;
  }
});
