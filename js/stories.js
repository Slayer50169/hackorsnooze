"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  //console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  let favoriteStyle;
  let ownStory = '';
  let hidden = 'hidden';
  if(currentUser){
    favoriteStyle = (currentUser.favorites.some((i) => i.storyId == story.storyId)) ? 'fa-solid' : 'fa-regular';
    ownStory = (currentUser.ownStories.some((i) => i.storyId == story.storyId)) ? '<i class="fa-solid fa-x" style="color: #ff0000;"></i>' : '';
    hidden = '';
  }
  return $(`
      <li id="${story.storyId}">
        ${ownStory}
        <i class="${favoriteStyle} fa-star ${hidden}"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small><br>
        <small class="story-author">by ${story.author}</small><br>
        <small class="story-user">posted by ${story.username}</small>
        <hr>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

$storyForm.on("submit", function(e){
  createAndSubmitStory(e);
});

function createAndSubmitStory(e){
  e.preventDefault();
  let title = $("#title").val();
  let url = $("#url").val();
  let author = $("#author").val();
  storyList.addStory(currentUser, {
    author: author,
    title: title,
    url: url
  });
  $storyForm.hide();
  $allStoriesList.show();
}