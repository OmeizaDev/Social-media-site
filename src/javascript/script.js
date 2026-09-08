import { appState } from "../app/appstate.js";
import { logoutModal, initLogoutModal } from "../components/Logout-modal.js";
import { initSidebar, Sidebar } from "../components/sidebar.js";
import { messageList, initMessageList } from "../components/message-list.js";
import { newMsgModal, initNewMsgModal } from "../components/newMsgModal.js";
import { postComments, initpostComments } from "../components/post-comments.js";
import { createPost, initCreatePost } from "../components/createPost.js";
import { resetPassword, initResetPassword } from "../components/resetPassword.js";
import { createUserProfileLink, initProfileLinks } from "../components/UserProfileLink.js";
import { createStoryModal, initCreateStory } from "../components/createStory.js";
import { initStoryList } from "../components/storyList.js";
import { storyViewer, initStoryViewer } from "../components/storyViewer.js";
import { getAllUsers, getPostsFromFirestore, savePostToFirestore, likePost, unlikePost, getStoriesFromFirestore } from "../utils/storage.js";
import { getAuthenticatedUser } from "../auth/auth.js";
import { showLoading, hideLoading } from "../components/loading.js";

// Load application data

const feed = document.querySelector(".feeds-container");
showLoading(feed);
appState.currentUser = await getAuthenticatedUser();

if (!appState.currentUser) {
    window.location.href = "../../pages/Login-page.html";
    throw new Error("User not authenticated.");
}

// Init App

async function initApp() {
    try {
        appState.users = await getAllUsers();
        appState.stories = await getStoriesFromFirestore();
        appState.posts = await getPostsFromFirestore();
        renderPosts();

    } catch (error) {
        console.error("Failed to initialize app:", error);
        renderPosts();
        hideLoading(feed);
    }
}

// If user is not logged in

if (!appState.currentUser) {
    window.location.href = "../../pages/Login-page.html";
}

// Load Components

initStoryList();

document.querySelector(".story-viewer-wrapper").innerHTML = storyViewer();
initStoryViewer();

document.querySelector(".create-story-modal").innerHTML = createStoryModal();
initCreateStory();

document.querySelector(".logout-popup").innerHTML = logoutModal();
initLogoutModal();

document.querySelector(".left").innerHTML = Sidebar();
initSidebar();

document.querySelector(".right").innerHTML = messageList();
initMessageList();

document.querySelector(".start-chat-popup").innerHTML = newMsgModal();
initNewMsgModal();

document.querySelector(".post-comments").innerHTML = postComments();
initpostComments();

document.querySelector(".create-post").innerHTML = createPost();
initCreatePost();

document.querySelector(".change-password-popup").innerHTML = resetPassword();
initResetPassword();

// Display current user's image

const userImages = document.querySelectorAll(".userImg");

userImages.forEach(image => {
    image.src = appState.currentUser.profileImage;
});

// ============== Story ==============//

const createStory = document.querySelector(".create-story");
if (appState.currentUser) {
    createStory.style.backgroundImage = `url("${appState.currentUser.profileImage}")`;
}

// Open Create Story Modal

const createStoryBtn = document.querySelector(".create-story");
if (createStoryBtn) {
    createStoryBtn.addEventListener("click", () => {
        document.dispatchEvent(
            new Event("openCreateStoryModal")
        );
    });

}

// Feed

// Get Time Ago

function getTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
        return "Just now";
    }

    const minutes = Math.floor(diffInSeconds / 60);

    if (minutes < 60) {
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
        return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    const weeks = Math.floor(days / 7);

    if (weeks < 4) {
        return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    }

    const months = Math.floor(days / 30);

    if (months < 12) {
        return `${months} month${months > 1 ? "s" : ""} ago`;
    }

    const years = Math.floor(days / 365);

    return `${years} year${years > 1 ? "s" : ""} ago`;
}

// Image Slider

