export function saveUser(user){

    localStorage.setItem("currentUser",
        JSON.stringify(user)
    );

}

export function getUser(){

    const user = localStorage.getItem("currentUser");

    return user
    ? JSON.parse(user)
    : null;

}

export function logout(){

    localStorage.removeItem("currentUser");

}