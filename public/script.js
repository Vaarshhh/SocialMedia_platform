/* ================= LOGIN ================= */
function login() {
    const username = document.querySelector("input[type='text']").value;
    const password = document.querySelector("input[type='password']").value;

    const correctUsername = "Vaarshhh";
    const correctPassword = "Vaarsh123";
    const warning = document.getElementById("warning");

    if (username !== correctUsername || password !== correctPassword) {
        warning.textContent = "⚠️ Wrong username or password!";
        warning.style.display = "block";
        return;
    }

    warning.style.display = "none";
    localStorage.setItem("user", username);
    window.location.href = "home.html";
}

/* ================= DOM LOAD ================= */
document.addEventListener("DOMContentLoaded", () => {
    const userSpan = document.getElementById("user");
    if (userSpan) {
        userSpan.textContent = localStorage.getItem("user") || "User";
    }

    const cameraBtn = document.getElementById("cameraBtn");
    const imageInput = document.getElementById("imageInput");

    if (cameraBtn && imageInput) {
        cameraBtn.addEventListener("click", () => imageInput.click());

        imageInput.addEventListener("change", () => {
            if (imageInput.files && imageInput.files[0]) {

                // Remove old preview
                const oldPreview = document.getElementById("imagePreview");
                if (oldPreview) oldPreview.remove();

                const img = document.createElement("img");
                img.id = "imagePreview";
                img.src = URL.createObjectURL(imageInput.files[0]);
                img.style.width = "100px";
                img.style.height = "100px";
                img.style.borderRadius = "10px";
                img.style.objectFit = "cover";

                cameraBtn.style.display = "none";
                document.querySelector(".camera-box").appendChild(img);
            }
        });
    }

    // Followers load
    const followersCount = document.getElementById("followersCount");
    const followBtn = document.getElementById("followBtn");

    if (followersCount && followBtn) {
        followersCount.textContent = localStorage.getItem("followers") || 0;

        if (localStorage.getItem("isFollowing") === "true") {
            followBtn.textContent = "Following";
            followBtn.classList.add("following");
        }
    }
});

/* ================= POST ================= */
function addPost() {
    const text = document.querySelector("textarea").value;
    const imageInput = document.getElementById("imageInput");

    if (!text) {
        alert("Write something first!");
        return;
    }

    const post = document.createElement("div");
    post.className = "post";

    let imageHTML = "";
    if (imageInput.files[0]) {
        imageHTML = `<img src="${URL.createObjectURL(imageInput.files[0])}" />`;
    }

    post.innerHTML = `
        <p>${text}</p>
        ${imageHTML}
        <div class="reactions">
            <button onclick="react(this)">👍 <span>0</span></button>
            <button onclick="react(this)">❤️ <span>0</span></button>
            <button onclick="react(this)">😂 <span>0</span></button>
        </div>

        <div class="comments-section">
            <input type="text" placeholder="Write a comment..." />
            <button onclick="addComment(this)">Post</button>
            <div class="comments"></div>
        </div>

        <button class="save-btn" onclick="savePost(this)">⭐ Save</button>
    `;

    document.querySelector(".container").appendChild(post);

    // RESET INPUTS
    document.querySelector("textarea").value = "";
    imageInput.value = "";

    // Remove preview + show button
    const preview = document.getElementById("imagePreview");
    if (preview) preview.remove();
    document.getElementById("cameraBtn").style.display = "inline-block";
}

/* ================= REACTIONS ================= */
function react(btn) {
    const span = btn.querySelector("span");
    span.textContent = Number(span.textContent) + 1;
}


/* ================= COMMENTS ================= */
function addComment(btn) {
    const input = btn.previousElementSibling;
    const commentText = input.value.trim();

    if (!commentText) return;

    const commentsDiv = btn.nextElementSibling;

    // Get logged-in username
    const username = localStorage.getItem("user") || "User";

    const comment = document.createElement("p");
    comment.innerHTML = `<strong>${username}</strong>: ${commentText}`;

    commentsDiv.appendChild(comment);
    input.value = "";
}

/* ================= SAVE POST (FIXED) ================= */
function savePost(btn) {
    const post = btn.parentElement;

    const text = post.querySelector("p")?.innerHTML || "";
    const img = post.querySelector("img");

    const savedPost = document.createElement("div");
    savedPost.className = "post";

    savedPost.innerHTML = `
        <p>${text}</p>
        ${img ? `<img src="${img.src}" />` : ""}
        <p class="time">⭐ Saved</p>
    `;

    document.getElementById("savedPosts").appendChild(savedPost);

    showToast("Post saved ⭐");
}
function toggleSaved() {
    const saved = document.getElementById("savedPosts");

    if (saved.style.display === "none") {
        loadSavedPosts();
        saved.style.display = "block";
    } else {
        saved.style.display = "none";
    }
}
function loadSavedPosts() {
    const savedDiv = document.getElementById("savedPosts");
    savedDiv.innerHTML = "";

    const savedPosts = JSON.parse(localStorage.getItem("savedPosts")) || [];

    if (savedPosts.length === 0) {
        savedDiv.innerHTML = "<p style='text-align:center;'>No saved posts ⭐</p>";
        return;
    }

    savedPosts.forEach(post => {
        const div = document.createElement("div");
        div.className = "post";

        div.innerHTML = `
            <p>${post.text}</p>
            ${post.image ? `<img src="${post.image}">` : ""}
        `;

        savedDiv.appendChild(div);
    });
}

function savePost(btn) {
    // prevent multiple saves
    if (btn.dataset.saved === "true") {
        showToast("Already saved ⭐");
        return;
    }

    const post = btn.parentElement;
    const text = post.querySelector("p")?.innerHTML || "";
    const img = post.querySelector("img");

    let savedPosts = JSON.parse(localStorage.getItem("savedPosts")) || [];

    // duplicate check
    const alreadyExists = savedPosts.some(p => p.text === text);
    if (alreadyExists) {
        showToast("Already saved ⭐");
        btn.dataset.saved = "true";
        btn.textContent = "⭐ Saved";
        return;
    }

    savedPosts.push({
        text,
        image: img ? img.src : null
    });

    localStorage.setItem("savedPosts", JSON.stringify(savedPosts));

    btn.dataset.saved = "true";
    btn.textContent = "⭐ Saved";
    btn.style.opacity = "0.6";
    btn.style.cursor = "not-allowed";

    showToast("Post saved ⭐");
}

function goToSaved() {
    window.location.href = "saved.html";
}
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 2000);
}


/* ================= FOLLOW ================= */
function toggleFollow() {
    const followersCount = document.getElementById("followersCount");
    const followBtn = document.getElementById("followBtn");

    let followers = Number(localStorage.getItem("followers")) || 0;
    let isFollowing = localStorage.getItem("isFollowing") === "true";

    if (!isFollowing) {
        followers++;
        followBtn.textContent = "Following";
        followBtn.classList.add("following");
        localStorage.setItem("isFollowing", "true");
    } else {
        followers--;
        followBtn.textContent = "Follow";
        followBtn.classList.remove("following");
        localStorage.setItem("isFollowing", "false");
    }

    followersCount.textContent = followers;
    localStorage.setItem("followers", followers);
}
