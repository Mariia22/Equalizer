const file = document.getElementById("file");
const audio = document.createElement("audio");
const visualizerContainer = document.querySelector(".grid");
const numberOfColumns = 6;

function printGrid() {
  for (let i = 0; i < numberOfColumns; i++) {
    const bar = document.createElement("div");
    bar.setAttribute("id", "bar" + i);
    bar.setAttribute("class", "grid__bar");
    visualizerContainer.appendChild(bar);
  }
}

function handleFiles() {
  const files = file.files;
  if (files.length === 0) {
    console.log("No file chosen");
  } else {
    const file = files[0];
    audio.id = "audio-player";
    audio.controls = "controls";
    audio.src = URL.createObjectURL(file);
    document.getElementById("container").appendChild(audio);
  }
}

function createAnalyzer() {
  const ctx = new AudioContext();
  const audioSource = ctx.createMediaElementSource(audio);
  const analayzer = ctx.createAnalyser();
  audioSource.connect(analayzer);
  audioSource.connect(ctx.destination);
  const frequencyData = new Uint8Array(analayzer.frequencyBinCount);
  analayzer.getByteFrequencyData(frequencyData);
  renderFrame(frequencyData);
}

function renderFrame(frequencyData) {
  for (let i = 0; i < numberOfColumns; i++) {
    const index = (i + 10) * 2;
    const fd = frequencyData[index];
    const bar = document.querySelector("#bar" + i);
    if (!bar) {
      continue;
    }

    const barHeight = Math.max(4, fd || 0);
    bar.style.height = barHeight + "px";
  }

  window.requestAnimationFrame(renderFrame);
}

window.addEventListener("load", printGrid);
file.addEventListener("change", handleFiles);
audio.addEventListener("play", createAnalyzer);
