let textContainer = document.getElementById("text");
let speakButton = document.getElementById("speak-button");
let voiceSelect = document.getElementById("voice-select");
let volumeInput = document.getElementById("volume");
let rateInput = document.getElementById("rate");
let speechUtterance = null;
let words = [];

let voices = [];
window.speechSynthesis.onvoiceschanged = function() {
  voices = window.speechSynthesis.getVoices();
  voices.forEach(function(voice, index) {
    let option = document.createElement("option");
    option.value = index;
    option.textContent = voice.name + ' (' + voice.lang + ')';
    voiceSelect.appendChild(option);
  });
};

speakButton.addEventListener("click", function() {
  let text = textContainer.value;

  if (text !== "") {
    words = text.split(/\s+/); // Splitting words using whitespace characters
    
    let utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    utterance.voice = voices[voiceSelect.value];
    utterance.volume = parseFloat(volumeInput.value);
    utterance.rate = parseFloat(rateInput.value);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    speechUtterance = utterance;

    speakButton.style.display = "none";

    // Start highlighting words
    highlightCurrentlySpokenWord(0);
  }
});

window.speechSynthesis.addEventListener('end', function(event) {
  if (speechUtterance && event.utterance === speechUtterance) {
    textContainer.innerHTML = textContainer.value; // Remove highlight after speech ends
    speakButton.style.display = "inline-block";
  }
});

function highlightCurrentlySpokenWord(index) {
  if (index < words.length) {
    textContainer.innerHTML = words.map((word, i) => {
      if (i === index) {
        return `<span class="highlight">${word}</span>`;
      } else {
        return word;
      }
    }).join(' ');

    // Schedule highlighting of next word after a short delay
    setTimeout(() => {
      highlightCurrentlySpokenWord(index + 1);
    }, speechUtterance.duration * 1000); // Wait for the duration of the current word
  }
}
