const audio = document.getElementById("audio");
const file = document.getElementById("file");

file.addEventListener("change", handleFiles, false);

function handleFiles() {
  const files = file.files;
  if (files.length === 0) {
    console.log("No file chosen");
  } else {
    const file = files[0];
    audio.src = URL.createObjectURL(file);
  }
}
