import { appState } from "../app/appstate.js";
import { saveStoryToFirestore } from "../utils/storage.js";

export function createStoryModal() {
    return `
        <div class="create-story-bg">
            <div class="create-story-container">

                <div class="create-story-header">
                    <div class="close-modal-btn">
                        <span class="material-symbols-outlined">close</span>
                    </div>

                    <h3>Create Story</h3>

                    <button class="post-story-btn">Post</button>
                </div>

                <div class="create-story-body">
                    <div class="user-textarea-container">

                        <div class="storyOwner">
                            <div class="storyOwnerImg">
                                <img src="${appState.currentUser?.profileImage || ""}" alt="">
                            </div>

                            <h5 class="storyOwnerName">
                                ${appState.currentUser?.fullName || ""}
                            </h5>
                        </div>

                        <textarea
                            name="createStory"
                            placeholder="What do you have in mind"
                            class="create-story-input"
                        >
                        </textarea>

                    </div>
                </div>

                <div class="uploaded-images" id="uploaded-images"></div>

                <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    multiple
                    hidden
                >

                <div class="add-picture">
                    <span class="material-symbols-outlined">
                        add_photo_alternate
                    </span>
                </div>

            </div>
        </div>
    `;
}

export function initCreateStory() {

    const textarea = document.querySelector(".create-story-input");
    const addPicture = document.querySelector(".add-picture");
    const imageUpload = document.querySelector("#image-upload");
    const modal = document.querySelector(".create-story-bg");
    const closeModalBtn = document.querySelector(".close-modal-btn");
    const postStoryBtn = document.querySelector(".post-story-btn");
    const uploadedImages = document.querySelector("#uploaded-images");
    
    // Auto resize textarea

    if (textarea) {
        textarea.addEventListener("input", () => {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        });
    }
    
    // Open image picker

    if (addPicture && imageUpload) {
        addPicture.addEventListener("click", () => {
            imageUpload.click();
        });
    }

    // Image preview

    if (imageUpload && uploadedImages) {

        imageUpload.addEventListener("change", (event) => {
            for (const file of event.target.files) {
                if (!file.type.startsWith("image/")) {
                    continue;
                }

                const reader = new FileReader();
                reader.onload = (event) => {

                    const imgContainer = document.createElement("div");
                    imgContainer.className = "uploaded-img";

                    imgContainer.innerHTML = `
                        <img
                            src="${event.target.result}"
                            alt="Uploaded image"
                        >

                        <span class="material-symbols-outlined delete-icon">
                            delete
                        </span>
                    `;
                    const deleteButton = imgContainer.querySelector(".delete-icon");
                    deleteButton.addEventListener("click", () => {
                        imgContainer.remove();
                    });

                    uploadedImages.appendChild(imgContainer);
                };

                reader.readAsDataURL(file);
            }

            imageUpload.value = "";
        });
    }

    // Open modal

    document.addEventListener("openCreateStoryModal", () => {
        if (!modal) {
            return;
        }
        modal.classList.add("active");
    });
    
    // Close modal

    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener("click", () => {
            modal.classList.remove("active");
        });
    }

    if (modal) {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.classList.remove("active");
            }
        });
    }
    
    // Publish story

    if (postStoryBtn) {
        postStoryBtn.addEventListener("click", async () => {
            if (!appState.currentUser) {
                alert("Please login first.");
                return;
            }
            const content = textarea?.value.trim() || "";
            const imageElements = uploadedImages?.querySelectorAll("img") || [];

            if (!content && imageElements.length === 0) {
                alert("Please add some content or an image.");
                return;
            }

            postStoryBtn.disabled = true;
            postStoryBtn.textContent = "Posting...";
            try {

                const now = Date.now();
                const newImages = [];
                imageElements.forEach((image) => {
                    newImages.push({
                        src: image.src,
                        createdAt: now,
                        expiresAt: now + (24 * 60 * 60 * 1000)
                    });
                });

                // Find existing story

                let myStory = appState.stories.find((story) => {
                    return String(story.userId) ===
                        String(appState.currentUser.id);

                });
                
                // Create story if none exists

                if (!myStory) {

                    myStory = {
                        id: crypto.randomUUID(),
                        userId: appState.currentUser.id,
                        content: content,
                        images: [],
                        views: []
                    };

                    appState.stories.push(myStory);
                }

                // Update content

                if (content) {
                    myStory.content = content;
                }

                // Add images

                myStory.images.push(...newImages);

                // Save to Firestore

                await saveStoryToFirestore(myStory);

                // Update UI

                document.dispatchEvent(
                    new Event("storiesUpdated")
                );

                // Reset form

                if (textarea) {
                    textarea.value = "";
                    textarea.style.height = "";
                }

                if (uploadedImages) {
                    uploadedImages.innerHTML = "";
                }

                if (modal) {
                    modal.classList.remove("active");
                }

            } 
            catch (error) {
                console.error("Failed to publish story:",
                    error
                );

                alert("Could not publish your story.");

            } 
            finally {
                postStoryBtn.disabled = false;
                postStoryBtn.textContent = "Post";
            }
        });
    }
}