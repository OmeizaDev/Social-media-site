// src/components/createPost.js
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
                            <img src="../images/Profile_img (0).jpg" alt="">
                        </div>
                        <h5 class="postOwnerName">Micheal Charlie</h5>
                    </div>
                    <textarea 
                        name="createPost" 
                        placeholder="What do you have in mind" 
                        class="create-post-input"
                    ></textarea>
                </div>
            </div>
            <div class="uploaded-images" id="uploaded-images">
                <!-- Images will be added here -->
            </div>
            <input type="file" id="image-upload" accept="image/*" multiple hidden>
            <div class="add-picture">
                <span class="material-symbols-outlined">add_photo_alternate</span>
            </div>
        </div>
    </div>`;
}

export function initCreatePost() {
    const textarea = document.querySelector(".create-post-input");
    const addPicture = document.querySelector(".add-picture");
    const imageUpload = document.querySelector("#image-upload");
    const createPostModal = document.querySelector(".create-post-bg");
    const closeModalbtn = document.querySelector(".close-modal-btn");
    const postBtn = document.querySelector(".post-btn");
    const uploadedImages = document.querySelector("#uploaded-images");

    // Auto-resize textarea
    if (textarea) {
        textarea.addEventListener("input", () => {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        });
    }

    // Open file picker
    if (addPicture && imageUpload) {
        addPicture.addEventListener("click", () => {
            imageUpload.click();
        });
    }

    // Handle image upload
    if (imageUpload && uploadedImages) {
        imageUpload.addEventListener("change", (e) => {
            const files = e.target.files;
            
            for (let file of files) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const imgContainer = document.createElement("div");
                    imgContainer.className = "uploaded-img";
                    imgContainer.innerHTML = `
                        <img src="${event.target.result}" alt="Uploaded image">
                        <span class="material-symbols-outlined delete-icon">delete</span>
                    `;
                    
                    const deleteIcon = imgContainer.querySelector(".delete-icon");
                    deleteIcon.addEventListener("click", () => {
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
        if (createPostModal) createPostModal.classList.add("active");
    });

    // Close modal
    if (closeModalbtn) {
        closeModalbtn.addEventListener("click", () => {
            if (createPostModal) createPostModal.classList.remove("active");
        });
    }

    if (createPostModal) {
        createPostModal.addEventListener("click", (e) => {
            if (e.target === createPostModal) {
                createPostModal.classList.remove("active");
            }
        });
    }

    // Post button
    if (postBtn && textarea) {
        postBtn.addEventListener("click", () => {
            const content = textarea.value.trim();
            if (!content && uploadedImages.children.length === 0) {
                alert("Please add some content or images");
                return;
            }
            
            console.log("Posting:", { content, images: uploadedImages.children.length });
            
            textarea.value = "";
            uploadedImages.innerHTML = "";
            if (createPostModal) createPostModal.classList.remove("active");
        });
    }
}