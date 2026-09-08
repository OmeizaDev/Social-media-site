import { appState } from "../app/appstate.js";
import { saveStoryToFirestore } from "../utils/storage.js";

export function storyViewer() {

    return `
        <div class="story-viewer hidden">

            <div class="story-viewer-container">

                <div class="story-progress-container"></div>

                <div class="story-viewer-header">

                    <div class="story-viewer-user">

                        <div class="story-viewer-profile">
                            <img class="story-viewer-profile-image" src="" alt="">
                        </div>

                        <div>
                            <p class="story-viewer-user-name"></p>
                            <small class="story-viewer-time"></small>
                        </div>

                    </div>

                    <button class="close-story-viewer">
                        <span class="material-symbols-outlined">
                            close
                        </span>
                    </button>

                </div>

                <img class="story-viewer-image" src="" alt="Story">

                <button class="previous-story">
                    <span class="material-symbols-outlined">
                        chevron_left
                    </span>
                </button>

                <button class="next-story">
                    <span class="material-symbols-outlined">
                        chevron_right
                    </span>
                </button>

                <div class="story-view-count">

                    <span class="material-symbols-outlined">
                        visibility
                    </span>

                    <span class="story-view-count-number">
                        0
                    </span>

                </div>

            </div>

        </div>
    `;
}

