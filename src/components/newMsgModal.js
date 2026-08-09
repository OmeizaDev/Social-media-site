// src/components/newMsgModal.js
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
                <input type="text" class="search-input-friends" placeholder="Search friends">
            </div>
            <div class="friend-list-container">
                <div class="message-list friends-list" data-user="Micheal Quins">
                    <div class="chat-profile-image">
                        <img src="../images/Profile_img (2).jpg" class="profile-img" alt="">
                    </div>
                    <div class="message-body friend-name">
                        <h5>Micheal Quins</h5>
                        <p class="Text-muted">Mike_quins5</p>
                    </div>
                </div>
                <div class="message-list friends-list" data-user="Jaquine Chaplin">
                    <div class="chat-profile-image">
                        <img src="../images/Profile_img (3).jpg" class="profile-img" alt="">
                    </div>
                    <div class="message-body friend-name">
                        <h5>Jaquine Chaplin</h5>
                        <p class="Text-muted">Jaq_Chaln</p>
                    </div>
                </div>
                <div class="message-list friends-list" data-user="Alexis Sanchez">
                    <div class="chat-profile-image">
                        <img src="../images/Profile_img (4).jpg" class="profile-img" alt="">
                    </div>
                    <div class="message-body friend-name">
                        <h5>Alexis Sanchez</h5>
                        <p class="Text-muted">EL_Sanche</p>
                    </div>
                </div>
                <div class="message-list friends-list" data-user="Jonny Mctavish">
                    <div class="chat-profile-image">
                        <img src="../images/Profile_img (6).jpg" class="profile-img" alt="">
                    </div>
                    <div class="message-body friend-name">
                        <h5>Jonny Mctavish</h5>
                        <p class="Text-muted">_Soap</p>
                    </div>
                </div>
                <div class="message-list friends-list" data-user="Ibrahim Micheal">
                    <div class="chat-profile-image">
                        <img src="../images/Profile_img (5).jpg" class="profile-img" alt="">
                    </div>
                    <div class="message-body friend-name">
                        <h5>Ibrahim Micheal</h5>
                        <p class="Text-muted">Ibrah_mike</p>
                    </div>
                </div>
            </div>
            <div class="no-friends-result hidden">
                <p>No result found</p>
            </div>
        </div>
    </div>`;
}

export function initNewMsgModal() {
    const modal = document.querySelector(".message-friend-modal-overlay");

    document.addEventListener("openFriendModal", () => {
        if (modal) modal.classList.remove("hidden");
    });

    const friends = document.querySelectorAll(".friends-list");
    friends.forEach(friend => {
        friend.addEventListener("click", () => {
            document.dispatchEvent(
                new CustomEvent("friendSelected", {
                    detail: { user: friend.dataset.user }
                })
            );
            if (modal) modal.classList.add("hidden");
        });
    });

    const closeModal = document.querySelector(".header-icon");
    if (closeModal) {
        closeModal.addEventListener("click", () => {
            if (modal) modal.classList.add("hidden");
        });
    }

    // Search functionality
    const searchInput = document.querySelector(".search-input-friends");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            const friendItems = document.querySelectorAll(".friends-list");
            const noResult = document.querySelector(".no-friends-result");
            let hasResults = false;

            friendItems.forEach(item => {
                const name = item.querySelector("h5")?.textContent?.toLowerCase() || "";
                const username = item.querySelector(".Text-muted")?.textContent?.toLowerCase() || "";
                
                if (name.includes(query) || username.includes(query)) {
                    item.style.display = "";
                    hasResults = true;
                } else {
                    item.style.display = "none";
                }
            });

            if (noResult) {
                noResult.classList.toggle("hidden", hasResults);
            }
        });
    }
}