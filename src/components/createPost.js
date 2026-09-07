import { appState } from "../app/appstate.js";
import { savePostToFirestore } from "../utils/storage.js";

export function createPost() {
    return `
    <div class="create-post-bg">
        <div class="create-post-container">

            <div class="create-post-header">
                <div class="close-modal-btn">
                    <span class="material-symbols-outlined">close</span>
                </div>

                <h3>Create Post</h3>

                <button class="post-btn">Post</button>
            </div>

            <div class="create-post-body">
                <div class="user-textarea-container">

                    <div class="postOwner">
                        <div class="postOwnerImg">
                            <img src="${appState.currentUser.profileImage}" alt="">
                        </div>

                        <h5 class="postOwnerName">
                            ${appState.currentUser.fullName}
                        </h5>
                    </div>

                    <textarea
                        name="createPost"
                        placeholder="What do you have in mind"
                        class="create-post-input"
                    ></textarea>

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

async function compressImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement("canvas");

                const MAX_WIDTH = 500;

                let width = img.width;
                let height = img.height;

                if (width > MAX_WIDTH) {
                    height = height * (MAX_WIDTH / width);
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");

                ctx.drawImage(img, 0, 0, width, height);

                const compressed = canvas.toDataURL(
                    "image/jpeg",
                    0.6
                );

                resolve(compressed);
            };

            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    });
}

export function initCreatePost() {
    const textarea = document.querySelector(".create-post-input");
    const addPicture = document.querySelector(".add-picture");
    const imageUpload = document.querySelector("#image-upload");
    const createPostModal = document.querySelector(".create-post-bg");
    const closeModalBtn = document.querySelector(".close-modal-btn");
    const postBtn = document.querySelector(".post-btn");
    const uploadedImages = document.querySelector("#uploaded-images");
    const selectedImageFiles = [];

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

    // Upload images

    if (imageUpload && uploadedImages) {
      imageUpload.addEventListener("change", (event) => {
        const files = event.target.files;

        for (let file of files) {
            selectedImageFiles.push(file);
            const reader = new FileReader(); 
            reader.onload = function (event) {
                const imgContainer = document.createElement("div");
                imgContainer.className = "uploaded-img";

                imgContainer.innerHTML = `
                    <img src="${event.target.result}" alt="Uploaded image">
                    <span class="material-symbols-outlined delete-icon">
                        delete
                    </span>
                `;

                const deleteIcon = imgContainer.querySelector(".delete-icon");

                deleteIcon.addEventListener("click", () => {
                    const index = selectedImageFiles.indexOf(file);

                    if (index !== -1) {
                        selectedImageFiles.splice(index, 1);
                    }
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

    document.addEventListener("openCreatePostModal", () => {
        if (createPostModal) {
            createPostModal.classList.add("active");
        }
    });

    // Close modal

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => {
            createPostModal.classList.remove("active");
        });
    }

    // Close modal when clicking background

    if (createPostModal) {
        createPostModal.addEventListener("click", (event) => {
            if (event.target === createPostModal) {
                createPostModal.classList.remove("active");
            }
        });
    }

    // Create post

    if (postBtn) {
        postBtn.addEventListener("click", async () => {
            const content = textarea.value.trim();

            if (!appState.currentUser) {
                alert("Please login first.");
                return;
            }

            if (!content && uploadedImages.children.length === 0) {
                alert("Please add some content or an image.");
                return;
            }

            // Get uploaded images

            const images = [];
            try {
                for (const file of selectedImageFiles) {
                const compressedImage = await compressImage(file);
                images.push(compressedImage);
                }
            }
            catch (error) {
                console.error(error);
                alert("Image processing failed.");
                return;
            }

            // Create post object

            const newPost = {
                id: crypto.randomUUID(),
                userId: appState.currentUser.id,
                content: content,
                images: images,
                likes: [],
                comments: [],
                shares: [],
                createdAt: new Date().toISOString()
            };

          // Add post to state

            appState.posts.unshift(newPost);
            try {

                await savePostToFirestore(newPost);
                // Tell home page that posts changed

                document.dispatchEvent(new Event("postsUpdated"));

            } 
            
            catch (error) {
                console.error("Failed to save post:", error);
                alert("Could not publish your post.");
                return;
            }

            // Clear form
            textarea.value = "";
            uploadedImages.innerHTML = "";
            selectedImageFiles.length = 0;

            // Close modal
            createPostModal.classList.remove("active");
        });
    }
}