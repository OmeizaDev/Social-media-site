// src/components/Logout-modal.js
import { logout } from "../auth/auth.js";

export function logoutModal() {
    return `
     <div class="logout-modal-overlay hidden">
        <div class="logout-modal">
            <div class="logout-title"> 
                <h4>You will be Logged Out</h4>
                <div class="logout-icon">
                    <span class="material-symbols-outlined">close</span>
                </div>
            </div>
            <div class="option-btns"> 
                <button class="create-btn cancel-btn">Cancel</button>
                <button class="create-btn logout-btn">Logout</button>
            </div>
        </div>
    </div>`;
}

export function initLogoutModal() {
    const modal = document.querySelector(".logout-modal-overlay");
    const cancel = document.querySelector(".cancel-btn");
    const closeIcon = document.querySelector(".logout-icon");
    const logOutBtn = document.querySelector(".logout-btn");

    if (!modal) return;

    document.addEventListener("openLogoutModal", () => { 
        modal.classList.remove("hidden");
    });

    if (cancel) {
        cancel.addEventListener("click", () => {
            modal.classList.add("hidden");
        });
    }

    if (closeIcon) {
        closeIcon.addEventListener("click", () => {
            modal.classList.add("hidden");
        });
    }

    if (logOutBtn) {
        logOutBtn.addEventListener("click", () => {
            logout();
            window.location.href = "../Login-page.html";
        });
    }
}