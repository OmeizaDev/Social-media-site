// src/components/post-comments.js
export function postComments() {
    return `
    <div class="post-comment-bg hidden">
        <div class="post-comment-content">
            <div class="post-header">
                <div class="post-owner">
                    <div class="post-owner-img poster">
                        <img src="../images/Profile_img (0).jpg" alt="">
                    </div>
                    <h5 class="post-owner-name">Micheal Charlie</h5>
                </div>
                <div class="header-icon">
                    <span class="material-symbols-outlined">close</span>
                </div>
            </div>

            <div class="comment-body">
                <div class="comment">
                    <div class="post-owner-img commenter">
                        <img src="../images/Profile_img (2).jpg" alt="">
                    </div>
                    <div class="user-details-comment">
                        <div class="username-date">
                            <h5 class="user-name">Maxwel Bundle</h5>
                            <span class="comment-date">2days Ago</span>
                        </div>
                        <p class="comment-text">I do this as routine every day before, I cant wait to start again</p>
                    </div>
                </div>
                <div class="comment">
                    <div class="post-owner-img commenter">
                        <img src="../images/Profile_img (5).jpg" alt="">
                    </div>
                    <div class="user-details-comment">
                        <div class="username-date">
                            <h5 class="user-name">Schnider Jackson</h5>
                            <span class="comment-date">2days Ago</span>
                        </div>
                        <p class="comment-text">Weldon, I wish I can do this daily but I'm too busy</p>
                    </div>
                </div>
                <div class="comment">
                    <div class="post-owner-img commenter">
                        <img src="../images/Profile_img (4).jpg" alt="">
                    </div>
                    <div class="user-details-comment">
                        <div class="username-date">
                            <h5 class="user-name">Khedira Aaron</h5>
                            <span class="comment-date">5days Ago</span>
                        </div>
                        <p class="comment-text">Kuddos man Keep up the good work</p>
                    </div>
                </div>
                <div class="comment">
                    <div class="post-owner-img commenter">
                        <img src="../images/Profile_img (3).jpg" alt="">
                    </div>
                    <div class="user-details-comment">
                        <div class="username-date">
                            <h5 class="user-name">Ibrahim Marshal</h5>
                            <span class="comment-date">6 days Ago</span>
                        </div>
                        <p class="comment-text">Till I get home then I will start all over</p>
                    </div>
                </div>
            </div>

            <div class="post-input-container">
                <div class="post-owner-img your-image">
                    <img src="../images/Profile_img (7).jpg" alt="">
                </div>
                <textarea name="comment" placeholder="Add a comment..." class="comment-text-area"></textarea>
                <button class="send-comment-btn">
                    <span class="material-symbols-outlined">send</span>
                </button>
            </div>
        </div>
    </div>`;
}

export function initpostComments() {
    const modal = document.querySelector(".post-comment-bg");
    
    document.addEventListener("openComments", () => {
        if (modal) modal.classList.remove("hidden");
    });

    const closeBtn = modal?.querySelector(".header-icon");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            if (modal) modal.classList.add("hidden");
        });
    }

    // Close on backdrop click
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.add("hidden");
            }
        });
    }

    // Send comment functionality
    const textarea = document.querySelector(".comment-text-area");
    const sendBtn = document.querySelector(".send-comment-btn");
    const commentBody = document.querySelector(".comment-body");

    if (sendBtn && textarea && commentBody) {
        const sendComment = () => {
            const text = textarea.value.trim();
            if (!text) return;

            const comment = document.createElement("div");
            comment.className = "comment";
            comment.innerHTML = `
                <div class="post-owner-img commenter">
                    <img src="../images/Profile_img (0).jpg" alt="">
                </div>
                <div class="user-details-comment">
                    <div class="username-date">
                        <h5 class="user-name">You</h5>
                        <span class="comment-date">Just now</span>
                    </div>
                    <p class="comment-text">${text}</p>
                </div>
            `;

            commentBody.appendChild(comment);
            textarea.value = "";
            commentBody.scrollTop = commentBody.scrollHeight;
        };

        sendBtn.addEventListener("click", sendComment);
        textarea.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendComment();
            }
        });
    }
}