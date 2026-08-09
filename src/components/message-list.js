// src/components/message-list.js
export function messageList() {
    return `
    <div class="message-container">
        <div class="message-content">
            <div class="message-header">
                <h4>Messages</h4>
                <button class="new-message create-btn">
                    <span class="material-symbols-outlined">add</span>
                </button>
            </div>
            <div class="search-messages-container">
                <button class="search-messages-btn">
                    <span class="material-symbols-outlined">search</span>
                </button>
                <input type="text" class="messages-search-input" placeholder="Search messages">
            </div>
        </div>

        <div class="message-category-nav">
            <div class="category-item active" data-tab="primary">Primary</div>
            <div class="category-item" data-tab="general">General</div>
            <div class="category-item" data-tab="request">Request(2)</div>
        </div>

        <div class="message-category-content active" id="primary">
            <div class="message-list-container">
                <div class="message-list" data-user="Micheal Quins">
                    <div class="chat-profile-image">
                        <img src="../images/Profile_img (2).jpg" class="profile-img" alt="">
                    </div>
                    <div class="message-body">
                        <h5>Micheal Quins</h5>
                        <p class="Text-muted">Just woke up bruh</p>
                    </div>
                </div>
                <div class="message-list" data-user="Williams Churchl">
                    <div class="chat-profile-image">
                        <img src="../images/Profile_img (3).jpg" class="profile-img" alt="">
                    </div>
                    <div class="message-body">
                        <h5>Williams Churchl</h5>
                        <p class="Text-muted">Let's meet tomorrow</p>
                    </div>
                </div>
                <div class="message-list" data-user="Raymond Ceasr">
                    <div class="chat-profile-image">
                        <img src="../images/Profile_img (4).jpg" class="profile-img" alt="">
                    </div>
                    <div class="message-body">
                        <h5>Raymond Ceasr</h5>
                        <p class="Text-muted">The person sent his regards</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="message-category-content" id="general">
            <div class="message-list-container">
                <div class="message-list" data-user="Wisnley Snips">
                    <div class="chat-profile-image">
                        <img src="../images/Profile_img (7).jpg" class="profile-img" alt="">
                    </div>
                    <div class="message-body">
                        <h5>Wisnley Snips</h5>
                        <p class="Text-muted">Just woke up bruh</p>
                    </div>
                </div>
                <div class="message-list" data-user="Willians Cradle">
                    <div class="chat-profile-image">
                        <img src="../images/Profile_img (6).jpg" class="profile-img" alt="">
                    </div>
                    <div class="message-body">
                        <h5>Williams Cradle</h5>
                        <p class="Text-muted">Let's meet tomorrow</p>
                    </div>
                </div>
                <div class="message-list" data-user="Godfrey Samir">
                    <div class="chat-profile-image">
                        <img src="../images/Profile_img (8).jpg" class="profile-img" alt="">
                    </div>
                    <div class="message-body">
                        <h5>Godfrey Samir</h5>
                        <p class="Text-muted">The person sent his regards</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="message-category-content" id="request">
            <div class="message-list-container">
                <div class="message-request-list" data-user="Micheal Rafael">
                    <div class="message-list">
                        <div class="chat-profile-image">
                            <img src="../images/Profile_img (4).jpg" class="profile-img" alt="">
                        </div>
                        <div class="message-body">
                            <h5>Micheal Rafael</h5>
                            <p class="Text-muted">Just woke up bruh</p>
                        </div>
                    </div>
                    <div class="action">
                        <button class="create-btn action-accept">Accept</button>
                        <button class="create-btn action-decline">Decline</button>
                    </div>
                </div>
                <div class="message-request-list" data-user="Ligau Maduro">
                    <div class="message-list">
                        <div class="chat-profile-image">
                            <img src="../images/Profile_img (5).jpg" class="profile-img" alt="">
                        </div>
                        <div class="message-body">
                            <h5>Ligau Maduro</h5>
                            <p class="Text-muted">Just woke up bruh</p>
                        </div>
                    </div>
                    <div class="action">
                        <button class="create-btn action-accept">Accept</button>
                        <button class="create-btn action-decline">Decline</button>
                    </div>
                </div>
                <div class="message-request-list" data-user="Hane Mathew">
                    <div class="message-list">
                        <div class="chat-profile-image">
                            <img src="../images/Profile_img (8).jpg" class="profile-img" alt="">
                        </div>
                        <div class="message-body">
                            <h5>Hane Mathew</h5>
                            <p class="Text-muted">Just woke up bruh</p>
                        </div>
                    </div>
                    <div class="action">
                        <button class="create-btn action-accept">Accept</button>
                        <button class="create-btn action-decline">Decline</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

export function initMessageList() {
    const tabs = document.querySelectorAll(".category-item");
    const contents = document.querySelectorAll(".message-category-content");

    function activateTab(tab) {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        contents.forEach(c => c.classList.remove("active"));
        const target = tab.dataset.tab;
        document.getElementById(target).classList.add("active");
    }

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            activateTab(tab);
        });
    });

    const newMessageBtn = document.querySelector(".new-message");
    if (newMessageBtn) {
        newMessageBtn.addEventListener("click", () => {
            document.dispatchEvent(new Event("openFriendModal"));
        });
    }

    const messages = document.querySelectorAll(".message-list");
    messages.forEach(message => {
        message.addEventListener("click", () => {
            const user = message.dataset.user;
            document.dispatchEvent(
                new CustomEvent("messageSelected", {
                    detail: { user: user }
                })
            );
        });
    });
}