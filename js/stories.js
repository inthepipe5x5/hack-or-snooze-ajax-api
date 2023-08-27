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
  <div class="container">
  <div class = "row">
  <li id="${story.storyId}">
      <span class="col-1">
          <input type="checkbox" class='favorite-checkbox col-1' id=${story.storyId}></input>
      </span>
      <span class="col-11">
          <span class = "col-1">
          </span>
          <div class = "d-flex flex-column bd-hightlight justify-content-start">
              <div class="col">
                  <a href="${story.url}" target="a_blank" class="story-link">
                      ${story.title} 
                  </a>
                  <small class="story-hostname">(${hostName})</small>
              </div>
              <div class = "col">
                  <small class="story-author col text-success">by ${story.author}</small>
              </div>
              <div class = "col">
                  <small class="story-user col text-warning">posted by ${story.username}</small>
              </div>         
          </div>
          </li>
      </span> 
      <hr>
</div>
</div>
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

const $grabTitleAuthorURLInput = () => {
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

// $(document).ready(async function () {
//   $('ol#all-stories-list').on('change', 'input[type="checkbox"]', await currentUser.handleFavorites(e));
// });

$(document).ready(function () {
if (currentUser)
  {
    $('ol#all-stories-list').on('change', 'input[type="checkbox"]', function () {
      if ($(this).prop('checked')) {
        // Checkbox is checked, perform action
        console.log('Checkbox checked', $(':checked').eq(-1), $(this));
        // Your code to handle the checked state
      } else {
        // Checkbox is unchecked, perform action
        console.log('Checkbox unchecked', $(':not(:checked)').eq(-1), $(this));
        // Your code to handle the unchecked state
      }
    });
  }
});
