import { addCommentToFirestore, getPostsFromFirestore } from "../utils/storage.js";
import { appState } from "../app/appstate.js";
import { createUserProfileLink, initProfileLinks } from "../components/UserProfileLink.js";

export function postComments() {
    const defaultImage = "./images/Profile_img (0).jpg";
    const currentUser = appState.currentUser;

    return `
        <div class="post-comment-bg hidden">
            <div class="post-comment-content">

                <div class="post-header">
                    <div class="post-owner">
                        <div class="post-owner-img poster">
                            <img src="${defaultImage}" alt="">
                        </div>

                        <h5 class="post-owner-name">
                            Micheal Charlie
                        </h5>
                    </div>

                    <div class="header-icon">
                        <span class="material-symbols-outlined">close</span>
                    </div>
                </div>

                <div class="comment-body" id="comment-body">
                    <div class="loading-comments">
                        Loading comments...
                    </div>
                </div>

                <div class="post-input-container">
                    <div class="post-owner-img your-image">
                        <img
                            src="${currentUser?.profileImage || defaultImage}"
                            alt=""
                        >
                    </div>

                    <textarea
                        name="comment"
                        placeholder="Add a comment..."
                        class="comment-text-area"
                        rows="1"
                    ></textarea>

                    <button
                        class="send-comment-btn"
                        aria-label="Send comment"
                    >
                        <span class="material-symbols-outlined">send</span>
                    </button>
                </div>

            </div>
        </div>
    `;
}

export function initpostComments() {
    const modal = document.querySelector(".post-comment-bg");
    const commentBody = document.querySelector("#comment-body");
    const textarea = document.querySelector(".comment-text-area");
    const sendBtn = document.querySelector(".send-comment-btn");

    let currentPostId = null;
    let currentPostOwner = null;

    // OPEN COMMENTS MODAL

    document.addEventListener("openComments", async (event) => {
        if (!modal) {
            console.error("Comment modal not found.");
            return;
        }

        currentPostId = event.detail?.postId || null;
        if (!currentPostId) return;
        modal.classList.remove("hidden");

        // Load comments
        await loadComments(currentPostId);

        // Find post from appState
        const post = appState.posts.find(
            (post) => String(post.id) === String(currentPostId)
        );

        if (post) {
            const author = appState.users.find(
                (user) => String(user.id) === String(post.userId)
            );

            currentPostOwner = author || null;

            const posterImg = modal.querySelector(".poster img");
            const posterName = modal.querySelector(".post-owner-name");

            if (posterImg && currentPostOwner) {
                posterImg.src =
                    currentPostOwner.profileImage ||
                    "./images/Profile_img (0).jpg";
            }

            if (posterName && currentPostOwner) {
                posterName.textContent =
                    currentPostOwner.fullName ||
                    currentPostOwner.username ||
                    "";
            }
        }

        setTimeout(() => {
            if (textarea) textarea.focus();
        }, 100);
    });

    // CLOSE MODAL

    const closeBtn = modal?.querySelector(".header-icon");

    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    if (modal) {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            modal &&
            !modal.classList.contains("hidden")
        ) {
            closeModal();
        }
    });

    function closeModal() {
        if (modal) {
            modal.classList.add("hidden");
        }

        if (textarea) {
            textarea.value = "";
            textarea.style.height = "auto";
        }

        currentPostId = null;
        currentPostOwner = null;
    }

    // LOAD COMMENTS

    async function loadComments(postId) {        if (!commentBody) return;

        try {
            const posts = await getPostsFromFirestore();

            const post = posts.find(
                (post) => String(post.id) === String(postId)
            );

            if (!post) {
                commentBody.innerHTML = `
                    <div class="no-comments">
                        Post not found.
                    </div>
                `;
                return;
            }

            const comments = Array.isArray(post.comments)
                ? post.comments
                : [];

            if (comments.length === 0) {
                commentBody.innerHTML = `
                    <div class="no-comments">
                        No comments yet. Be the first!
                    </div>
                `;
                return;
            }

            const fallbackUser = {
                id: null,
                fullName: "Unknown",
                username: "unknown",
                profileImage: "./images/Profile_img (0).jpg"
            };

            let html = "";

            comments.forEach((comment) => {
                const commenter = appState.users.find(
                    (user) => String(user.id) === String(comment.userId)
                );

                const user = commenter || fallbackUser;
                const timeAgo = getTimeAgo(comment.createdAt);

                const profileLinkHtml = user.id
                    ? createUserProfileLink(
                          user.id,
                          user.profileImage,
                          user.fullName
                      )
                    : `
                        <img
                            src="${user.profileImage}"
                            alt="${user.fullName}"
                            style="
                                width:100%;
                                height:100%;
                                object-fit:cover;
                                border-radius:50%;
                            "
                        >
                    `;

                html += `
                    <div class="comment">

                        <div class="post-owner-img commenter">
                            ${profileLinkHtml}
                        </div>

                        <div class="user-details-comment">

                            <div class="username-date">
                                <h5 class="user-name">
                                    ${user.fullName}
                                </h5>

                                <span class="comment-date">
                                    ${timeAgo}
                                </span>
                            </div>

                            <p class="comment-text">
                                ${comment.text}
                            </p>

                        </div>

                    </div>
                `;
            });

            commentBody.innerHTML = html;
            commentBody.scrollTop = commentBody.scrollHeight;

            initProfileLinks();
        } catch (error) {
            console.error("Failed to load comments:", error);

            commentBody.innerHTML = `
                <div class="no-comments">
                    Failed to load comments.
                </div>
            `;
        }
    }

    // SEND COMMENT

    if (sendBtn && textarea && commentBody) {
        const sendComment = async () => {            
            const text = textarea.value.trim();
            if (!text || !currentPostId) return;

            const currentUser = appState.currentUser;

            if (!currentUser) {
                alert("Please login to comment.");
                return;
            }

            const post = appState.posts.find(
                (post) => String(post.id) === String(currentPostId)
            );

            if (!post) {
                alert("Post not found.");
                return;
            }

            const newComment = {
                id: crypto.randomUUID(),
                userId: currentUser.id,
                text,
                createdAt: new Date().toISOString()
            };

            try {
                await addCommentToFirestore(currentPostId, newComment);

                // Refresh posts from Firebase
                appState.posts = await getPostsFromFirestore();

                // Refresh comments
                await loadComments(currentPostId);

                document.dispatchEvent(new Event("commentsUpdated"));

                textarea.value = "";
                textarea.style.height = "auto";
                textarea.focus();
            } catch (error) {
                console.error("Failed to save comment:", error);
                alert("Could not post comment.");
            }
        };

        // Send button
        sendBtn.addEventListener("click", sendComment);

        // Press Enter to send
        textarea.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendComment();
            }
        });

        // Auto resize textarea
        textarea.addEventListener("input", () => {
            textarea.style.height = "auto";
            textarea.style.height =
                Math.min(textarea.scrollHeight, 80) + "px";
        });
    }

    // TIME AGO

    function getTimeAgo(dateString) {
        const now = Date.now();
        const date = new Date(dateString).getTime();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return "Just now";

        const minutes = Math.floor(diffInSeconds / 60);
        if (minutes < 60) return `${minutes}m ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;

        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;

        const weeks = Math.floor(days / 7);
        if (weeks < 4) return `${weeks}w ago`;

        const months = Math.floor(days / 30);
        if (months < 12) return `${months}mo ago`;

        const years = Math.floor(days / 365);
        return `${years}y ago`;
    }
}