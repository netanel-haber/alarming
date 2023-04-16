let popupOpen = false;
let observed: MutationObserver | null = null;

const partysOver = () => {
  popupOpen = false;
  observed?.disconnect();
  observed = null;
};

const playSound = () => {
  const audio = new Audio();
  audio.src =
    "data:audio/mpeg;base64,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QfDBRAEMBwEEwVgbzCOCtMMAMcwxAvzC2C5MH0H4wcQcDB3B2MGcEowKQDgMAUQAKmB4C2YNAOZyYhrzRkzBrYR1bR15Bv3Ru3RuWhmCYsBEYAxpo06w1qY0q44+A9/Y4TEOMrlbWmwC4QyZgy5gxxczBsyxUyRMxwkDATBETPJzTIwEST/MMLMQDAAEww0yBMyhs0Cky5IIFQepSWVLalnQEBQChUEYsYYs//PixNFz1BYUBd7QACAIEXGV0rcCQBb6GEMjBiDGjDDgC2xbIssWSSJdXBuQNAGHEGHCAYEXeLgmACmGDmGBo40l/naZsIIBmGCmECmEBoDY5Py6ZpKNCaYQOYYGYIGYQWYMEgOjctlVt9UeQADRSkcGF7iySCzzUtzlqrBhdYskW2LZAEAkS6s1bjMFF3i0wFAFyVq2Mv3zKrTqUlnSzJaUtKWlLSlpVjRtOUtiWZLSlpS0pZ0s8XaeaU1LVLUlzpF/iyxZJBZ5qXW92FpFlizRbIs0pdQ25bNV6JSossBgyEotyYIKYYOYQGhrGJ6U1LMqlaGJgA5iA4KCt7Krl+lmqdG0wQcwwcDBVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVU6h9djVE2rMnK54124ozZYYeNXNOU0ZkvDPJTZM0BMY22941VwMzSlg0Hcs1ST41xKMIqAz3EIyADUzxkEHjHsTTMjhmTvBTxzjgdTE9gvkMPVMpENKxNcYCM5sgZpzxkkpiloVZCrMxyY0I0okGZAICQUlNIvMW2EKMwAJWcxpYyzswMwRzRV+YRgYlKZQsaMGEXTWnjMMwqyKqYCoTDGDKjQiIa0EapSZV0QORGnMEeMSZMsKGp5rhpq1xkn4jfEjQw6kyRoz4cmmGpFGiTmPaAhyFm4EWGNNmUDBi8WUv/z4MTgd0wVQAD3dEhjwRhBoVHCowVEluEU1LGDs0aFFbD/MxZgvdPlB5Q1TRA0t8gqXyAQ0yZYyTEwMAqQRxyFFgFQmEJGFDmCAAYGW0RPUdTmRVQDFnQKIBhUZNDpshKhQcBQoQEJh4YNMGCCgkqiCAAhmoArtfizlNU5k9U7U5E+0sURi0IFDBQeKkhUoIyIECBgsoEl+kHUBSOqOqdie6xF/tBdZyX2eJ94Ei1WzNU7qrlaM7cCSOinuS1yXaf1rypUEwoBJQRIFGA44CR7Vw278P+8jJkxk9WENbhySsyUVVSUOUNUWU7aowlO5AtJRPxQ9Wxg7HWDNZcJgKaKiTA2mQucm5iNqkxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==";
  audio.play().catch(console.error);
};

const observe = (targetNode: HTMLElement) => {
  const observer = new MutationObserver(() => {
    playSound();
    observer?.disconnect();
  });
  observer.observe(targetNode, {
    attributes: true,
    childList: true,
    subtree: true,
  });
  return observer;
};

document.body.addEventListener("click", (e) => {
  if (popupOpen) {
    e.stopPropagation();
    e.preventDefault();
    if (e.target instanceof HTMLElement) {
      observed?.disconnect();
      observed = observe(e.target);
    }
  }
}, { capture: true });

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "POPUP_OPEN") {
    popupOpen = true;
  }
});
