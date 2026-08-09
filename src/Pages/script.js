import {logoutModal, initLogoutModal} from "../components/Logout-modal.js";
document.querySelector(".logout-popup").innerHTML = logoutModal();
initLogoutModal();

import {initSidebar, Sidebar} from "../components/sidebar.js";
document.querySelector(".left").innerHTML = Sidebar();
initSidebar();

import {messageList, initMessageList} from "../components/message-list.js";
document.querySelector(".right").innerHTML = messageList();
initMessageList();

import {newMsgModal, initNewMsgModal} from "../components/newMsgModal.js";
document.querySelector(".start-chat-popup").innerHTML = newMsgModal();
initNewMsgModal();

import {postComments, initpostComments} from "../components/post-comments.js";
document.querySelector(".post-comments").innerHTML = postComments();
initpostComments();

import {createPost, initCreatePost} from "../components/createPost.js";
document.querySelector(".create-post").innerHTML = createPost();
initCreatePost();

import {resetPassword, initResetPassword} from "../components/resetPassword.js";
document.querySelector(".change-password-popup").innerHTML = resetPassword();
initResetPassword();

//================== Home Page, initNewMsgModal, newMsgModal =====================


const homeSection = document.querySelector("#home-section");
const messageSection = document.querySelector("#messages-section");
const messageMenu = document.querySelector("#mobile-messages");


// Like Counter

const likeButtons = document.querySelectorAll(".like-btn");

likeButtons.forEach(button => {

    const icon = button.querySelector(".like-icon");
    const likeCount = button.querySelector(".like-count");

    const post = button.closest(".feed-post");
    const likeFigure = post.querySelector(".like-count-figure");

    let liked = false;

    // Initial values
    let buttonLikes = 2200;
    let figureLikes = 2224;

    button.addEventListener("click", () => {

        if (!liked) {
            liked = true;

            icon.classList.add("filled");
            buttonLikes++;
            figureLikes++;

        } else {
            liked = false;

            icon.classList.remove("filled");
            buttonLikes--;
            figureLikes--;
        }

        likeCount.textContent = (buttonLikes / 1000).toFixed(1) + "k";
        likeFigure.innerHTML = `<b>${figureLikes.toLocaleString()} others</b>`;
    });

});

//========== Button Component ===========//
const commentButtons = document.querySelectorAll(".comment-btn");
commentButtons.forEach(button=>{
    button.addEventListener("click", ()=>{
        document.dispatchEvent(
            new Event("openComments")
        );
    });
});

// ====== Listen for message click from component

document.addEventListener("messageSelected", (e) => {

    window.location.href =
        `chat.html?user=${encodeURIComponent(e.detail.user)}`;

});

document.addEventListener("friendSelected", (e) => {

    const user = e.detail.user;

    window.location.href =
        `chat.html?user=${encodeURIComponent(user)}`;

});

// Open Create Post Modal

const createPostBtn = document.querySelector(".create-btn");
    createPostBtn.addEventListener("click", () => {
        document.dispatchEvent(
            new Event("openCreatePostModal")
        );
    });