//========== src/pages/profile.js ==========
import { getAuthenticatedUser } from "../auth/auth.js";
import { appState } from "../app/appstate.js";
import { 
    getAllUsers, getPostsFromFirestore, getUserById, updateUserInFirestore, followUser, unfollowUser 
} from "../utils/storage.js";
import { Sidebar, initSidebar } from "../components/sidebar.js";
import { createPost, initCreatePost } from "../components/createPost.js";
import { logoutModal, initLogoutModal } from "../components/Logout-modal.js";
import { resetPassword, initResetPassword } from "../components/resetPassword.js";
import { showLoading, hideLoading } from "../components/loading.js";

// Determine which user to show

const profileContainer = document.querySelector(".profile-interface");
showLoading(profileContainer);

const loggedInUser = await getAuthenticatedUser();

if (!loggedInUser) {
    window.location.href = "./Login-page.html";
    throw new Error("Not authenticated");
}

appState.currentUser = loggedInUser;
appState.users = await getAllUsers();
appState.posts = await getPostsFromFirestore();

const params = new URLSearchParams(window.location.search);
const requestedUserId = params.get("userId");

let profileUser = loggedInUser;

if (requestedUserId && requestedUserId !== loggedInUser.id) {
    const user = await getUserById(requestedUserId);
    if (user) profileUser = user;
}

// Load components

document.querySelector(".left").innerHTML = Sidebar();
initSidebar();

document.querySelector(".create-post").innerHTML = createPost();
initCreatePost();

document.querySelector(".logout-popup").innerHTML = logoutModal();
initLogoutModal();

document.querySelector(".change-password-popup").innerHTML = resetPassword();
initResetPassword();

// DOM refs

const nameInputs = document.querySelector(".edit-name");
const usernameInput = document.querySelector(".edit-username");
const dobInput = document.querySelector(".edit-dob");
const genderInput = document.querySelector(".edit-gender");
const saveButton = document.querySelector(".save-changes");
const editButton = document.querySelector(".edit-profile-btn");
const editModal = document.querySelector(".edit-profile-popup");
const followButton = document.querySelector(".follow-btn");
const closeButton = document.querySelector(".header-icon");
const changeImageBtn = document.querySelector(".change-image-btn");
const imageInput = document.querySelector(".image-input");
const postsGrid = document.querySelector(".profile-posts");
const postCountEl = document.querySelector(".post-count");

// Show/hide edit button based on ownership

function toggleEditButton() {
    const isOwnProfile =
        String(profileUser.id) === String(loggedInUser?.id);

    if (editButton) {
        editButton.style.display = isOwnProfile ? "inline-block" : "none";
    }

    if (followButton) {
        followButton.style.display = isOwnProfile ? "none" : "inline-block";

        if (!isOwnProfile) {
            const currentUserId = String(loggedInUser?.id);

            const following = Array.isArray(profileUser.followers) 
            ? profileUser.followers.map(String) : [];

            const isFollowing = following.includes(currentUserId);
            followButton.textContent = isFollowing ? "Following" : "Follow";
            followButton.classList.toggle("following", isFollowing);
        }
    }
}
// Render profile info

function renderUserProfile() {
    document.querySelectorAll(".display-name").forEach((el) => {
        el.textContent = profileUser.fullName;
    });

    document.querySelectorAll(".display-username").forEach((el) => {
        el.textContent = profileUser.username;
    });

    document.querySelectorAll("img.userImg").forEach((img) => {
        img.src = profileUser.profileImage;
    });

    document.querySelector(".post-count").textContent = profileUser.posts || 0;
    document.querySelector(".followers-count").textContent = 
    Array.isArray(profileUser.followers) ? profileUser.followers.length : 0;

    document.querySelector(".following-count").textContent =
    Array.isArray(profileUser.following) ? profileUser.following.length : 0;

    toggleEditButton();
}

// Render profile users posts

