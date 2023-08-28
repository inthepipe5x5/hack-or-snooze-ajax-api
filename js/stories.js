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

  const hostName = Story.getHostName(story);
  return $(`
  <li id="${story.storyId}">
      <div class="story-container">
          <span class = "input-container">
          </span>
          <div class = "story-content-div">
              <div class="story-title">
                  <a href="${story.url}" target="_blank" class="story-link">
                      ${story.title} 
                  </a>
                  <small class="story-hostname">(${hostName})</small>
              </div>
              <div class = "story-author">
                  <small class="story-author col text-success">by ${story.author}</small>
              </div>
              <div class = "story-user">
                  <small class="story-user col text-warning">posted by ${story.username}</small>
              </div>         
          </div>
          </div> 
          <hr>
        </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");
  tab = 'frontpage'
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  if (currentUser) $createSaveStoryCheckboxes();
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


$('ol#all-stories-list').on('change', 'input[type="checkbox"]', async function () {
  let storyId = $(this).closest('li').attr('id');
  let faveOrNotBool = $(this).prop('checked'); //is checkbox ticked off = true or false
  $createSaveStoryCheckboxes()

  $('i').each(function() {
    let $checkbox = $(this).closest('li').find('input[type="checkbox"]'); // Find the closest checkbox element
    let faveOrNotBool = $checkbox.prop('checked');
    let faved = 'fas fa-heart';
    let not = 'far fa-heart';
    
    if (faveOrNotBool) {
      $(this).removeClass(not).addClass(faved); // Add the faved class
    } else {
      $(this).removeClass(faved).addClass(not); // Add the not class
    }
  });
  
  if ($(this).prop('checked')) {
    // Checkbox is checked, perform action
    currentUser ? (await User.addOrRemoveFaveStoryForCurrentUser(storyId, faveOrNotBool)) : alert('please log in to save stories to favorites')
  } else {
    // Checkbox is unchecked, perform action
    currentUser ? (await User.addOrRemoveFaveStoryForCurrentUser(storyId, faveOrNotBool)) : alert('please log in to remove stories from favorites')
    if (tab === 'favorites'){
      $(this).closest('li').remove()
    }
  }
});

$('ol#all-stories-list').on('mouseenter', 'li', async function (){
  if (currentUser){
    let realStories = [currentUser.stories, currentUser.ownStories].filter(realArray => realArray)[0]
    let ownStoriesStoryIdArr = realStories.map(item => {
      return item.storyId
    })
    if (ownStoriesStoryIdArr.includes($(this).attr('id'))) {
      let $newBtn = $(`
        <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`
      )
      $newBtn.on('click', async () => {
        await StoryList.removeStory($(this).attr('id'));
        $(this).remove();
        currentUser = await User.updateUser(); //update currentUser
      })
      $(this).append($newBtn)
    }
  }
})

$('ol#all-stories-list').on('mouseleave', 'li', () => {
  $('.trash-can').remove()
})