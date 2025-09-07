// ====== THEME TOGGLE ======
const themeToggle = document.getElementById("themeToggle");

// ====== PROFILE ======
let currentProfile = localStorage.getItem('currentProfile') || 'defaultUser';
document.getElementById('profileName').value = currentProfile;

function getKey(key) {
  return `${key}_${currentProfile}`;
}

function getData(key) {
  return JSON.parse(localStorage.getItem(getKey(key))) || [];
}

function saveData(key, data) {
  localStorage.setItem(getKey(key), JSON.stringify(data));
}

// ====== APPLY THEME ======
function applyTheme() {
  const savedTheme = localStorage.getItem(getKey('theme'));
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = "☀️ Light Mode";
  } else {
    document.body.classList.remove('dark');
    themeToggle.textContent = "🌙 Dark Mode";
  }
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle('dark');
  const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem(getKey('theme'), theme);
  applyTheme();
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

// ====== RENDER FUNCTIONS ======
function renderNotes() {
  const notes = getData("notes");
  const container = document.getElementById("notesList");
  container.innerHTML = "";
  notes.sort((a,b) => b.pinned - a.pinned);
  notes.forEach((note,index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <span>${note.text}</span>
      <div>
        <button onclick="togglePin('notes',${index})">${note.pinned ? '📌 Unpin' : '📍 Pin'}</button>
        <button onclick="editItem('notes',${index})">✏️ Edit</button>
        <button onclick="deleteItem('notes',${index})">❌</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderBookmarks() {
  const bookmarks = getData("bookmarks");
  const container = document.getElementById("bookmarksList");
  container.innerHTML = "";
  bookmarks.sort((a,b)=>b.pinned-a.pinned);
  bookmarks.forEach((bm,index)=>{
    const card = document.createElement("div");
    card.className="card";
    card.innerHTML=`
      <a href="${bm.url}" target="_blank">${bm.title}</a>
      <div>
        <button onclick="togglePin('bookmarks',${index})">${bm.pinned?'📌 Unpin':'📍 Pin'}</button>
        <button onclick="editItem('bookmarks',${index})">✏️ Edit</button>
        <button onclick="deleteItem('bookmarks',${index})">❌</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderVideos() {
  const videos = getData("videos");
  const container = document.getElementById("videosList");
  container.innerHTML = "";
  videos.sort((a,b)=>b.pinned-a.pinned);
  videos.forEach((vid,index)=>{
    const card=document.createElement("div");
    card.className="card";
    card.innerHTML=`
      <a href="${vid.url}" target="_blank">${vid.title}</a>
      <div>
        <button onclick="togglePin('videos',${index})">${vid.pinned?'📌 Unpin':'📍 Pin'}</button>
        <button onclick="editItem('videos',${index})">✏️ Edit</button>
        <button onclick="deleteItem('videos',${index})">❌</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderAll(){
  renderNotes();
  renderBookmarks();
  renderVideos();
}

// ====== ADD FUNCTIONS ======
function addNote() {
  const input=document.getElementById("noteInput");
  if(!input.value.trim()) return;
  const notes=getData("notes");
  notes.push({text: input.value.trim(), pinned:false});
  saveData("notes", notes);
  input.value="";
  renderAll();
}

function addBookmark() {
  const title=document.getElementById("bookmarkTitle").value.trim();
  const url=document.getElementById("bookmarkURL").value.trim();
  if(!title || !url) return;
  const bookmarks=getData("bookmarks");
  bookmarks.push({title,url,pinned:false});
  saveData("bookmarks",bookmarks);
  document.getElementById("bookmarkTitle").value="";
  document.getElementById("bookmarkURL").value="";
  renderAll();
}

function addVideo() {
  const title=document.getElementById("videoTitle").value.trim();
  const url=document.getElementById("videoURL").value.trim();
  if(!title || !url) return;
  const videos=getData("videos");
  videos.push({title,url,pinned:false});
  saveData("videos",videos);
  document.getElementById("videoTitle").value="";
  document.getElementById("videoURL").value="";
  renderAll();
}

// ====== COMMON FUNCTIONS ======
function deleteItem(type,index){
  const data=getData(type);
  data.splice(index,1);
  saveData(type,data);
  renderAll();
}
function togglePin(type,index){
  const data=getData(type);
  data[index].pinned=!data[index].pinned;
  saveData(type,data);
  renderAll();
}
function editItem(type,index){
  const data=getData(type);
  if(type==="notes"){
    const text=prompt("Edit note:",data[index].text);
    if(text) data[index].text=text;
  } else {
    const title=prompt("Edit title:",data[index].title);
    const url=prompt("Edit URL:",data[index].url);
    if(title && url){data[index].title=title; data[index].url=url;}
  }
  saveData(type,data);
  renderAll();
}

// ====== SEARCH ======
document.getElementById("searchInput").addEventListener("input",(e)=>{
  const q=e.target.value.toLowerCase();
  document.querySelectorAll(".card").forEach(c=>{
    c.style.display=c.innerText.toLowerCase().includes(q)? "flex":"none";
  });
});

// ====== PROFILE FUNCTIONS ======
function switchProfile(){
  const name=document.getElementById("profileName").value.trim();
  if(!name) return alert("Profile cannot be empty!");
  currentProfile=name;
  localStorage.setItem("currentProfile",currentProfile);
  applyTheme();
  renderAll();
  alert(`Switched to profile: ${currentProfile}`);
}

function exportData(){
  const data={
    notes:getData("notes"),
    bookmarks:getData("bookmarks"),
    videos:getData("videos"),
    theme:localStorage.getItem(getKey("theme"))
  };
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download=`${currentProfile}_backup.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(e){
  const file=e.target.files[0];
  if(!file) return;
  const reader=new FileReader();
  reader.onload=function(ev){
    const data=JSON.parse(ev.target.result);
    if(data.notes) saveData("notes",data.notes);
    if(data.bookmarks) saveData("bookmarks",data.bookmarks);
    if(data.videos) saveData("videos",data.videos);
    if(data.theme) localStorage.setItem(getKey("theme"),data.theme);
    applyTheme();
    renderAll();
    alert(`Imported data for profile: ${currentProfile}`);
  };
  reader.readAsText(file);
}

// ====== INITIALIZATION ======
window.onload=function(){
  applyTheme();
  renderAll();
  document.getElementById("importFile").addEventListener("change",importData);
};