function renderProfilePosts() {
    const allPosts = appState.posts;

    const userPosts = allPosts.filter(
        (post) => String(post.userId) === String(profileUser.id)
    );

    if (postCountEl) postCountEl.textContent = userPosts.length;

    if (userPosts.length === 0) {
        postsGrid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:2rem;color:#999;">
                No posts yet.
            </div>
        `;
        return;
    }

    postsGrid.innerHTML = userPosts
        .map((post) => {
            const image = post.images && post.images.length > 0
                ? post.images[0]
                : "./images/default-post.jpg";
            return `
                <div class="profile-post">
                    <img src="${image}" alt="Post image">
                </div>
            `;
        })
        .join("");
}

// Load edit form (only for own profile)

function loadProfileForm() {
    if (String(profileUser.id) !== String(loggedInUser?.id)) {
        // Not their own profile – don't load form
        return;
    }

    if (nameInputs) nameInputs.value = profileUser.fullName;
    if (usernameInput) usernameInput.value = profileUser.username;
    if (dobInput) dobInput.value = profileUser.dateOfBirth;
    if (genderInput) genderInput.value = profileUser.gender;
}

// Save changes only for own profile

if (saveButton) {
    saveButton.addEventListener("click", async () => {
        if (String(profileUser.id) !== String(loggedInUser?.id)) {
            alert("You can only edit your own profile.");
            return;
        }

        if (nameInputs) profileUser.fullName = nameInputs.value.trim();
        if (usernameInput) profileUser.username = usernameInput.value.trim();
        if (dobInput) profileUser.dateOfBirth = dobInput.value;
        if (genderInput) profileUser.gender = genderInput.value;

        try {
            await updateUserInFirestore(profileUser.id, {
            fullName: profileUser.fullName,
            username: profileUser.username,
            dateOfBirth: profileUser.dateOfBirth,
            gender: profileUser.gender
            });

            appState.currentUser = profileUser;

            renderUserProfile();
            renderProfilePosts();

            document.dispatchEvent(new Event("profileUpdated"));

            editModal.classList.add("hidden");

        } 
        
        catch (error) {
            console.error("Failed to update profile:", error);
            alert("Could not save profile changes.");
        }
    });
}

// Edit modal only for own profile

if (editButton && editModal) {
    editButton.addEventListener("click", () => {
        if (String(profileUser.id) !== String(loggedInUser?.id)) {
            alert("You can only edit your own profile.");
            return;
        }
        editModal.classList.remove("hidden");
        loadProfileForm();
    });
}

// Follow / Unfollow

if (followButton) {
    followButton.addEventListener("click", async () => {

        if (!loggedInUser) {
            alert("Please login first.");
            return;
        }

        if (!profileUser) {
            return;
        }

        const currentUserId = String(loggedInUser.id);
        const targetUserId = String(profileUser.id);

        if (currentUserId === targetUserId) {
            return;
        }

        const isFollowing = 
        Array.isArray(profileUser.followers) && profileUser.followers.map(String).includes(currentUserId);
        followButton.disabled = true;

        try {
            if (isFollowing) {
                await unfollowUser (currentUserId, targetUserId);
                profileUser.followers = (profileUser.followers || []) .filter(id => String(id) !== currentUserId);
                loggedInUser.following = (loggedInUser.following || []) .filter(id => String(id) !== targetUserId);
            } 
            else {
                await followUser(currentUserId, targetUserId);
                if (!Array.isArray(profileUser.followers)) {
                    profileUser.followers = [];
                }
                if (!profileUser.followers
                    .map(String)
                    .includes(currentUserId)) {
                    profileUser.followers.push(currentUserId);
                }
                if (!Array.isArray(loggedInUser.following)) {
                    loggedInUser.following = [];
                }
                if (!loggedInUser.following
                    .map(String)
                    .includes(targetUserId)) {
                    loggedInUser.following.push(targetUserId);
                }
            }

            appState.currentUser = profileUser;
            renderUserProfile();
        } 
        
        catch (error) {

            console.error("Failed to update follow status:", error);
            alert("Could not update follow status.");

        } 
        finally {
            followButton.disabled = false;
        }
    });
}

const messageBtn = document.querySelector(".msg-btn");

if (messageBtn) {
    const isMyProfile = String(profileUser.id) === String(appState.currentUser.id);
    messageBtn.style.display = isMyProfile ? "none" : "flex";
} 

if (messageBtn) {
    messageBtn.addEventListener("click", () => {
        window.location.href = `chat.html?userId=${profileUser.id}`;
    });
}

if (closeButton && editModal) {
    closeButton.addEventListener("click", () => {
        editModal.classList.add("hidden");
    });
}

// Change image (only for own profile)

if (changeImageBtn && imageInput) {
    changeImageBtn.addEventListener("click", () => {
        if (String(profileUser.id) !== String(loggedInUser?.id)) {
            alert("You can only change your own profile image.");
            return;
        }
        imageInput.click();
    });

    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async function () {
        profileUser.profileImage = reader.result;

        try {
            await updateUserInFirestore(profileUser.id, {
            profileImage: reader.result
            });

            appState.currentUser = profileUser;
            renderUserProfile();
            document.dispatchEvent(new Event("profileUpdated"));

        } 
        
        catch (error) {
            console.error("Failed to update profile image:", error);
            alert("Could not update profile image.");
        }
    };
        reader.readAsDataURL(file);
});
}

// Listen for new posts

document.addEventListener("postsUpdated", () => {
    renderProfilePosts();
});

// Start

renderUserProfile();
renderProfilePosts();
hideLoading(profileContainer);
loadProfileForm();