function setupImageSliders() {

    const sliders = document.querySelectorAll(".feed-image-slider");

    sliders.forEach(slider => {
        const container = slider.querySelector(".slider-container");
        const images = slider.querySelectorAll(".slide-image");
        const prevBtn = slider.querySelector(".prev-slide");
        const nextBtn = slider.querySelector(".next-slide");
        const dots = slider.querySelectorAll(".dot");

        let currentIndex = 0;
        let isTransitioning = false;

        if (images.length <= 1) {
            if (prevBtn) {
                prevBtn.style.display = "none";
            }

            if (nextBtn) {
                nextBtn.style.display = "none";
            }

            return;
        }

        container.style.display = "flex";
        container.style.transition = "transform 0.5s ease-in-out";
        container.style.width = `${images.length * 100}%`;

        images.forEach(image => {
            image.style.width = `${100 / images.length}%`;
            image.style.flexShrink = "0";
            image.style.objectFit = "cover";
            image.style.height = "100%";
        });

        function goToSlide(index) {
            if (isTransitioning) {
                return;
            }

            if (index < 0) {
                index = images.length - 1;
            }

            if (index >= images.length) {
                index = 0;
            }

            isTransitioning = true;
            currentIndex = index;

            container.style.transform = `translateX(-${currentIndex * (100 / images.length)}%)`;

            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === currentIndex);
            });

            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", event => {
                event.stopPropagation();
                goToSlide(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", event => {
                event.stopPropagation();
                goToSlide(currentIndex + 1);
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener("click", event => {
                event.stopPropagation();
                goToSlide(index);
            });
        });

        let autoSlideInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 3000);

        slider.addEventListener("mouseenter", () => {
            clearInterval(autoSlideInterval);
        });

        slider.addEventListener("mouseleave", () => {
            autoSlideInterval = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 3000);
        });

        goToSlide(0);
        
    });
}

// Render Posts

function renderPosts() {

    feed.innerHTML = "";
    appState.posts.forEach(post => {

        const author = appState.users.find(
        user => String(user.id) === String(post.userId)
        );

        if (!author) {
            console.warn("Author not found for post:", post.id, post.userId);
            return "";
        }

        const displayAuthor = author;
        if (!displayAuthor) {
            return;
        }

        const isLiked = post.likes.includes(appState.currentUser.id);
        const postElement = document.createElement("div");
        postElement.classList.add("feed-post");
        postElement.dataset.postId = post.id;
        const hasImages = post.images && post.images.length > 0;
        const timeAgo = getTimeAgo(post.createdAt);
        let imageHtml = "";
        if (hasImages) {
            if (post.images.length === 1) {

                imageHtml = `
                    <div class="feed-image-container">
                        <img src="${post.images[0]}" class="feed-image" alt="">
                    </div>
                `;

            } 
            else {

                imageHtml = `
                    <div class="feed-image-slider">
                        <div class="slider-container">
                            ${post.images.map((img, index) => `
                                <img src="${img}" class="slide-image" data-index="${index}" alt="">
                            `).join("")}
                        </div>

                        <button class="slider-nav prev-slide">
                            <span class="material-symbols-outlined">
                                chevron_left
                            </span>
                        </button>

                        <button class="slider-nav next-slide">
                            <span class="material-symbols-outlined">
                                chevron_right
                            </span>
                        </button>

                        <div class="slider-dots">
                            ${post.images.map((img, index) => `
                                <span class="dot ${index === 0 ? "active" : ""}" data-index="${index}"></span>
                            `).join("")}
                        </div>
                    </div>
                `;
            }
        }

        const profileLinkHtml = createUserProfileLink(
            displayAuthor.id,
            displayAuthor.profileImage,
            displayAuthor.fullName
        );

        postElement.innerHTML = `
            <div class="feed-post-content">
                <div class="post-header">
                    <div class="creator-details">
                        ${profileLinkHtml}
                        <div class="user-name">
                            <h3>${displayAuthor.fullName}</h3>
                            <small>
                                ${post.location || ""} • ${timeAgo}
                            </small>
                        </div>
                    </div>
                </div>

                ${imageHtml}

                <div class="feed-action-container">
                    <div class="like-comment-share">
                        <button class="post-action like-btn" data-post-id="${post.id}">
                            <span class="material-symbols-outlined like-icon ${isLiked ? "filled" : ""}">
                                favorite
                            </span>

                            <span class="like-count">
                                ${post.likes.length}
                            </span>

                        </button>

                        <button class="post-action comment-btn" data-post-id="${post.id}">
                            <span class="material-symbols-outlined">
                                comment
                            </span>
                            ${post.comments.length}
                        </button>
                    </div>
                </div>

                <div class="post-details">
                    <div class="performance-content-container">
                        <p>
                            <b>${displayAuthor.username}</b>
                            ${post.content}
                        </p>
                        ${
                            post.images && post.images.length > 1
                            ? `<small>${post.images.length} images</small>`
                            : ""
                        }
                    </div>
                </div>
            </div>
        `;

        feed.appendChild(postElement);
    });


    attachLikeListeners();
    attachCommentListeners();
    setupImageSliders();
    initProfileLinks();
}

