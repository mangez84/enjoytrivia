/*
Main function to obtain data from the API.
Call this function to build a complete URL and to obtain data.  
*/

async function getOpenTriviaData(optionURI) {
  let baseURL = 'https://opentdb.com/';
  let completeURL = baseURL + optionURI;
  try {
    let response = await fetch(completeURL);
    return await response.json();
  } catch (error) {
    let errorMessage = 'Failed to load data from the OpenTriviaDB API. Please reload page and try again.';
    alert(errorMessage);
  }
}

/* 
Get trivia categories when clicking on "Choose Category".
Use the jQuery .one() method to only call the API on the first click. 
A large part of the code below was copied from https://www.javascripttutorial.net/javascript-fetch-api/ and later modified.
*/

$("#form-category").one("click", displayOpenTriviaCategories);

async function displayOpenTriviaCategories() {
  let categoriesHTML = $("#form-category").html();
  let categoriesURI = 'api_category.php';
  let categories = await getOpenTriviaData(categoriesURI);
  categories.trivia_categories.forEach(category => {
    let categoriesHTMLOption = `<option value="${category.id}">${category.name}</option>`;
    categoriesHTML += categoriesHTMLOption;
  });

  $("#form-category").html(categoriesHTML);
}

/* 
A basic display of the number of questions.
*/

$("#form-number").on("input", function () {
  let value = $(this).val();
  $("#form-number-counter").html(value);
});

/* 
A basic display of the time limit for each question.
*/

$("#form-time-duration").on("input", function () {
  let value = $(this).val();
  $("#form-time-duration-counter").html(value);
});

/* 
Gather the values from the form and create the URI for the API call.
The code below was copied from https://stackoverflow.com/questions/169506/obtain-form-input-fields-using-jquery/1443005#1443005 and later modified.
*/

$("#form-main").submit(function (event) {
  event.preventDefault();
  let optionURI = $(this).serialize();
  displayOpenTriviaQuestions(optionURI);
});

/*
Temporary function to "start" the game and display questions.
Remove the offcanvas backdrop effect from the body when starting the game.
Currently used for testing the API and debugging.
*/

async function displayOpenTriviaQuestions(optionURI) {
  $("body").removeAttr("class data-bs-padding-right style");
  $(".game-area").addClass("d-flex flex-wrap justify-content-center align-content-between");
  $(".game-area").html("");
  let questionsHTML = '';
  let answersHTML = '';
  let questionsURI = 'api.php?' + optionURI;
  let questions = await getOpenTriviaData(questionsURI);
  questions.results.forEach(question => {
    let questionsHTMLOption = `<p class="text-center">${question.question}</p>`;
    questionsHTML += questionsHTMLOption;
    let answersHTMLOption = `<p class="text-center">${question.correct_answer}</p>`;
    answersHTML += answersHTMLOption;
    question.incorrect_answers.forEach(incorrect_answer => {
      console.log(incorrect_answer);
    });
  });

  $(".game-area").append('<div class="question-area w-100"></div>');
  $(".game-area").append('<div class="answer-area w-100"></div>');
  $(".question-area").html(questionsHTML);
  $(".answer-area").html(answersHTML);
}