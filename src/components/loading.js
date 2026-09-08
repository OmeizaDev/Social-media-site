
export function showLoading(container) {
    // Prevent duplicate loaders
    if (container.querySelector(".page-loader")) return;

    const loader = document.createElement("div");
    loader.className = "page-loader";
    loader.innerHTML = `
        <div class="loading-spinner"></div>
    `;

    container.appendChild(loader);
}

export function hideLoading(container) {
    const loader = container.querySelector(".page-loader");
    if (loader) loader.remove();
}