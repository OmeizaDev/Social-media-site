import { messageList, initMessageList } from "../components/message-list.js";
import { Sidebar, initSidebar } from "../components/sidebar.js";
import { logoutModal, initLogoutModal } from "../components/Logout-modal.js";
import { newMsgModal, initNewMsgModal } from "../components/newMsgModal.js";
import { createPost, initCreatePost } from "../components/createPost.js";
import { resetPassword, initResetPassword } from "../components/resetPassword.js";
import { appState } from "../app/appstate.js";
import { showLoading, hideLoading } from "../components/loading.js";
import { getAllUsers, saveMessageToFirestore, listenToMessages,
    getConversationId, getConversationByParticipants
} from "../utils/storage.js";
import { auth } from "../firebase/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";


showLoading(document.body);

// Authenticate

const firebaseUser = await new Promise(resolve => {
    const unsubscribe = onAuthStateChanged(
        auth, user => {
            unsubscribe();
            resolve(user);
        }
    );
});

if (!firebaseUser) {
    window.location.href = "./Login-page.html";
    throw new Error("User is not authenticated.");
}

// Load current user profile

const allUsers = await getAllUsers();

appState.users = allUsers;

appState.currentUser = allUsers.find(
    user => String(user.id) === String(firebaseUser.uid)
);

if (!appState.currentUser) {
    console.error("Firestore profile not found for:", firebaseUser.uid);

    alert("Your user profile could not be loaded.");
    throw new Error("User profile not found.");
}

// Components

document.querySelector(".messageList").innerHTML = messageList();

await initMessageList();

document.querySelector(".left").innerHTML = Sidebar();
initSidebar();

document.querySelector(".logout-popup").innerHTML = logoutModal();
initLogoutModal();

document.querySelector(".start-chat-popup").innerHTML = newMsgModal();
initNewMsgModal();

document.querySelector(".create-post").innerHTML = createPost();
initCreatePost();

document.querySelector(".change-password-popup").innerHTML = resetPassword();
initResetPassword();

// DOM

const textarea = document.querySelector(".chat-input");
const sendButton = document.querySelector(".send-message-btn");
const chatBody = document.querySelector("#chat-body-container");
const userNameEl = document.querySelector("#chat-user-name");
const headerImg = document.querySelector("#chat-header-image");
const emptyChat = document.querySelector(".empty-chat");
const chatContent = document.querySelector(".chat-content");
const chatInputContainer = document.querySelector(".chat-input-container");

// State

let currentConversationId = null;
let currentOtherUser = null;
let stopMessageListener = null;

// Render messages

function renderMessages(messages) {
    if (!chatBody) return;

    if (!messages.length) {
        chatBody.innerHTML = `
            <div class="chat-date-separator">
                No messages yet. Start the conversation!
            </div>
        `;

        return;
    }

    let html = "";
    let lastDate = "";

    messages.forEach(message => {
        const date = new Date(message.createdAt);

        const dateStr = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });

        const timeStr = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
        });

        if (dateStr !== lastDate) {
            html += `
                <div class="chat-date-separator">
                    ${dateStr}
                </div>
            `;

            lastDate = dateStr;
        }

        const isSent = String(message.senderId) === String(appState.currentUser.id);

        const sender = appState.users.find(user =>
            String(user.id) === String(message.senderId)
        );

        const senderImage = sender?.profileImage || "./images/default-profile.jpg";

        html += `
            <div class="message ${ isSent ? "sent" : "recieved" }">

                <div class="message-box">
                    <p class="message-text">
                        ${message.text}
                    </p>

                    <span class="message-time">
                        ${timeStr}
                    </span>
                </div>

                <div class="sender-image">
                    <img src="${senderImage}" alt="">
                </div>

            </div>
        `;
    });

    chatBody.innerHTML = html;
    chatBody.scrollTop = chatBody.scrollHeight;

    // Fade messages in

    requestAnimationFrame(() => {
        chatBody.classList.remove("chat-loading");
    });

    
}

// Open chat

async function openChat(userId) {

    const otherUser = appState.users.find(
        user => String(user.id) === String(userId)
    );

    if (!otherUser) return;

    currentOtherUser = otherUser;
    let existingConversation = null;

    try {
        existingConversation = await getConversationByParticipants(
        appState.currentUser.id, otherUser.id);
        console.log("Conversation lookup successful:", existingConversation);
    } 
    catch (error) {
        console.error("CONVERSATION LOOKUP FAILED:", error);
        return;
    }

    currentConversationId = existingConversation?.id || getConversationId(
    appState.currentUser.id, otherUser.id);

    emptyChat.classList.add("hidden");
    chatContent.classList.remove("hidden");
    chatInputContainer.classList.remove("hidden");

    userNameEl.textContent = otherUser.fullName;
    headerImg.src = otherUser.profileImage;

    if (stopMessageListener) stopMessageListener();

    if (existingConversation) {
        chatBody.classList.add("chat-loading");
        stopMessageListener = listenToMessages(
            currentConversationId, 
            renderMessages
        );
    } 
    else {
        renderMessages([]);
    }
}

// Message selected

document.addEventListener("messageSelected", event => {
        const userId = event.detail.userId;

        if (userId) {
            openChat(userId);
        }
    }
);

// Friend selected

document.addEventListener( "friendSelected", event => {
        const userId = event.detail.userId;

        if (!userId) return;
        openChat(userId);

        const layout = document.querySelector( ".message-grid-container" );

        if (window.innerWidth <= 768 && layout) {
            layout.classList.add("show-chat");
        }
    }
);

// New chat

document.querySelector(".new-chat-btn") ?.addEventListener ("click", () => {
    document.dispatchEvent(
        new Event ("openFriendModal"));
    }
);

// URL ?userId

const params = new URLSearchParams(
    window.location.search
);

const urlUserId = params.get("userId");

if (urlUserId) {
    await openChat(urlUserId);
}

hideLoading(document.body);

// Send message

if (sendButton && textarea) {
    sendButton.addEventListener( "click", async () => {
            const text = textarea.value.trim();

            if ( !text || !currentConversationId || !currentOtherUser ) {
                return;
            }
            const message = {
                id: crypto.randomUUID(),
                senderId: appState.currentUser.id,
                receiverId: currentOtherUser.id,
                participants: [
                    appState.currentUser.id,
                    currentOtherUser.id
                ],
                text,
                createdAt: new Date().toISOString()
            };

            try {
                await saveMessageToFirestore(currentConversationId, message);

                if (stopMessageListener) {
                    stopMessageListener();
                }

                stopMessageListener = listenToMessages(
                    currentConversationId, renderMessages
                );

                textarea.value = "";
                textarea.style.height = "auto";
            }
            catch (error) {
                console.error( "Failed to send message:", error );
                alert("Could not send message.");
            }
        }
    );

    textarea.addEventListener ("keydown", event => {

            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendButton.click();
            }

        }
    );
}