document.addEventListener("DOMContentLoaded", () => {
    const savedFeed = document.getElementById("savedFeed");
    const savedPosts = JSON.parse(localStorage.getItem("savedPosts")) || [];

    if (savedPosts.length === 0) {
        savedFeed.innerHTML = "<p style='text-align:center;'>No saved posts yet ⭐</p>";
        return;
    }

    savedPosts.forEach(post => {
        const div = document.createElement("div");
        div.className = "post";

        div.innerHTML = `
            <p>${post.text}</p>
            ${post.image ? `<img src="${post.image}" />` : ""}
        `;

        savedFeed.appendChild(div);
    });
});

function goBack() {
    window.location.href = "home.html";
}
