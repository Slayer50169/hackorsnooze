"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {

  $allStoriesList.show();

  updateNavOnLogin();
}

$allStoriesList.on('click', 'i', handleIconClick);
async function handleIconClick(e){
  if($(e.target).hasClass('fa-star')){
    if($(e.target).hasClass('fa-regular')){
      $(e.target).removeClass().addClass('fa-solid fa-star');
      let resp = await axios.post(`${BASE_URL}/users/${currentUser.username}/favorites/${$(e.target.parentNode)[0].id}`, {token: currentUser.loginToken});
      currentUser.favorites = resp.data.user.favorites;
    } else if ($(e.target).hasClass('fa-solid')) {
      $(e.target).removeClass().addClass('fa-regular fa-star');
      let resp = await axios.delete(`${BASE_URL}/users/${currentUser.username}/favorites/${$(e.target.parentNode)[0].id}`, {data: {token: currentUser.loginToken}});
      currentUser.favorites = resp.data.user.favorites;
    }
  } else if($(e.target).hasClass('fa-x')){
    let resp = await axios.delete(`${BASE_URL}/stories/${$(e.target.parentNode)[0].id}`, {data: {token: currentUser.loginToken}});
    $(e.target.parentNode).remove();
    for(let i of currentUser.ownStories){
      if (i.storyId == $(e.target.parentNode)[0].id)
        currentUser.ownStories.splice(currentUser.ownStories.indexOf(i), 1);
        return;
    }
    for(let i of currentUser.favorites){
      if (i.storyId == $(e.target.parentNode)[0].id)
        currentUser.favorites.splice(currentUser.favorites.indexOf(i), 1);
        return;
    }
  }
}
