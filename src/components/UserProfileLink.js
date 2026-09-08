export function createUserProfileLink(userId, imageSrc, altText = "Profile") {
    return `
        <div class="user-profile-link" data-user-id="${userId}">
            <img src="${imageSrc}" alt="${altText}">
        </div>
    `;
}

export function initProfileLinks() {
    const links = document.querySelectorAll(".user-profile-link");

    links.forEach(link => {
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);

        newLink.addEventListener("click", (e) => {
            e.stopPropagation();
            const userId = newLink.dataset.userId;
            if (userId) {
                window.location.href = `../../pages/profile-page.html?userId=${encodeURIComponent(userId)}`;
            }
        });
    });
}