export function initStoryViewer() {

    const viewer = document.querySelector(".story-viewer");
    const image = document.querySelector(".story-viewer-image");
    const closeButton = document.querySelector(".close-story-viewer");
    const previousButton = document.querySelector(".previous-story");
    const nextButton = document.querySelector(".next-story");
    const userName = document.querySelector(".story-viewer-user-name");
    const profileImage = document.querySelector(".story-viewer-profile-image");
    const storyUploadTime = document.querySelector(".story-viewer-time");
    const viewCount = document.querySelector(".story-view-count-number");
    const progressContainer = document.querySelector(".story-progress-container");

    let currentStory = null;
    let currentUserId = null;
    let currentImageIndex = 0;
    let storyTimer = null;

    const STORY_DURATION = 5000;

    // Open story

    document.addEventListener("openStory", (event) => {

            const userId = event.detail.userId;
            currentUserId = userId;

            currentStory = appState.stories.find((story) => {
                        return String(story.userId) === String(userId);
                    });

            if (!currentStory) {
                return;
            }

            removeExpiredImages(currentStory);

            if (!currentStory.images || currentStory.images.length === 0) {
                return;
            }

            currentImageIndex = 0;
            updateUserHeader(userId);
            viewer.classList.remove("hidden");
            showCurrentImage();
        }
    );
    
    // Show current image

    function showCurrentImage() {
        clearTimeout(storyTimer);

        if (!currentStory) {
            closeViewer();
            return;
        }

        removeExpiredImages(currentStory);

        const images = currentStory.images || [];

        if (images.length === 0) {
            closeViewer();
            return;
        }

        if (currentImageIndex >= images.length) {
            moveToNextUser();
            return;
        }

        const currentImage = images[currentImageIndex];
        image.src = currentImage.src;
        updateStoryUploadTime(currentImage.createdAt);
        updateViewCount(currentStory);
        renderProgressBars(images.length);
        animateCurrentProgress();
        markStoryAsViewed(currentStory);

        storyTimer = setTimeout(() => {
                moveToNextImage();
            },
            STORY_DURATION
        );
    }

    // Remove expired images

    function removeExpiredImages(story) {

        if (!story.images) {
            return;
        }

        const now = Date.now();

        story.images = story.images.filter(
                (storyImage) => {
                    return Number(storyImage.expiresAt) > now;

                }
            );
    }

    // Time ago

    function updateStoryUploadTime(createdAt) {
        if (!storyUploadTime || !createdAt) {
            return;
        }

        storyUploadTime.textContent = getTimeAgo(createdAt);
    }

    function getTimeAgo (timestamp) {
        const now = Date.now();
        const date = Number(timestamp);

        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) {
            return "Just now";
        }

        const minutes = Math.floor(diffInSeconds / 60);

        if (minutes < 60) {
            return `${minutes}m`;
        }

        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
            return `${hours}h`;
        }
        const days = Math.floor(hours / 24);
        return `${days}d`;
    }

    // Progress bars

    function renderProgressBars(totalImages){

        progressContainer.innerHTML = "";
        for (let i = 0; i < totalImages; i++) {
            const progress = document.createElement("div");
            progress.classList.add("story-progress");

            progress.innerHTML = `
            <div class="story-progress-fill"></div> 
            `;
            progressContainer.appendChild(progress);
        }

        const bars = progressContainer.querySelectorAll(".story-progress");
        bars.forEach((bar, index) => {
                const fill = bar.querySelector(".story-progress-fill");
                if (index < currentImageIndex) {
                    fill.style.width = "100%";
                } 
                else {
                    fill.style.width = "0%";
                }
            }
        );
    }
    // Animate progress

    function animateCurrentProgress() {
        const bars =  progressContainer.querySelectorAll(".story-progress");
        const currentBar = bars[currentImageIndex];
        if (!currentBar) {
            return;
        }

        const fill = currentBar.querySelector(".story-progress-fill");
        fill.style.transition = "none";
        fill.style.width = "0%";

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                fill.style.transition = `width ${STORY_DURATION}ms linear`;
                fill.style.width = "100%";
            });
        });
    }

    // Next image

    function moveToNextImage() {
        if (!currentStory) {
            return;
        }

        if (currentImageIndex < currentStory.images.length - 1) {
            currentImageIndex++;
            showCurrentImage();

        } 
        else {
            moveToNextUser();
        }
    }

    // Previous image

    function moveToPreviousImage() {

        if (currentImageIndex > 0) {
            currentImageIndex--;
            showCurrentImage();
            return;
        }

        moveToPreviousUser();
    }
    
    // Next user

    function moveToNextUser() {

        const usersWithStories = getUsersWithStories();
        const currentIndex = usersWithStories.findIndex((story) => {
            return String(story.userId) === String(currentUserId);
        });

        if (currentIndex === -1) {
            closeViewer();
            return;
        }

        if (currentIndex < usersWithStories.length - 1) {
            const nextStory = usersWithStories[
                currentIndex + 1
            ];

            currentUserId = nextStory.userId;
            currentStory = nextStory;
            currentImageIndex = 0;
            updateUserHeader(currentUserId);
            showCurrentImage();

        } 
        else {
            closeViewer();
        }
    }

    // Previous user

    function moveToPreviousUser() {
        const usersWithStories = getUsersWithStories();
        const currentIndex = usersWithStories.findIndex((story) => {
            return String(story.userId) === String(currentUserId);
        });

        if (currentIndex <= 0) {
            return;
        }
        const previousStory =usersWithStories[
                currentIndex - 1
            ];

        currentUserId = previousStory.userId;
        currentStory = previousStory;
        currentImageIndex = currentStory.images.length - 1;
        updateUserHeader(currentUserId);
        showCurrentImage();
    }

    // Get stories

    function getUsersWithStories() {
        const now = Date.now();
        return appState.stories
            .filter((story) => {
                story.images = (story.images || [])
                        .filter((storyImage) => {
                                return Number(storyImage.expiresAt) > now;
                            }
                        );

                return (story.images && story.images.length > 0);
            })
            .sort((a, b) => {
                const aLatest = a.images[
                        a.images.length - 1
                    ];

                const bLatest = b.images[
                        b.images.length - 1
                    ];

                return Number(bLatest.createdAt) - Number(aLatest.createdAt);
            });
        }

    // ==============================
    // Update user header
    // ==============================

    function updateUserHeader(userId) {
        const user = appState.users.find((user) => {
            return String(user.id) === String(userId);
        });

        if (!user) {
            return;
        }

        userName.textContent = user.fullName || "";
        profileImage.src = user.profileImage || "";
        profileImage.alt = user.fullName || "";
    }

    // Mark story as viewed

    async function markStoryAsViewed(story) {
        if (!appState.currentUser) {
            return;
        }

        // Don't count your own story as a view

        if (String(story.userId) === String(appState.currentUser.id)) {
            updateViewCount(story);
            return;
        }

        const userId = String(appState.currentUser.id);
        if (!Array.isArray(story.views)) {
            story.views = [];
        }

        const alreadyViewed = story.views
            .map(String)
            .includes(userId);

        if (alreadyViewed) {
            updateViewCount(story);
            return;
        }

        story.views.push(userId);
        updateViewCount(story);

        // Story view

        try {
            await saveStoryToFirestore(
                story
            );

        } 
        catch (error) {
            console.error("Failed to save story view:", error);
        }
    }

    // View count

    function updateViewCount(story) {
        if (!viewCount) {
            return;
        }
        viewCount.textContent =
            Array.isArray(story.views)
                ? story.views.length
                : 0;
    }

    // Next button

    if (nextButton) {
        nextButton.addEventListener("click", (event) => {
            event.stopPropagation();
                clearTimeout(storyTimer);
                moveToNextImage();
            }
        );
    }

    // Previous button

    if (previousButton) {
        previousButton.addEventListener("click", (event) => {
            event.stopPropagation();
            clearTimeout(storyTimer);
            moveToPreviousImage();
            }
        );
    }

    // Close button

    if (closeButton) {
        closeButton.addEventListener("click", () => {
            closeViewer();
            }
        );
    }

    // Close viewer

    function closeViewer() {
        clearTimeout(storyTimer);
        viewer.classList.add("hidden");
        progressContainer.innerHTML = "";
        image.src = "";

        currentStory = null;
        currentUserId = null;
        currentImageIndex = 0;
    }
}