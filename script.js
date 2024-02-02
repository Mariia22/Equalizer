const file = document.getElementById("file");
const audio = document.createElement("audio");
const visualizerContainer = document.querySelector(".grid");
const ctx = new AudioContext();
const analyser = ctx.createAnalyser();
analyser.fftSize = 32;
const bufferLength = analyser.frequencyBinCount;
const frequencyData = new Uint8Array(bufferLength);
const numberOfColumns = 13;

function printGrid() {
  for (let i = 0; i < numberOfColumns; i++) {
    const bar = document.createElement("div");
    bar.setAttribute("id", "column" + i);
    bar.setAttribute("class", "grid__bar");
    visualizerContainer.appendChild(bar);
    const column = document.getElementById("column" + i);
    for (let j = numberOfColumns - 1; j >= 0; j--) {
      const row = document.createElement("div");
      row.setAttribute("id", "column" + i + "row" + j);
      row.setAttribute("class", "grid__bar");
      column.appendChild(row);
    }
  }
}

function handleFiles() {
  const files = file.files;
  if (files.length === 0) {
    console.log("No file chosen");
  } else {
    const file = files[0];
    if (file.type === "audio/mpeg") {
      audio.controls = "controls";
      audio.src = URL.createObjectURL(file);
      document.getElementById("container").appendChild(audio);
      createAnalyzer();
    } else {
      console.log(
        "Selected file format is not supported. Choose another audio file"
      );
    }
  }
}

function createAnalyzer() {
  const audioSource = ctx.createMediaElementSource(audio);
  ctx.resume();
  audioSource.connect(analyser);
  analyser.connect(ctx.destination);
}

function renderFrame() {
  analyser.getByteFrequencyData(frequencyData);
  for (let i = 0; i < numberOfColumns; i++) {
    for (let j = 0; j < numberOfColumns; j++) {
      const row = document.getElementById("column" + i + "row" + j);
      if (j < Math.ceil(frequencyData[i] % numberOfColumns)) {
        row.classList.add("non__empty");
      } else if (row.classList.contains("non__empty")) {
        row.classList.remove("non__empty");
      }
    }
  }

  window.requestAnimationFrame(renderFrame);
}

function pauseAudio() {
  // here should be method for pause connection. I haven't found yet
  //ctx.close();
  window.cancelAnimationFrame(renderFrame);
}

function deleteAnalyzer() {
  audioSource.disconnect(analyser);
  analyser.disconnect(ctx.destination);
  ctx.close();
}

window.addEventListener("load", printGrid);
file.addEventListener("change", handleFiles);
audio.addEventListener("play", renderFrame);
audio.addEventListener("pause", pauseAudio);
audio.addEventListener("ended", deleteAnalyzer);
