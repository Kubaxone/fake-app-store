const appsContainer = document.getElementById("apps");
let allApps = [];

// Load default apps
const defaultApps = [
  "roblox",
  "spotify",
  "whatsapp",
  "minecraft",
  "tiktok",
  "instagram",
  "youtube"
];

// Fetch apps from iTunes API
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

function render(apps) {
  appsContainer.innerHTML = "";

  apps.forEach(app => {
    const div = document.createElement("div");
    div.className = "app";

    div.innerHTML = `
      <img src="${app.artworkUrl100}" />
      <div class="info">
        <div class="name">${app.trackName}</div>
        <div class="category">${app.primaryGenreName}</div>
      </div>
      <button class="get" onclick="install('${app.trackName}')">GET</button>
    `;

    appsContainer.appendChild(div);
  });
}

// Search
function searchApps() {
  const q = document.getElementById("search").value.toLowerCase();
  const filtered = allApps.filter(a =>
    a.trackName.toLowerCase().includes(q)
  );
  render(filtered);
}

// Fake install animation
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

// start
loadApps();
