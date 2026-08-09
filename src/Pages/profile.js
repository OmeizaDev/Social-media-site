import {users} from "../data/users.js";
import {saveUser, getUser} from "../utils/storage.js";

import {Sidebar, initSidebar} from "../components/sidebar.js";
import {createPost, initCreatePost} from "../components/createPost.js";
import {logoutModal, initLogoutModal} from "../components/Logout-modal.js";
import {resetPassword, initResetPassword} from "../components/resetPassword.js";



// =======================
// Load Components
// =======================

document.querySelector(".left").innerHTML = Sidebar();
initSidebar();


document.querySelector(".create-post").innerHTML = createPost();
initCreatePost();


document.querySelector(".logout-popup").innerHTML = logoutModal();
initLogoutModal();


document.querySelector(".change-password-popup").innerHTML = resetPassword();
initResetPassword();



// =======================
// Profile Elements
// =======================


// =======================
// Current User
// =======================

//let user = getUser();


if(!user){
   user = users[0];
   saveUser(user);

}


const nameInputs = document.querySelector(".edit-name");
const usernameInput = document.querySelector(".edit-username");
const dobInput = document.querySelector(".edit-dob");
const genderInput = document.querySelector(".edit-gender");

const saveButton = document.querySelector(".save-changes");



// =======================
// Render Profile
// =======================

function renderUserProfile(){


    // Name everywhere

    document.querySelectorAll(".display-name").forEach(element=>{

        element.textContent = user.fullName;

    });



    // Username everywhere

    document
    .querySelectorAll(".display-username")
    .forEach(element=>{

        element.textContent = user.username;

    });



    // Images everywhere

    document
    .querySelectorAll("img.profile-img")
    .forEach(image=>{

        image.src = user.profileImage;

    });



    // Stats

    document.querySelector(".post-count")
    .textContent = user.posts;


    document.querySelector(".followers-count")
    .textContent = user.followers;


    document.querySelector(".following-count")
    .textContent = user.following;


}



// =======================
// Fill Edit Form
// =======================

function loadProfileForm(){


    nameInputs.value = user.fullName;

    usernameInput.value = user.username;

    dobInput.value = user.dateOfBirth;

    genderInput.value = user.gender;


}



// =======================
// Save Changes
// =======================

saveButton.addEventListener("click",()=>{

    user.fullName = nameInputs.value.trim();
    user.username = usernameInput.value.trim();
    user.dob = dobInput.value;
    user.gender = genderInput.value;

    saveUser(user);
    renderUserProfile();

    document.querySelector(".edit-profile-popup").classList.add("hidden");

});



// =======================
// Edit Modal
// =======================


const editButton =
document.querySelector(".edit-profile-btn");


const editModal =
document.querySelector(".edit-profile-popup");


const closeButton =
document.querySelector(".header-icon");



editButton.addEventListener("click",()=>{

    editModal.classList.remove("hidden");

    loadProfileForm();

});



closeButton.addEventListener("click",()=>{

    editModal.classList.add("hidden");

});

const changeImageBtn =
document.querySelector(".change-image-btn");

const imageInput =
document.querySelector(".image-input");

changeImageBtn.addEventListener("click", () => {

    imageInput.click();

});

imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if (!file) return;

});

imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {

        user.profileImage = reader.result;

        renderUserProfile();

    };

    reader.readAsDataURL(file);

});

// =======================
// Start Page
// =======================


renderUserProfile();

loadProfileForm();