// Like Button Event Listeners

function attachLikeListeners() {
    const likeButtons = document.querySelectorAll(".like-btn");

    likeButtons.forEach(button => {
        button.addEventListener("click", async function () {
            const postId = this.dataset.postId;

            const post = appState.posts.find(post => post.id === postId);
            if (!post) return;

            const userId = appState.currentUser.id;
            const isLiked = post.likes.includes(userId);

            try {
                if (isLiked) {
                    await unlikePost(postId, userId);
                } else {
                    await likePost(postId, userId);
                }

                appState.posts = await getPostsFromFirestore();
                renderPosts();

            } catch (error) {
                console.error("Failed to update like:", error);
            }
        });
    });
}

// Comment Button Event Listeners

function attachCommentListeners() {
    const commentButtons = document.querySelectorAll(".comment-btn");
    commentButtons.forEach(button => {
        button.addEventListener("click", function() {
            const postId = this.dataset.postId;
            document.dispatchEvent(new CustomEvent("openComments", {
                    detail: { postId: postId
                    }
                })
            );

        });

    });
}

// Listen for New Posts

document.addEventListener("postsUpdated", async () => {
    try {
        appState.posts = await getPostsFromFirestore();
        renderPosts();
    } catch (error) {
        console.error("Failed to update posts:", error);
    }
});

// Listen for Comment Updates

document.addEventListener("commentsUpdated", async () => {
    appState.posts = await getPostsFromFirestore();
    renderPosts();
});

// Message Selected

document.addEventListener("messageSelected", (event) => {
    const { userId } = event.detail;
    window.location.href = `../pages/chat.html?userId=${userId}`;
});

document.addEventListener("friendSelected", (event) => {
    const { userId } = event.detail;
    window.location.href = `../pages/chat.html?userId=${userId}`;
});

// Open Create Post

const createPostBtn = document.querySelector(".create-btn");
if (createPostBtn) {
    createPostBtn.addEventListener("click", () => {
        document.dispatchEvent(
            new Event("openCreatePostModal")
        );
    });
}

// Initial Render

initApp();

// Search Users

function setupUserSearch(inputId, resultsId) {

    const searchInput = document.querySelector(inputId);
    const searchResults = document.querySelector(resultsId);
    if (!searchInput || !searchResults) return;

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            searchResults.innerHTML = "";
            searchResults.classList.add("hidden");
            return;
        }
        const users = appState.users.filter(user =>
            String(user.id) !== String(appState.currentUser.id) &&
            (
                user.fullName.toLowerCase().includes(query) ||
                user.username.toLowerCase().includes(query)
            )
        );
        if (!users.length) {
            searchResults.innerHTML =
                `<div class="search-user"><p>No users found.</p></div>`;

            searchResults.classList.remove("hidden");
            return;
        }

        searchResults.innerHTML = users.map(user => `
            <div class="search-user" data-user-id="${user.id}">
                <img src="${user.profileImage}" alt="${user.fullName}">
                <div>
                    <h5>${user.fullName}</h5>
                    <p>@${user.username}</p>
                </div>
            </div>
        `).join("");

        searchResults.classList.remove("hidden");
        searchResults.querySelectorAll(".search-user").forEach(item => {

            item.addEventListener("click", () => {
                const userId = item.dataset.userId;
                window.location.href = `../../pages/profile-page.html?userId=${userId}`;
            });
        });
    });

    document.addEventListener("click", (e) => {

        if (!e.target.closest(".search-bar") && !e.target.closest(".mobile-search")) {
            searchResults.classList.add("hidden");
        }

    });

}


// Desktop Search
setupUserSearch("#search-users", "#search-results");

// Mobile Search
setupUserSearch("#search-users-mobile", "#search-results-mobile");

// Mobile Search Toggle

const mobileSearch = document.querySelector(".mobile-search");
const mobileSearchBtn = document.querySelector(".mobile-search-btn");
const mobileSearchInput = document.querySelector("#search-users-mobile");

if (mobileSearch && mobileSearchBtn) {
    mobileSearchBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        mobileSearch.classList.toggle("active");
        if (mobileSearch.classList.contains("active")) {
            mobileSearchInput.focus();
        }
    });

    document.addEventListener("click", (e) => {

        if (!e.target.closest(".mobile-search")) {
            mobileSearch.classList.remove("active");
            mobileSearchInput.value = "";
        }
    });

}