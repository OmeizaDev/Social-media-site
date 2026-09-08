import { appState } from "../app/appstate.js";

import {
    getStoriesFromFirestore,
    getAllUsers,
    saveStoryToFirestore
} from "../utils/storage.js";


export async function initStoryList() {

    const myStoryContainer =  document.querySelector(".my-Story");
    const feedStoriesContainer = document.querySelector(".feed-stories");

    if (!myStoryContainer || !feedStoriesContainer) {
        console.error("Story containers not found.");
        return;
    }

    // LOAD USERS FROM FIRESTORE

    try {
        const users = await getAllUsers();
        appState.users = Array.isArray(users) ? users : [];

    } 
    catch (error) {
        console.error("Failed to load users", error);
        appState.users = [];
    }

    // LOAD STORIES FROM FIRESTORE

    try {
        const stories = await getStoriesFromFirestore();
        appState.stories = Array.isArray(stories) ? stories : [];
    } 
    catch (error) {
        console.error("Failed to load stories from Firestore:", error);
        appState.stories = [];
    }

    // REMOVE EXPIRED IMAGES

    await cleanExpiredImages();
    
    // INITIAL RENDER

    renderMyStory();
    renderFeedStories();

    // UPDATE WHEN STORY CHANGES

    document.addEventListener( "storiesUpdated", async () => {
            
        try {
                const stories = await getStoriesFromFirestore();
                appState.stories = Array.isArray(stories) ? stories : [];
                await cleanExpiredImages();

                renderMyStory();
                renderFeedStories();
            } 
            catch (error) {
                console.error("Failed to refresh stories:", error);
            }

        }
    );

    // CLEAN EXPIRED IMAGES

    async function cleanExpiredImages() {
        const now = Date.now();
        const validStories = [];

        for (const story of appState.stories) {

            const originalImages = Array.isArray(story.images) ? story.images : [];

            const validImages = originalImages.filter(image => {
                return (Number(image.expiresAt) > now);
            });

            // ALL IMAGES EXPIRED

            if (validImages.length === 0) {
                continue;
            }

            // SOME IMAGES EXPIRED

            if (validImages.length !== originalImages.length) {

                story.images = validImages;

                try {
                    await saveStoryToFirestore(story);
                } 
                catch (error) {
                    console.error("Failed to update expired story:", error);
                }
            }

            validStories.push(story);
        }

        appState.stories = validStories;
    }

    // MY STORY

    function renderMyStory() {

        if (!appState.currentUser) {
            myStoryContainer.innerHTML = "";
            myStoryContainer.style.display = "none";

            return;
        }


        const myStory =  appState.stories.find(story => {
            return (String(story.userId) === String(appState.currentUser.id));
        });

        if (!myStory || !Array.isArray(myStory.images) || myStory.images.length === 0) {

            myStoryContainer.innerHTML = "";
            myStoryContainer.style.display = "none";
            return;
        }

        myStoryContainer.style.display = "";
        const latestImage = getLatestImage(myStory);
        if (!latestImage) {
            return;
        }

        myStoryContainer.innerHTML = `
            <div
                class="user-story-content"
                style="background-image: url('${latestImage.src}')"
            >
                <div class="user-img">
                    <img
                        src="${appState.currentUser.profileImage || ""}"
                        alt="${appState.currentUser.fullName || ""}"
                    >
                </div>
                <p class="story-name">
                    Your story
                </p>

            </div>
        `;


        myStoryContainer.onclick = () => {
            document.dispatchEvent(
                new CustomEvent(
                    "openStory",
                    {
                        detail: {
                            userId:
                                appState.currentUser.id
                        }
                    }
                )
            );

        };
    }

    // OTHER USERS' STORIES

    function renderFeedStories() {

        if (!appState.currentUser) {
            return;
        }

        feedStoriesContainer.innerHTML = "";

        if (!Array.isArray(appState.users) || appState.users.length === 0) {
            console.error("No users were loaded from Firestore.");
            return;
        }

        const usersWithStories = appState.users.filter(user => {
            return (String(user.id) !== String(appState.currentUser.id)); 
        })

        .map(user => {
            const story = appState.stories.find(story => {
                return (String(story.userId) === String(user.id));
            });

            if (!story || !Array.isArray(story.images) || story.images.length === 0) {
                return null;
            }

            const latestImage = getLatestImage(story);
            if (!latestImage) {
                return null;
            }
            
            return {user, story, latestImage};
        })
        .filter(Boolean);

        // NEWEST STORIES FIRST

        usersWithStories.sort((a, b) => {
            return (
                Number(b.latestImage.createdAt) -
                Number(a.latestImage.createdAt)
            );
        });

        // RENDER

        usersWithStories.forEach(
            ({ user, latestImage }) => {
                
                const storyElement = document.createElement("div");
                storyElement.classList.add("user-story");
                storyElement.dataset.userId = user.id;

                storyElement.innerHTML = `
                    <div
                        class="user-story-content"
                        style="background-image: url('${latestImage.src}')"
                    >
                        <div class="user-img">
                            <img
                                src="${user.profileImage || ""}"
                                alt="${user.fullName || ""}"
                            >
                        </div>
                        <p class="story-name">
                            ${user.fullName || ""}
                        </p>

                    </div>
                `;

                feedStoriesContainer.appendChild(storyElement);

                storyElement.addEventListener("click", () => {
                    document.dispatchEvent(
                            new CustomEvent("openStory", {
                                    detail: {
                                        userId:
                                            user.id
                                    }
                                }
                            )
                        );

                    }
                );

            }
        );
    }

    // GET LATEST IMAGE

    function getLatestImage(story) {

        if (!story || !Array.isArray(story.images) || story.images.length === 0) {
            return null;
        }

        return story.images.reduce(
            (latest, current) => {
                
                return Number(current.createdAt) > Number(latest.createdAt) ? current : latest;

            }
        );
    }
}