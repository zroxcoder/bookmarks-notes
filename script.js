// ====== THEME TOGGLE ======
const themeToggle = document.getElementById("themeToggle");
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️ Light Mode";
}
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☀️ Light Mode";
  } else {
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🌙 Dark Mode";
  }
});

// ====== TABS ======
const tabs = document.querySelectorAll(".tab-btn");
const sections = document.querySelectorAll(".tab");
tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    tabs.forEach(b => b.classList.remove("active"));
    sections.forEach(s => s.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// ====== LOCAL STORAGE HELPERS ======
function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ====== NOTES ======
function renderNotes() {
  const notes = getData("notes");
  const container = document.getElementById("notesList");
  container.innerHTML = "";
  notes.sort((a,b) => b.pinned - a.pinned); // pinned on top
  notes.forEach((note, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <span>${note.text}</span>
      <div>
        <button onclick="togglePin('notes', ${index})">${note.pinned ? "📌 Unpin" : "📍 Pin"}</button>
        <button onclick="deleteItem('notes', ${index})">❌</button>
      </div>
    `;
    container.appendChild(card);
  });
}
function addNote() {
  const input = document.getElementById("noteInput");
  if (!input.value.trim()) return;
  const notes = getData("notes");
  notes.push({ text: input.value.trim(), pinned: false });
  saveData("notes", notes);
  input.value = "";
  renderNotes();
}

// ====== BOOKMARKS ======
function renderBookmarks() {
  const bookmarks = getData("bookmarks");
  const container = document.getElementById("bookmarksList");
  container.innerHTML = "";
  bookmarks.sort((a,b) => b.pinned - a.pinned);
  bookmarks.forEach((bm, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <a href="${bm.url}" target="_blank">${bm.title}</a>
      <div>
        <button onclick="togglePin('bookmarks', ${index})">${bm.pinned ? "📌 Unpin" : "📍 Pin"}</button>
        <button onclick="deleteItem('bookmarks', ${index})">❌</button>
      </div>
    `;
    container.appendChild(card);
  });
}
function addBookmark() {
  const title = document.getElementById("bookmarkTitle").value.trim();
  const url = document.getElementById("bookmarkURL").value.trim();
  if (!title || !url) return;
  const bookmarks = getData("bookmarks");
  bookmarks.push({ title, url, pinned: false });
  saveData("bookmarks", bookmarks);
  document.getElementById("bookmarkTitle").value = "";
  document.getElementById("bookmarkURL").value = "";
  renderBookmarks();
}

// ====== VIDEOS ======
function renderVideos() {
  const videos = getData("videos");
  const container = document.getElementById("videosList");
  container.innerHTML = "";
  videos.sort((a,b) => b.pinned - a.pinned);
  videos.forEach((vid, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <a href="${vid.url}" target="_blank">${vid.title}</a>
      <div>
        <button onclick="togglePin('videos', ${index})">${vid.pinned ? "📌 Unpin" : "📍 Pin"}</button>
        <button onclick="deleteItem('videos', ${index})">❌</button>
      </div>
    `;
    container.appendChild(card);
  });
}
function addVideo() {
  const title = document.getElementById("videoTitle").value.trim();
  const url = document.getElementById("videoURL").value.trim();
  if (!title || !url) return;
  const videos = getData("videos");
  videos.push({ title, url, pinned: false });
  saveData("videos", videos);
  document.getElementById("videoTitle").value = "";
  document.getElementById("videoURL").value = "";
  renderVideos();
}

// ====== COMMON FUNCTIONS ======
function deleteItem(type, index) {
  const data = getData(type);
  data.splice(index, 1);
  saveData(type, data);
  renderAll();
}
function togglePin(type, index) {
  const data = getData(type);
  data[index].pinned = !data[index].pinned;
  saveData(type, data);
  renderAll();
}

function renderAll() {
  renderNotes();
  renderBookmarks();
  renderVideos();
}
renderAll();

// ====== SEARCH ======
document.getElementById("searchInput").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  document.querySelectorAll(".card").forEach(card => {
    card.style.display = card.innerText.toLowerCase().includes(query) ? "flex" : "none";
  });
});
