document.addEventListener("DOMContentLoaded", () => {
    const profileUser = document.getElementById("profileUser");
    const profilePic = document.getElementById("profilePic");

    // Load user data from localStorage
    const username = localStorage.getItem("user") || "User";
    const profileName = localStorage.getItem("profileName") || username;
    const profileImage = localStorage.getItem("profileImage") || "";

    profileUser.textContent = profileName;

    if (profileImage) {
        profilePic.src = profileImage;
    }

    // Followers data
    const followersCount = document.getElementById("followersCount");
    const followBtn = document.getElementById("followBtn");

    followersCount.textContent = localStorage.getItem("followers") || 0;

    if (localStorage.getItem("isFollowing") === "true") {
        followBtn.textContent = "Following";
        followBtn.classList.add("following");
    }

    // CUSTOM PROFILE PIC UPLOAD BUTTON
    const editPicBtn = document.getElementById("editPicBtn");
    const fileInput = document.getElementById("profileImageInput");

    editPicBtn.addEventListener("click", () => {
        fileInput.click();
    });
});


// Follow / Unfollow
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

// Save profile data
function saveProfile() {
    const nameInput = document.getElementById("nameInput");
    const profileImageInput = document.getElementById("profileImageInput");

    const newName = nameInput.value.trim();
    if (newName) {
        localStorage.setItem("profileName", newName);
    }

    if (profileImageInput.files && profileImageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = () => {
            localStorage.setItem("profileImage", reader.result);
            location.reload(); // reload to show image
        };
        reader.readAsDataURL(profileImageInput.files[0]);
    } else {
        location.reload();
    }
}

function goBack() {
    window.location.href = "home.html";
}
