import { deleteDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { db, auth } from "../firebase/firebase.js";

import { doc, setDoc, getDoc, getDocs, collection, query, orderBy,
    updateDoc, arrayUnion, arrayRemove, onSnapshot, where
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Users 

export async function getAllUsers() {
    try {
        const snapshot = await getDocs (collection(db, "users"));

        const firestoreUsers = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return firestoreUsers;
    } 
    catch (error) {
        console.error("Failed to load users", error);
        return [];
    }
}

export async function getUserById(userId) {
    const snapshot = await getDoc(
        doc(db, "users", String(userId))
    );

    if (!snapshot.exists()) {
        return null;
    }

    return {
        id: snapshot.id,
        ...snapshot.data()
    };
}

export async function saveUserToFirestore(user) {
    await setDoc (doc
    (db, "users", user.id), user);
}

export async function updateUserInFirestore(userId, updates) {

    await updateDoc(
        doc(db, "users", userId), updates
    );
}

export async function followUser(currentUserId, targetUserId) {
    await updateDoc(
        doc(db, "users", currentUserId), {
            following: arrayUnion(targetUserId)
        }
    );

    await updateDoc(
        doc(db, "users", targetUserId), {
            followers: arrayUnion(currentUserId)
        }
    );
}

export async function unfollowUser(currentUserId, targetUserId) {
    await updateDoc(
        doc(db, "users", currentUserId),
        {
            following: arrayRemove(targetUserId)
        }
    );

    await updateDoc(
        doc(db, "users", targetUserId),
        {
            followers: arrayRemove(currentUserId)
        }
    );
}

// Posts 

export async function addCommentToFirestore(postId, comment) {
    await updateDoc(
        doc(db, "posts", postId),
        {
            comments: arrayUnion(comment)
        }
    );
}

export async function likePost(postId, userId) {
    await updateDoc(
        doc(db, "posts", postId),
        {
            likes: arrayUnion(userId)
        }
    );
}

export async function unlikePost(postId, userId) {
    await updateDoc(
        doc(db, "posts", postId),
        {
            likes: arrayRemove(userId)
        }
    );
}

export async function savePostToFirestore(post) {
    await setDoc(
        doc(db, "posts", post.id), post
    );
}

export async function getPostsFromFirestore() {
    const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}


// Stories 

export async function saveStoryToFirestore(story) {
    await setDoc(
        doc(db, "stories", story.userId), story
    );
}

// Get all stories 

export async function getStoriesFromFirestore() {
    const snapshot = await getDocs(collection(db, "stories"));

    const stories = snapshot.docs.map(doc => ({
        userId: doc.id,
        ...doc.data()
    }));

    // Remove expired images automatically

    const now = Date.now();
    const currentUserId = auth.currentUser?.uid;

    for (const story of stories) {
        const validImages = (story.images || []).filter(
            image => image.expiresAt > now
        );

        // Only update/delete YOUR story
        if (
            story.userId === currentUserId &&
            validImages.length !== story.images.length
        ) {
            if (validImages.length === 0) {
                await deleteDoc(doc(db, "stories", story.userId));
            } else {
                await saveStoryToFirestore({
                    ...story,
                    images: validImages
                });
            }
        }

        story.images = validImages;
    }

    return stories.filter(
        story => story.images?.length
    );
}

//  Story views

export async function updateStoryViews(userId, views) {
    await updateDoc(
        doc(db, "stories", userId),
        { views }
    );
}

// Listen to stories in realtime

export function listenToStories(callback) {
    const q = query(
        collection(db, "stories"),
        orderBy("updatedAt", "desc")
    );

    return onSnapshot(q, snapshot => {
        const stories = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        callback(stories);
    });
}

// Delete story completely

export async function deleteStory(userId) {
    await deleteDoc(doc(db, "stories", userId));
}

// Messages 

export function getConversationId(userA, userB) {
    return [
        String(userA),
        String(userB)
    ]
        .sort()
        .join("_");
}

export async function saveMessageToFirestore(conversationId, message) {
    await setDoc(
        doc(db, "conversations", conversationId),
        {
            participants: message.participants,
            lastMessage: message.text,
            lastMessageAt: message.createdAt,
            lastMessageSenderId: message.senderId,
            unreadCount: {
                [message.receiverId]: 1,
                [message.senderId]: 0
            }
        },
        { merge: true }
    );

    await setDoc(
        doc(db, "conversations", conversationId, "messages", message.id), message
    );
}

export async function getMessagesFromFirestore(conversationId) {
    const q = query(
        collection(db, "conversations", conversationId, "messages"),
        orderBy("createdAt", "asc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

export function listenToMessages(conversationId, callback) {
    const q = query(
        collection(db, "conversations", conversationId, "messages"),
        orderBy("createdAt", "asc")
    );

    return onSnapshot(
        q, snapshot => {
            const messages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

            callback(messages);
        }
    );
}

// Realtime conversation list

export function listenToConversations(callback) {

    const uid = auth.currentUser?.uid;

    if (!uid) return () => {};

    const q = query(
        collection(db, "conversations"),
        where("participants", "array-contains", uid),
        orderBy("lastMessageAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {

        callback(
            snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        );

    });

}

export async function getConversationsFromFirestore() {
    const snapshot = await getDocs(
        collection(db, "conversations")
    );

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

export async function getConversationByParticipants(userA, userB) {
    const conversationId = getConversationId(userA, userB);

    const snapshot = await getDoc(
        doc(db, "conversations", conversationId)
    );

    if (!snapshot.exists()) return null;

    return {
        id: snapshot.id,
        ...snapshot.data()
    };
}
