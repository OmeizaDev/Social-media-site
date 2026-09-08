import { appState } from "../app/appstate.js";
import { getAuthenticatedUser } from "../auth/auth.js";


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

appState.currentUser = await getAuthenticatedUser();

if (!appState.currentUser) {
    window.location.href = "./Login-page.html";
    throw new Error("User not authenticated.");
}