import { appState } from "../app/appstate.js";
import { getUserById, listenToConversations } from "../utils/storage.js";
import { createUserProfileLink, initProfileLinks } from "./UserProfileLink.js";
import { getAuthenticatedUser } from "../auth/auth.js";

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

                    <input
                        type="text"
                        class="messages-search-input"
                        placeholder="Search messages"
                    >
                </div>
            </div>

            <div class="message-category-nav">
                <div class="category-item active" data-tab="primary">
                    Primary
                </div>

                <div class="category-item" data-tab="general">
                    General
                </div>

                <div class="category-item" data-tab="request">
                    Request(2)
                </div>
            </div>

            <div class="message-category-content active" id="primary">
                <div
                    class="message-list-container"
                    id="dynamic-message-list"
                ></div>
            </div>

            <div class="message-category-content" id="general">
                <div class="message-list-container">
                    <div style="padding:1rem;color:#999;text-align:center;">
                        No general messages
                    </div>
                </div>
            </div>

            <div class="message-category-content" id="request">
                <div class="message-list-container">
                    <div style="padding:1rem;color:#999;text-align:center;">
                        No requests
                    </div>
                </div>
            </div>
        </div>
    `;
}

let stopConversationListener = null;

export async function initMessageList() {
    const tabs = document.querySelectorAll(".category-item");
    const contents = document.querySelectorAll(
        ".message-category-content"
    );

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(item =>
                item.classList.remove("active")
            );

            tab.classList.add("active");

            contents.forEach(content =>
                content.classList.remove("active")
            );

            const target = document.getElementById(
                tab.dataset.tab
            );

            if (target) {
                target.classList.add("active");
            }
        });
    });

    const newMessageBtn = document.querySelector(".new-message");

    if (newMessageBtn) {
        newMessageBtn.addEventListener("click", () => {
            document.dispatchEvent(
                new Event("openFriendModal")
            );
        });
    }

    if (stopConversationListener) {
        stopConversationListener();
    }

    stopConversationListener = listenToConversations(async conversations => {
            await renderConversations(conversations);
        });
}

export async function renderConversations(conversations = []) {
    const container = document.querySelector("#dynamic-message-list");

    if (!container) return;

    appState.currentUser = await getAuthenticatedUser();
    const currentUser = appState.currentUser;
    

    if (!currentUser) {
        container.innerHTML = `
            <div style="padding:1rem;color:#999;text-align:center;">
                Please log in to see messages.
            </div>
        `;
        return;
    }

    const myConversations = conversations.filter(
        conversation => {
            const participants = conversation.participants || [];

            return participants.some(
                id => String(id) === String(currentUser.id)
            );
        }
    );

    const badge = document.querySelector(".message-count");

    const totalUnread = myConversations.reduce((total, conversation) => {
        return total + (conversation.unreadCount?.[currentUser.id] || 0);
    }, 0);

    if (badge) {
        badge.textContent = totalUnread;

        if (totalUnread > 0) {
            badge.classList.remove("hidden");
        } else {
            badge.classList.add("hidden");
        }
    }

    if (myConversations.length === 0) {
        container.innerHTML = `
            <div style="padding:1rem;color:#999;text-align:center;">
                No conversations yet. Start a new chat!
            </div>
        `;
        return;
    }

    container.innerHTML = "";

    for (const conversation of myConversations) {
        const participants = conversation.participants || [];

        const otherUserId = participants.find(
                id => String(id) !== String(currentUser.id)
            );

        if (!otherUserId) continue;

        const otherUser = await getUserById(otherUserId);

        if (!otherUser) continue;

        const profileLinkHtml = createUserProfileLink(
                otherUser.id,
                otherUser.profileImage,
                otherUser.fullName
            );
                const isMine = String(conversation.lastMessageSenderId) === String(currentUser.id);

                const preview = conversation.lastMessage
                ? conversation.lastMessage.length > 30
                    ? conversation.lastMessage.slice(0, 30) + "..."
                    : conversation.lastMessage
                : "Start chatting";

        const messageItem = document.createElement("div");

        messageItem.classList.add("message-list");

        messageItem.dataset.userId = otherUser.id;

        messageItem.dataset.conversationId = conversation.id;

        messageItem.innerHTML = `
            <div class="chat-profile-image">
                ${profileLinkHtml}
            </div>

            <div class="message-body">
                <h5>
                    ${otherUser.fullName || otherUser.username}
                </h5>

                <p class="Text-muted">
                    ${isMine ? `You: ${preview}` : preview}
                </p>
            </div>
        `;

        container.appendChild(messageItem);

        messageItem.addEventListener("click", () => {
            document.dispatchEvent(
                new CustomEvent("messageSelected", {
                    detail: {
                        userId: messageItem.dataset.userId,
                        conversationId:
                            messageItem.dataset.conversationId
                    }
                })
            );

            const layout = document.querySelector(".message-grid-container");

            if (window.innerWidth <= 768 && layout) {
                layout.classList.add("show-chat");
            }
        });
    }

    initProfileLinks();
}