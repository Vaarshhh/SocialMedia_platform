/* ================= TOGGLE LOGIN / SIGNUP ================= */
function showLogin() {
  const loginBox = document.getElementById("loginBox");
  const signupBox = document.getElementById("signupBox");
  if (!loginBox || !signupBox) return;

  loginBox.style.display = "block";
  signupBox.style.display = "none";
}

function showSignup() {
  const loginBox = document.getElementById("loginBox");
  const signupBox = document.getElementById("signupBox");
  if (!loginBox || !signupBox) return;

  signupBox.style.display = "block";
  loginBox.style.display = "none";
}

/* ================= SIGNUP ================= */
function signup() {
  const username = document.getElementById("signupUsername").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const warning = document.getElementById("signupWarning");

  if (!username || !password) {
    warning.textContent = "⚠️ Fill all fields!";
    warning.style.display = "block";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some(u => u.username === username)) {
    warning.textContent = "⚠️ Username already exists!";
    warning.style.display = "block";
    return;
  }

  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));

  alert("✅ Account created! Please login.");
  showLogin();
}

/* ================= LOGIN ================= */
function login() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const warning = document.getElementById("warning");

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    warning.textContent = "⚠️ Wrong username or password!";
    warning.style.display = "block";
    return;
  }

  localStorage.setItem("user", username);
  window.location.href = "home.html";
}

/* ================= DOM LOAD ================= */
document.addEventListener("DOMContentLoaded", () => {
  const loggedUser = localStorage.getItem("user");

  if (!loggedUser && window.location.pathname.includes("home.html")) {
    window.location.href = "login.html";
    return;
  }

  if (document.getElementById("loginBox")) showLogin();

  const userSpan = document.getElementById("user");
  if (userSpan) userSpan.textContent = loggedUser || "User";

  if (window.location.pathname.includes("home.html")) {
    initImageUpload();   // ✅ IMAGE SYSTEM INIT
    loadPosts();
  }
if (window.location.pathname.includes("search.html")) {
  loadSuggestions();
}

  if (window.location.pathname.includes("profile.html")) {
    loadProfile();
  }

  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");

  if (searchBtn) searchBtn.onclick = searchUsers;
  if (searchInput) {
    searchInput.addEventListener("keydown", e => {
      if (e.key === "Enter") searchUsers();
    });
  }
});

/* ================= IMAGE UPLOAD SYSTEM ================= */
let selectedImage = "";

function initImageUpload() {
  const cameraBtn = document.getElementById("cameraBtn");
  const imageInput = document.getElementById("imageInput");

  if (!cameraBtn || !imageInput) return;

  cameraBtn.addEventListener("click", () => {
    imageInput.click();
  });

  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      selectedImage = e.target.result;
      alert("Image selected ✅");
    };
    reader.readAsDataURL(file);
  });
}

/* ================= ADD POST ================= */
function addPost() {
  const textarea = document.querySelector("textarea");
  const text = textarea.value.trim();
  const username = localStorage.getItem("user");

  if (!text && !selectedImage) {
    alert("Write something or add an image!");
    return;
  }

  let posts = JSON.parse(localStorage.getItem("posts")) || {};
  posts[username] = posts[username] || [];

  posts[username].push({
    text: text,
    image: selectedImage,
    date: new Date()
  });

  localStorage.setItem("posts", JSON.stringify(posts));

  textarea.value = "";
  selectedImage = "";
  document.getElementById("imageInput").value = "";

  alert("Post added 🎉");
  loadPosts();
}

/* ================= LOAD POSTS (HOME FEED) ================= */
function loadPosts() {
  const feed = document.getElementById("feed");
  if (!feed) return;

  const posts = JSON.parse(localStorage.getItem("posts")) || {};
  const username = localStorage.getItem("user");

  feed.innerHTML = "";

  (posts[username] || []).forEach((post, index) => {
    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <p>${post.text}</p>
      ${post.image ? `<img src="${post.image}" style="max-width:100%; border-radius:10px;">` : ""}
      <button class="delete-btn" style="margin-top:5px;">Delete</button>
    `;

    // Add click listener to delete button
    div.querySelector(".delete-btn").onclick = () => {
      deletePost(index);
    };

    feed.appendChild(div);
  });
}

/* ================= SEARCH USERS ================= */
function searchUsers() {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults"); // or suggestions

  if (!searchInput || !searchResults) return;

  const query = searchInput.value.toLowerCase().trim();
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const current = localStorage.getItem("user");

  searchResults.innerHTML = "";

  if (query === "") {
    searchResults.innerHTML = "<p>Please enter a name.</p>";
    return;
  }

  const filtered = users.filter(
    u =>
      u.username.toLowerCase().includes(query) &&
      u.username !== current
  );

  if (filtered.length === 0) {
    searchResults.innerHTML = "<p>No users found.</p>";
    return;
  }

  filtered.forEach(user => {
    const item = document.createElement("div");
    item.className = "result-item";
    item.innerHTML = `<strong>${user.username}</strong>`;

    item.onclick = () => {
      localStorage.setItem("viewProfile", user.username);
      window.location.href = "profile.html";
    };

    searchResults.appendChild(item);
  });
}
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");

if (imageInput) {
  imageInput.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
      };

      reader.readAsDataURL(file);
    }
  });
}


/* ================= DELETE POST ================= */
function deletePost(index) {
  const username = localStorage.getItem("user");
  let posts = JSON.parse(localStorage.getItem("posts")) || {};

  posts[username].splice(index, 1);
  localStorage.setItem("posts", JSON.stringify(posts));

  // Reload posts after deletion
  loadPosts();
}

/* ================= NAVIGATION ================= */
function goToProfile() {
  localStorage.setItem("viewProfile", localStorage.getItem("user"));
  window.location.href = "profile.html";
}

function goToSaved() {
  window.location.href = "saved.html";
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
function goToSearch() {
  window.location.href = "search.html";
}
function loadSuggestions() {
  const container = document.getElementById("suggestions");
  if (!container) return;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const current = localStorage.getItem("user");

  container.innerHTML = "";

  users
    .filter(u => u.username !== current)
    .slice(0, 6)
    .forEach(user => {
      const card = document.createElement("div");
      card.className = "suggestion-card";
      card.textContent = user.username;

      card.onclick = () => {
        localStorage.setItem("viewProfile", user.username);
        window.location.href = "profile.html";
      };

      container.appendChild(card);
    });
}
document.addEventListener("DOMContentLoaded", function () {

    const imageInput = document.getElementById("imageInput");

    if (imageInput) {   // 🔥 THIS FIX
        const imagePreview = document.getElementById("imagePreview");
        const previewContainer = document.getElementById("imagePreviewContainer");

        imageInput.addEventListener("change", function () {
            const file = this.files[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = function (event) {
                    imagePreview.src = event.target.result;
                    previewContainer.style.display = "block";
                };

                reader.readAsDataURL(file);
            }
        });
    }

});

