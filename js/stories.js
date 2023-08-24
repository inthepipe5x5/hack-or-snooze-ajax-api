"use strict";

// import $grabTitleAuthorURLInput from models.js 

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
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//adds a form to submit author, title, URL 
const $createAuthorTitleUrlForm = () => {
  let $newForm = $('<form id="submit-form" class="hidden"></form>'); // Added closing quote for id
  $('section.stories-container.container').prepend($newForm);

  const inputDataArr = ['author', 'title', 'url'];
  const placeholderDataArr = ['author name', 'story title', 'story url'];

  for (let index = 0; index < 3; index++) {
      let currentInputData = inputDataArr[index];
      let currentPlaceholder = placeholderDataArr[index];

      let $newDiv = $('<div></div>');
      let $newLabel = $(`<label for='create-${currentInputData}'>${currentInputData}</label>`);
      let $newInput = $(`<input id='create-${currentInputData}' required placeholder='${currentPlaceholder}'>`);
      $newForm.append($newDiv.append($newLabel, $newInput));
  }
  let $newButton = $(`<button type='submit'>submit</button>`)
  $newButton.on('click', (async () => {
    let input = $grabTitleAuthorURLInput()
    let $newStory = await storyList.addStory(currentUser, input)
    const $story = generateStoryMarkup($newStory);
    $allStoriesList.append($story);
  }))
  $newForm.append($newButton, '<hr>');
  return $newForm
}

const $grabTitleAuthorURLInput = (e) => {
  // $(e).preventDefault();
  let userInputObj = {
      author: null,
      title: null,
      url: null,
  }
  let $authorInput = $('input#create-author').val()
  let $titleInput = $('input#create-title').val()
  let $urlInput = $('input#create-url').val()
  
  //code here to update userInputObj
  userInputObj.author = $authorInput
  userInputObj.title = $titleInput
  userInputObj.url = $urlInput
  console.log(`userinputobj is `, userInputObj)
  return userInputObj
}

console.log(storyList)