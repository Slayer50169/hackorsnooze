"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  hidePageComponents();
  $storyForm.hide();
  getAndShowStoriesOnStart();
}

$body.on("click", "#nav-all", navAllStories);

/** Show users favorited stories */
function navFavStories(){
  hidePageComponents();
  $storyForm.hide();
  storyList = new StoryList(currentUser.favorites.map(story => new Story(story)))
  putStoriesOnPage();
}

$body.on("click", "#favorites", navFavStories);

/** Show users own stories */
function navOwnStories(){
  hidePageComponents();
  $storyForm.hide();
  storyList = new StoryList(currentUser.ownStories.map(story => new Story(story)))
  putStoriesOnPage();
}

$body.on("click", "#my-stories", navOwnStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $loginLinks.show();
  $loginForm.hide();
  $signupForm.hide();
  $navUserProfile.text(`${currentUser.username}`).show();
  getAndShowStoriesOnStart();
}

function submitStoryClick(){
  $storyForm.show();
  hidePageComponents();
}

$submit.on("click", submitStoryClick);
