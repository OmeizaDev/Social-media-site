import {logoutModal, initLogoutModal} from "../components/Logout-modal.js";
document.querySelector(".logout-popup").innerHTML = logoutModal();
initLogoutModal();

import {initSidebar, Sidebar} from "../components/sidebar.js";
document.querySelector(".left").innerHTML = Sidebar();
initSidebar();

import {createPost, initCreatePost} from "../components/createPost.js";
document.querySelector(".create-post").innerHTML = createPost();
initCreatePost();

import {resetPassword, initResetPassword} from "../components/resetPassword.js";
document.querySelector(".change-password-popup").innerHTML = resetPassword();
initResetPassword();