/*
Main function to obtain data from the API.
Call this function to build a complete URL and to obtain data.  
*/

async function getOpenTriviaData(optionsURI) {
  let baseURL = "https://opentdb.com/";
  let completeURL = baseURL + optionsURI;
  try {
    let response = await fetch(completeURL);
    return await response.json();
  } catch (error) {
    let errorMessage = "Failed to load data from the OpenTriviaDB API. Please reload page and try again.";
    alert(error.name + ": " + errorMessage);
  }
}

/* 
Get trivia categories when clicking on "Choose Category".
Use the jQuery .one() method to only call the API on the first click. 
A large part of the code below was copied from https://www.javascripttutorial.net/javascript-fetch-api/ and later modified.
*/

async function displayOpenTriviaCategories() {
  let categoriesHTML = $("#form-category").html();
  let categoriesURI = "api_category.php";
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
Control the range slider for the time duration.
*/

$("#form-time-switch").change(function () {
  if ($(this).prop("checked")) {
    $("#form-time-duration").removeAttr("disabled");
  } else {
    $("#form-time-duration").prop("disabled", true);
  }
});

/* 
Gather the values from the form and create the URI for the API call.
The code below was copied from https://stackoverflow.com/questions/169506/obtain-form-input-fields-using-jquery/1443005#1443005 and later modified.
*/

$("#form-main").submit(function (event) {
  event.preventDefault();
  let optionsURI = $(this).serialize();
  let timeInterval = $("#form-time-duration").val();
  displayOpenTriviaQuestions(optionsURI, timeInterval);
});

/*
Function for managing the game and displaying questions.
Remove the offcanvas backdrop effect from the body when starting the game.
*/

async function displayOpenTriviaQuestions(optionsURI, timeInterval) {
  $("body").removeAttr("class data-bs-padding-right style");
  $(".game-area").html("");
  $(".game-area").addClass("d-flex flex-wrap justify-content-center align-content-between");
  $(".game-area").append('<div class="question-area w-100"></div>');
  $(".game-area").append('<div class="answer-area w-100"></div>');
  $(".question-area").html("");
  $(".answer-area").html("");
  let questionsURI = "api.php?" + optionsURI;
  let questionsRecieved = await getOpenTriviaData(questionsURI);
  let questionsArray = questionsRecieved.results;
  let questionIndex = 0;
  displayNextQuestion(questionsArray, questionIndex);
}

/*
Display next question when an answer is submitted
*/

function displayNextQuestion(questionsArray, questionIndex) {
  if (questionIndex < questionsArray.length) {
    let questionCurrent = questionsArray[questionIndex];
    let correctAnswer = questionCurrent.correct_answer;
    let questionsHTML = `<p class="text-center">${questionCurrent.question}</p>`
    let answersArray = questionCurrent.incorrect_answers;
    answersArray.push(correctAnswer);
    answersArray = shuffle(answersArray);
    let answersHTML = answersArray.map(function (answer) {
      return `<button class="btn btn-primary text-center">${answer}</button>`
    });
    $(".question-area").html(questionsHTML);
    $(".answer-area").html(answersHTML);
    $(".answer-area > button").click(function () {
      let submittedAnswer = $(this).html();
      if (submittedAnswer === correctAnswer) {
        $(this).removeClass("btn-primary").addClass("btn-success");
        $(this).siblings().removeClass("btn-primary").addClass("btn-danger");
      } else if (submittedAnswer !== correctAnswer) {
        $(".answer-area > button:contains(" + correctAnswer + ")").removeClass("btn-primary").addClass("btn-success");
        $(".answer-area > button:contains(" + correctAnswer + ")").siblings().removeClass("btn-primary").addClass("btn-danger");
      }
      questionIndex += 1;
      setTimeout(() => {
        displayNextQuestion(questionsArray, questionIndex)
      }, 2000);
    });
  } else {
    alert("game finished");
  }
}

/*
The function below was copied in its entirety from
https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array/6274381#6274381
*/

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/*
Load the categories when the document is ready. 
*/

$(document).ready(displayOpenTriviaCategories);