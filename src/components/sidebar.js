//====== src/components/sidebar.js =======// 

export function Sidebar() {
    return `
      <div class="sidebar">
        <div class="Logo">
            <a href="index.html">
                <img src="../../images/Logo_lite.png" class="logo-image" alt="Logo">
            </a> 
        </div>
        <a href="index.html" class="menu-item" data-section="home-section">
            <span class="material-symbols-outlined">home</span> 
            <h5>Home</h5>
        </a>
        <!---- <a href="explorepage.html" class="menu-item">
            <span class="material-symbols-outlined">explore</span> 
            <h5>Explore</h5>
        </a> ---->
        <a href="chat.html" class="menu-item messages-notification" id="mobile-messages" data-section="messages">
            <span class="material-symbols-outlined">mail</span> 
            <small class="notification-count message-count hidden">0</small> 
            <h5>Messages</h5>
        </a>
        <a class="menu-item create-post-btn">
            <span class="material-symbols-outlined">add</span> 
            <h5>Create post</h5>
        </a>
       <!-- <a class="menu-item notifications" id="notification-menu">
            <span class="material-symbols-outlined">notifications</span> 
            <small class="notification-count">9+</small> 
            <h5>Notifications</h5>
            <div class="notification-popup hidden">    
                <div class="notification-content">
                    <div class="notification-image">
                        <img src="./images/Profile_img (1).png" alt="">
                    </div>
                    <div class="notification-body">
                        <div><b>Micheal John</b> accepted your friend request</div>
                        <small class="text-muted">2 Days Ago</small>
                    </div>
                </div>
                <div class="notification-content">
                    <div class="notification-image">
                        <img src="./images/Profile_img (2).jpg" alt="">
                    </div>
                    <div class="notification-body">
                        <div><b>Ibrahim Mudathir</b> Commented on your post</div>
                        <small class="text-muted">1 Hour Ago</small>
                    </div>
                </div>
                <div class="notification-content">
                    <div class="notification-image">
                        <img src="./images/Profile_img (3).jpg" alt="">
                    </div>
                    <div class="notification-body">
                        <div><b>Williams Max</b> Liked your post</div>
                        <small class="text-muted">4 Minutes Ago</small>
                    </div>
                </div>
                <div class="notification-content">
                    <div class="notification-image">
                        <img src="./images/Profile_img (4).jpg" alt="">
                    </div>
                    <div class="notification-body">
                        <div><b>Kiko Maradone</b> Tagged you on a post</div>
                        <small class="text-muted">52 Minutes Ago</small>
                    </div>
                </div>
                <div class="notification-content">
                    <div class="notification-image">
                        <img src="./images/Profile_img (5).jpg" alt="">
                    </div>
                    <div class="notification-body">
                        <div><b>Sunny Wu</b> Sent you a friend request</div>
                        <small class="text-muted">Just Now</small>
                    </div>
                </div>
            </div>
        </a> -->
        <a class="menu-item settings">
            <span class="material-symbols-outlined">settings</span> 
            <h5>Settings</h5>
        </a>
        <a class="menu-item log-out">
            <span class="material-symbols-outlined">logout</span> 
            <h5>Logout</h5>
        </a>
      </div>`;
}

export function initSidebar() {
    const sidebarList = document.querySelectorAll(".menu-item");
    const currentPage = window.location.pathname;

    // ===== FIRST: Set initial active state based on current URL =====
    sidebarList.forEach(item => {
        // Remove any existing active class first
        item.classList.remove("active");
        
        // Check if this menu item points to the current page
        if (item.href) {
            // Get the filename from the href
            const hrefPath = new URL(item.href, window.location.origin).pathname;
            
            // Compare the paths
            if (hrefPath === currentPage) {
                item.classList.add("active");
            }
        }
    });

    // ===== SECOND: Handle click events =====
    sidebarList.forEach(item => {
        item.addEventListener("click", function(e) {

            if (
                this.classList.contains("create-post-btn") ||
                this.classList.contains("log-out") ||
                this.classList.contains("settings")
            ) {
                return;
            }

            if (this.href && !this.href.startsWith("#")) {
                return;
            }
        });
    });

    // ===== Notification popup toggle =====
    const notificationMenu = document.getElementById("notification-menu");
    const popup = document.querySelector(".notification-popup");

    if (notificationMenu && popup) {
        notificationMenu.addEventListener("click", (e) => {
            e.stopPropagation();
            popup.classList.toggle("hidden");
        });

        document.addEventListener("click", (e) => {
            if (!notificationMenu.contains(e.target)) {
                popup.classList.add("hidden");
            }
        });
    }

    // ===== Logout modal =====
    const logoutButton = document.querySelector(".log-out");
    if (logoutButton) {
        logoutButton.addEventListener("click", (e) => {
            e.preventDefault();
            document.dispatchEvent(new Event("openLogoutModal"));
        });
    }

    // ===== Create Post Modal =====
    const createPostBtn = document.querySelector(".create-post-btn");
    if (createPostBtn) {
        createPostBtn.addEventListener("click", (e) => {
            e.preventDefault();
            document.dispatchEvent(new Event("openCreatePostModal"));
        });
    }

    // ===== Settings/Change Password ===== //
    
    const changePasswordBtn = document.querySelector(".settings");
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener("click", (e) => {
            e.preventDefault();
            document.dispatchEvent(new Event("openResetPassword"));
        });
    }
}
