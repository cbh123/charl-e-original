// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const loading_status = document.getElementById("loading-status");
const logs = document.getElementById("logs");
const image_div = document.getElementById("image-div");
const cancel_btn = document.getElementById("cancel");
const submit_btn = document.getElementById("submit");

function getFormData() {
  const formData = new FormData(document.getElementById("options-form"));
  return Object.fromEntries(formData);
}

document
  .getElementById("img-filepath")
  .addEventListener("click", function (event) {
    window.electronAPI.openFile(document.getElementById("image").src);
  });

document.getElementById("cancel").addEventListener("click", function (event) {
  window.electronAPI.cancelRun("cancel");
  cancel_btn.style.display = "none";
  submit_btn.style.display = "inline-block";
});

document
  .getElementById("prompt-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const prompt = document.getElementById("prompt").value;

    let args = getFormData();

    args = Object.entries(args)
      .flat()
      .filter((item) => item !== "on");

    loading_status.style.display = "block";
    image_div.style.display = "none";
    loading_status.innerHTML = "Initializing...";
    cancel_btn.style.display = "inline-block";
    submit_btn.style.display = "none";
    window.electronAPI.runPrompt({ prompt: prompt, args: args });
  });

document
  .getElementById("options-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById("options-form"));

    args = Object.fromEntries(formData);

    console.log("Args is now: ", args);

    document.getElementById("details").removeAttribute("open");
  });

window.electronAPI.defaultOutdir((_event, value) => {
  console.log("Setting default outdir to ", value);
  document.getElementById("--outdir").value = value;
});

window.electronAPI.onImageLoad((_event, value) => {
  console.log("Setting image to ", value);
  document.getElementById("image").src = value;
  loading_status.style.display = "none";
});

window.electronAPI.onStdout((_event, value) => {
  console.log("Setting image to ", value);
  var stdout_div = document.getElementById("stdout-list");

  let li = document.createElement("li");
  li.textContent = value;
  stdout_div.prepend(li);
});

window.electronAPI.onLoading((_event, pct) => {
  console.log("Loading Update: ", pct);
  var progress = document.getElementById("progress-bar");

  progress.style = "display: inline-block; text-align: center";
  loading_status.style.display = "none";

  progress.value = pct;

  if (pct == 100) {
    progress.style.display = "none";
    loading_status.style.display = "block";
    loading_status.innerHTML = "Framing...";
    image_div.style.display = "block";
    submit_btn.style.display = "inline-block";
    cancel_btn.style.display = "none";
  }
});
