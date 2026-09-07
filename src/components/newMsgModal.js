import { appState } from "../app/appstate.js";
import { createUserProfileLink, initProfileLinks } from "./UserProfileLink.js";

export function newMsgModal() {
    return `
    <div class="message-friend-modal-overlay hidden"> 
        <div class="message-friend-modal">
            <div class="modal-title"> 
                <h4>Friends</h4>
                <div class="header-icon">
                    <span class="material-symbols-outlined">close</span>
                </div>
            </div>
            <div class="search-friends-container">
                <button class="search-messages-btn">
                    <span class="material-symbols-outlined">search</span>
                </button>
                <input type="text" class="search-input-friends" placeholder="Search users">
            </div>
            <div class="friend-list-container" id="dynamic-friend-list">
                <!-- Friends will be rendered here dynamically -->
            </div>
            <div class="no-friends-result hidden">
                <p>No users found</p>
            </div>
        </div>
    </div>`;
}

export function initNewMsgModal() {
    const modal = document.querySelector(".message-friend-modal-overlay");
    const searchInput = document.querySelector(".search-input-friends");

    document.addEventListener("openFriendModal", () => {
        if (modal) {
            modal.classList.remove("hidden");
            renderFriendList("");
        }
    });

    const closeModal = document.querySelector(".header-icon");
    if (closeModal) {
        closeModal.addEventListener("click", () => {
            if (modal) modal.classList.add("hidden");
        });
    }

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.add("hidden");
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.trim().toLowerCase();
            renderFriendList(query);
        });
    }
}

// Render dynamic friend list

function renderFriendList(query) {
    const container = document.getElementById("dynamic-friend-list");
    const noResult = document.querySelector(".no-friends-result");
    if (!container) return;

    const currentUser = appState.currentUser;
    if (!currentUser) {
        container.innerHTML = `
        <div style="padding:1rem;color:#999;text-align:center;">
        Please log in.
        </div>`;
        return;
    }

    let allUsers = appState.users.filter(
        user => String(user.id) !== String(currentUser.id)
    );

    if (query) {
        allUsers = allUsers.filter(user =>
            user.fullName.toLowerCase().includes(query) ||
            user.username.toLowerCase().includes(query)
        );
    }

    if (allUsers.length === 0) {
        container.innerHTML = "";
        if (noResult) noResult.classList.remove("hidden");
        return;
    }

    if (noResult) noResult.classList.add("hidden");

    let html = "";
    allUsers.forEach(user => {
        const profileLinkHtml = createUserProfileLink(
            user.id,
            user.profileImage,
            user.fullName
        );

        html += `
            <div class="message-list friends-list" data-user-id="${user.id}">
                <div class="chat-profile-image">
                    ${profileLinkHtml}
                </div>
                <div class="message-body friend-name">
                    <h5>${user.fullName}</h5>
                    <p class="Text-muted">${user.username}</p>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    const friends = container.querySelectorAll(".friends-list");
    friends.forEach(friend => {
        const newFriend = friend.cloneNode(true);
        friend.parentNode.replaceChild(newFriend, friend);

        newFriend.addEventListener("click", () => {
            const userId = newFriend.dataset.userId;
            if (userId) {
                document.dispatchEvent(
                    new CustomEvent("friendSelected", {
                        detail: { userId: userId }
                    })
                );
                const modal = document.querySelector(".message-friend-modal-overlay");
                if (modal) modal.classList.add("hidden");
            }
        });
    });


    initProfileLinks();
}