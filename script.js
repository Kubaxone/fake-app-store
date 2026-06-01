const appsContainer = document.getElementById("apps");
let allApps = [];

const defaultApps = [
  "roblox",
  "spotify",
  "whatsapp",
  "minecraft",
  "tiktok",
  "instagram",
  "youtube"
];

// LOAD APPS
async function loadApps() {
  appsContainer.innerHTML = "Loading...";

  const results = await Promise.all(
    defaultApps.map(async (term) => {
      const res = await fetch(`https://itunes.apple.com/search?term=${term}&entity=software&limit=1`);
      const data = await res.json();
      return data.results[0];
    })
  );

  allApps = results.filter(Boolean);
  render(allApps);
}

// RENDER LIST
function render(apps) {
  appsContainer.innerHTML = "";

  apps.forEach(app => {
    const div = document.createElement("div");
    div.className = "app";

    div.innerHTML = `
      <img src="${app.artworkUrl100}" onclick='openApp(${JSON.stringify(app)})'>
      <div class="info" onclick='openApp(${JSON.stringify(app)})'>
        <div class="name">${app.trackName}</div>
        <div class="category">${app.primaryGenreName}</div>
      </div>
      <button class="get" onclick='install("${app.trackName}")'>GET</button>
    `;

    appsContainer.appendChild(div);
  });
}

// SEARCH
function searchApps() {
  const q = document.getElementById("search").value.toLowerCase();
  render(allApps.filter(a => a.trackName.toLowerCase().includes(q)));
}

// INSTALL MODAL
function install(name) {
  document.getElementById("modal").classList.add("show");
  document.getElementById("modal-title").innerText = "Installing " + name;

  let p = 0;
  const bar = document.getElementById("progress");

  const i = setInterval(() => {
    p += Math.random() * 10;

    if (p >= 100) {
      p = 100;
      clearInterval(i);
      document.getElementById("modal-sub").innerText = "Installed (demo)";
    }

    bar.style.width = p + "%";
  }, 80);
}

function closeModal() {
  document.getElementById("modal").classList.remove("show");
}

// DETAIL VIEW
function openApp(app) {
  document.getElementById("detail").classList.add("show");

  document.getElementById("detail-icon").src = app.artworkUrl512 || app.artworkUrl100;
  document.getElementById("detail-name").innerText = app.trackName;
  document.getElementById("detail-genre").innerText = app.primaryGenreName;

  document.getElementById("detail-desc").innerText =
    app.description ? app.description.slice(0, 200) + "..." : "No description available.";

  const shots = document.getElementById("screenshots");
  shots.innerHTML = "";

  for (let i = 0; i < 3; i++) {
    const img = document.createElement("img");
    img.src = app.artworkUrl512 || app.artworkUrl100;
    shots.appendChild(img);
  }

  document.getElementById("detail-btn").onclick = () => install(app.trackName);
}

function closeDetail() {
  document.getElementById("detail").classList.remove("show");
}

// START
loadApps();
