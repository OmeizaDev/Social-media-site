// src/components/resetPassword.js
export function resetPassword() {
    return `
    <div class="changePassword-bg hidden">
        <div class="change-password-content">
            <div class="modal-header">
                <div class="header-texts">
                    <h3>Change Password</h3>
                    <p>Your password must be at least 6 characters.</p>
                </div>
                <div class="close-icon">
                    <span class="material-symbols-outlined">close</span>
                </div>
            </div>
            <form action="submit" class="reset-password">
                <label>Old password
                    <input type="password" class="old-password" placeholder="Enter old password">
                </label>
                <label>New password
                    <input type="password" class="new-password" placeholder="Enter new password">
                </label>
                <label>Confirm new password
                    <input type="password" class="confirm-new-password" placeholder="Confirm new password">
                </label>
                <button type="submit" class="create-btn change-password">Change password</button>
            </form>
            <div class="forgot-password-btn">Forgot password</div>
        </div>
    </div>`;
}

export function initResetPassword() {
    const modal = document.querySelector(".changePassword-bg");

    document.addEventListener("openResetPassword", () => {
        if (modal) modal.classList.remove("hidden");
    });

    const closeModal = document.querySelector(".close-icon");
    if (closeModal) {
        closeModal.addEventListener("click", () => {
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

    // Password change form
    const form = document.querySelector(".reset-password");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const oldPassword = form.querySelector(".old-password")?.value || "";
            const newPassword = form.querySelector(".new-password")?.value || "";
            const confirmPassword = form.querySelector(".confirm-new-password")?.value || "";

            // Validation
            if (!oldPassword || !newPassword || !confirmPassword) {
                alert("Please fill in all fields");
                return;
            }

            if (newPassword.length < 6) {
                alert("New password must be at least 6 characters");
                return;
            }

            if (newPassword !== confirmPassword) {
                alert("Passwords do not match");
                return;
            }

            // TODO: Update password logic
            console.log("Password changed successfully");
            alert("Password changed successfully!");
            
            if (modal) modal.classList.add("hidden");
            form.reset();
        });
    }
}