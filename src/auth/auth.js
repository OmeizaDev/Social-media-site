import {users} from "../data/users.js";
import {saveUser} from "../utils/storage.js";

// Get all users

export function getUsers(){

    const storedUsers =
    localStorage.getItem("users");

    if(storedUsers){

        return JSON.parse(storedUsers);

    }

    localStorage.setItem("users", JSON.stringify(users));

    return users;

}

// Create account

export function createAccount(newUser){

    const allUsers = getUsers();

    allUsers.push(newUser);

    localStorage.setItem(
        "users",
        JSON.stringify(allUsers)
    );

    return newUser;

}

// Login

export function login(email,password){

    const allUsers = getUsers();

    const user =
    allUsers.find(user =>
        user.email === email &&
        user.password === password
    );

    if(user){

        saveUser(user);

        return user;

    }

    return null;

}

// Logout

export function logout(){

    localStorage.removeItem("currentUser");

}