"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  // if (currentUser) $createSaveStoryCheckboxes; //not needed delete once i find where the event listener  for the main a.all-nav ie the "hack or snooze" link 
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
  $('li').each(function() {
    let $currentStoryId = $(this).attr('id')
    const checkboxHTML = $(`<input type="checkbox" class="favorite-checkbox"></input>`);
    favoriteStoriesStoryIdArr.includes($currentStoryId) ? checkboxHTML.prop('checked', true) : checkboxHTML.prop('checked', false) 
    $(this).prepend(checkboxHTML);
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

