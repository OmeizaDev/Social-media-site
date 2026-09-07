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
            <form class="reset-password">
                <label>
                    Old password
                    <input type="password" class="old-password" placeholder="Enter old password">
                </label>
                <label>
                    New password
                    <input type="password" class="new-password" placeholder="Enter new password">
                </label>
                <label>
                    Confirm new password
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
    const form = document.querySelector(".reset-password");
    const closeIcon = document.querySelector(".close-icon");

    // Open modal
    document.addEventListener("openResetPassword", () => {
        if (modal) modal.classList.remove("hidden");
    });

    // Close modal
    if (closeIcon) {
        closeIcon.addEventListener("click", () => {
            modal.classList.add("hidden");
            form.reset();
        });
    }

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.add("hidden");
                form.reset();
            }
        });
    }

    // Submit form
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const oldPass = form.querySelector(".old-password")?.value || "";
            const newPass = form.querySelector(".new-password")?.value || "";
            const confirmPass = form.querySelector(".confirm-new-password")?.value || "";

            // Validation
            if (!oldPass || !newPass || !confirmPass) {
                alert("Please fill in all fields.");
                return;
            }

            if (newPass.length < 6) {
                alert("New password must be at least 6 characters.");
                return;
            }

            if (newPass !== confirmPass) {
                alert("Passwords do not match.");
                return;
            }

            // Get current user
            const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
            if (!currentUser) {
                alert("You are not logged in.");
                return;
            }

            // Verify old password
            if (currentUser.password !== oldPass) {
                alert("Your current password is incorrect.");
                return;
            }

            // Update password
            currentUser.password = newPass;
            localStorage.setItem("currentUser", JSON.stringify(currentUser));

            // Update in users list
            const users = JSON.parse(localStorage.getItem("users") || "[]");
            const index = users.findIndex((u) => String(u.id) === String(currentUser.id));
            if (index >= 0) {
                users[index] = currentUser;
                localStorage.setItem("users", JSON.stringify(users));
            }

            alert("Password changed successfully!");

            modal.classList.add("hidden");
            form.reset();
        });
    }
}