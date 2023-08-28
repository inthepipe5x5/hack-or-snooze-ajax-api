"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */
let tab = 'frontpage'
function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  tab = 'frontpage'
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */
const $createSaveStoryCheckboxes = () => {
  let favoriteStoriesStoryIdArr = currentUser.favorites.map(item => {
    return item.storyId
  })
  $('li:not(:has(input[type="checkbox"]))').each(function() {
    let $currentStoryId = $(this).attr('id');
    let $checkboxLabel = $(`<label class="checkbox-label"></label>`);
    const $checkboxHTML = $(`<input type="checkbox" class="custom-checkbox"> `);
    favoriteStoriesStoryIdArr.includes($currentStoryId) ? $checkboxHTML.prop('checked', true) : $checkboxHTML.prop('checked', false)

    let heartModifier = $checkboxHTML.prop('checked') ? 'fas' : 'far'
    let $heart = `
      <span class="favorite-input">
        <i class="${heartModifier} fa-heart"></i>
      </span>`

    $(this).prepend($checkboxLabel);
    $checkboxLabel.append($checkboxHTML, $heart)
  });
}

const $updateSaveStoryCheckBoxes = () => {
  $('li:has(input[type="checkbox"])').each(function() {
    let $checkboxLabel = $(`<label class="checkbox-label"></label>`);
    const $checkboxHTML = $(`<input type="checkbox" class="custom-checkbox"> `);
    let $closestHeartIcon = $checkboxHTML.closest('i.fa-heart')
    
    let heartModifier = $checkboxHTML.prop('checked') ? 'fas' : 'far'
    let $heart = `
      <span class="favorite-input">
        <i class="${heartModifier} fa-heart"></i>
      </span>`

    $(this).prepend($checkboxLabel);
    $checkboxLabel.append($checkboxHTML, $heart)
  });
}

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $('a.stories.hidden').each(function () {
    $(this).toggleClass('hidden')
  })
  
  $createAuthorTitleUrlForm(); //creates hidden form for users to input stories
  $createSaveStoryCheckboxes()
}

$('a#user-submit').on('click', ()=>{
  $('form#submit-form').toggleClass('hidden', function (){
    return currentUser ? true : false
  })
})

$('a#user-favorites').on('click', ()=>{
  tab = 'favorites'
  let user = currentUser ? currentUser : checkForRememberedUser()
  let $frontpageStories = $('ol#all-stories-list')
  if (user){
    $frontpageStories.empty()
    for (let faveStory of user.favorites){
      $frontpageStories.append(generateStoryMarkup(faveStory))
    }
    $createSaveStoryCheckboxes()
  } else {
    alert ('Please log in to see your favorites!')
  }
})

$('a#user-own-stories').on('click', ()=>{
  tab = 'own-stories'
  let user = currentUser ? currentUser : checkForRememberedUser()
  let $frontpageStories = $('ol#all-stories-list')
  if (user){
    $frontpageStories.empty()
    for (let ownStory of (user.ownStories || user.stories)){ //API sometimes returns user.stories instead of user.ownStories
      $frontpageStories.append(generateStoryMarkup(ownStory))
      $createSaveStoryCheckboxes()
    }
  } else {
    alert ('Please log in to see your submitted stories')
  }
})

