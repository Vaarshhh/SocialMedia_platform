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

    // PROFILE ICON LOGIC
    const profileIcon = document.getElementById("profileIcon");
    const profileImage = localStorage.getItem("profileImage");
    if (profileIcon) {
        profileIcon.src = profileImage ? profileImage : "default-man.png";
    }

    const cameraBtn = document.getElementById("cameraBtn");
    const imageInput = document.getElementById("imageInput");

    if (cameraBtn && imageInput) {
        cameraBtn.addEventListener("click", () => imageInput.click());

        imageInput.addEventListener("change", () => {
            if (imageInput.files && imageInput.files[0]) {
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
    const username = localStorage.getItem("user") || "User";

    const comment = document.createElement("p");
    comment.innerHTML = `<strong>${username}</strong>: ${commentText}`;

    commentsDiv.appendChild(comment);
    input.value = "";
}

/* ================= SAVE POST ================= */
function savePost(btn) {
    if (btn.dataset.saved === "true") {
        showToast("Already saved ⭐");
        return;
    }

    const post = btn.parentElement;
    const text = post.querySelector("p")?.innerHTML || "";
    const img = post.querySelector("img");

    let savedPosts = JSON.parse(localStorage.getItem("savedPosts")) || [];

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

/* ================= NAVIGATION ================= */
function goToSaved() {
    window.location.href = "saved.html";
}
function goToProfile() {
    window.location.href = "profile.html";
}

/* ================= TOAST ================= */
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 2000);
}
