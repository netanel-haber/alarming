throw new Error("ejemplo");

type ContentScriptMessage =
  | {
    type: "elementSelected";
    element: string;
  }
  | {
    type: "activateElementPicker";
  };

function onMouseDown(event: MouseEvent) {
  event.stopPropagation();
  event.preventDefault();
  document.removeEventListener("mousedown", onMouseDown, true);

  const selectedElement = event.target as HTMLElement;
  chrome.runtime.sendMessage({
    type: "elementSelected",
    element: selectedElement.outerHTML,
  });
}

console.log("Content script is running!");

chrome.runtime.onMessage.addListener(
  (message: ContentScriptMessage) => {
    if (message.type === "activateElementPicker") {
      document.addEventListener("mousedown", onMouseDown, true);
    }
  },
);
