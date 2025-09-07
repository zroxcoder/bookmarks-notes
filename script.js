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
        <button onclick="editItem('notes', ${index})">✏️ Edit</button>
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
        <button onclick="editItem('bookmarks', ${index})">✏️ Edit</button>
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
        <button onclick="editItem('videos', ${index})">✏️ Edit</button>
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

// ====== EDIT FUNCTION ======
function editItem(type, index) {
  const data = getData(type);

  if (type === "notes") {
    const newText = prompt("Edit your note:", data[index].text);
    if (newText) data[index].text = newText;
  }

  if (type === "bookmarks") {
    const newTitle = prompt("Edit bookmark title:", data[index].title);
    const newURL = prompt("Edit bookmark URL:", data[index].url);
    if (newTitle && newURL) {
      data[index].title = newTitle;
      data[index].url = newURL;
    }
  }

  if (type === "videos") {
    const newTitle = prompt("Edit video title:", data[index].title);
    const newURL = prompt("Edit video URL:", data[index].url);
    if (newTitle && newURL) {
      data[index].title = newTitle;
      data[index].url = newURL;
    }
  }

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


let currentProfile = localStorage.getItem('currentProfile') || 'defaultUser';
document.getElementById('profileName').value = currentProfile;

function getKey(key) {
  return `${key}_${currentProfile}`;
}

// Override getData & saveData to use currentProfile
function getData(key) {
  return JSON.parse(localStorage.getItem(getKey(key))) || [];
}
function saveData(key, data) {
  localStorage.setItem(getKey(key), JSON.stringify(data));
}

// Switch profile
function switchProfile() {
  const name = document.getElementById('profileName').value.trim();
  if (!name) return alert("Profile name cannot be empty!");
  currentProfile = name;
  localStorage.setItem('currentProfile', currentProfile);
  renderAll();
  alert(`Switched to profile: ${currentProfile}`);
}

// Export current profile data
function exportData() {
  const data = {
    notes: getData('notes'),
    bookmarks: getData('bookmarks'),
    videos: getData('videos'),
    theme: localStorage.getItem(getKey('theme'))
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${currentProfile}_backup.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Import data for current profile
function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const data = JSON.parse(e.target.result);
    if (data.notes) saveData('notes', data.notes);
    if (data.bookmarks) saveData('bookmarks', data.bookmarks);
    if (data.videos) saveData('videos', data.videos);
    if (data.theme) localStorage.setItem(getKey('theme'), data.theme);
    renderAll();
    alert(`Data imported successfully for profile: ${currentProfile}`);
  };
  reader.readAsText(file);
}
