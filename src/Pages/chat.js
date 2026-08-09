import {messageList, initMessageList} from "../components/message-list.js";
document.querySelector(".messageList").innerHTML = messageList();
initMessageList();

import {Sidebar, initSidebar} from "../components/sidebar.js";
document.querySelector(".left").innerHTML = Sidebar();
initSidebar();

import {logoutModal, initLogoutModal} from "../components/Logout-modal.js";
document.querySelector(".logout-popup").innerHTML = logoutModal();
initLogoutModal();

import {newMsgModal, initNewMsgModal} from "../components/newMsgModal.js";
document.querySelector(".start-chat-popup").innerHTML = newMsgModal();
initNewMsgModal();

import {createPost, initCreatePost} from "../components/createPost.js";
document.querySelector(".create-post").innerHTML = createPost();
initCreatePost();

import {resetPassword, initResetPassword} from "../components/resetPassword.js";
document.querySelector(".change-password-popup").innerHTML = resetPassword();
initResetPassword();

const textarea = document.querySelector(".chat-input");

textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
});

// =========== Chat Active State ==========//

function openChat(user){

    document.querySelector(".empty-chat").classList.add("hidden");

    document.querySelector(".chat-content").classList.remove("hidden");

    document.querySelector(".chat-input-container").classList.remove("hidden");

    document.querySelector(".user-name").textContent = user;

}

document.addEventListener("messageSelected",(e)=>{

    openChat(e.detail.user);

});

document.addEventListener("friendSelected",(e)=>{

    openChat(e.detail.user);

});
// ============ Custom event for logout Modal =========== //

document.querySelector(".new-chat-btn").addEventListener("click",()=>{

    document.dispatchEvent(
        new Event("openFriendModal")
    );

});

const params = new URLSearchParams(window.location.search);

const user = params.get("user");

if(user){

    document.querySelector(".empty-chat").classList.add("hidden");
    document.querySelector(".chat-content").classList.remove("hidden");
    document.querySelector(".user-name").textContent = user;

}
const sendButton = document.querySelector(".send-message-btn");
const chatBody = document.querySelector(".chat-body-container");

sendButton.addEventListener("click", () => {

    const message = textarea.value.trim();

    if(message === "") return;


    const newMessage = document.createElement("div");

    newMessage.classList.add("message", "sent");


    newMessage.innerHTML = `
        <div class="message-box">
            <p class="message-text">
                ${message}
            </p>
            <span class="message-time">Now</span>
        </div>

        <div class="sender-image">
            <img src="../images/Profile_img (9).jpg" alt="">
        </div>
    `;


    chatBody.appendChild(newMessage);


    textarea.value = "";

    // scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;

});




