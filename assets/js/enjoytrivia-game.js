/*jshint esversion: 8 */
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
  let timeSwitch = $("#form-time-switch").prop("checked");
  let timeInterval = $("#form-time-duration").val();
  displayOpenTriviaQuestions(optionsURI, timeSwitch, timeInterval);
});

/*
Function for managing the game and displaying questions.
Remove the offcanvas backdrop effect from the body when starting the game.
*/

async function displayOpenTriviaQuestions(optionsURI, timeSwitch, timeInterval) {
  $("body").removeAttr("class data-bs-padding-right style");
  $(".instruction-area").remove();
  $(".feedback-area").remove();
  $(".game-area").empty();
  $(".game-area").addClass("flex-grow-1 d-flex flex-wrap align-content-between");
  $(".game-area").append(fetchGameHTML());
  if (timeSwitch) {
    $(".score-area-time").removeClass("text-decoration-line-through");
  }
  let questionsURI = "api.php?" + optionsURI;
  let questionsRecieved = await getOpenTriviaData(questionsURI);
  let questionsArray = questionsRecieved.results;
  let questionIndex = 0;
  displayNextQuestion(questionsArray, questionIndex, timeSwitch, timeInterval);
}

/*
Function to generate the HTML for the game area.
*/

function fetchGameHTML() {
  let gameHTML = `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center">Score:</h2>
        </div>
      </div>
      <div class="row">
        <div class="score-area col-lg-6 d-flex justify-content-around">
          <div>
            <h3>Correct:</h3>
            <p class="score-area-correct">0</p>
          </div>
          <div>
            <h3>Incorrect:</h3>
            <p class="score-area-incorrect">0</p>
          </div>
        </div>
        <div class="score-area col-lg-6 d-flex justify-content-around">
          <div>
            <h3>Points:</h3>
            <p class="score-area-points">0</p>
          </div>
          <div>
            <h3 class="score-area-time text-decoration-line-through">Time Left:</h3>
            <p class="score-area-time text-decoration-line-through">0</p>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="row">
        <div class="question-area col-12">
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="row g-0">
        <div class="answer-area-one col-md-4 offset-md-4 d-flex">
        </div>
        <div class="answer-area-two col-md-4 offset-md-4 d-flex">
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="row">
        <div class="end-game-area col-12 d-flex justify-content-center">
          <a href="index.html" class="btn btn-danger">End Game</a>
        </div>
      </div>
    </div>`;
  return gameHTML;
}

/*
Display the next question when an answer is submitted.
*/

function displayNextQuestion(questionsArray, questionIndex, timeSwitch, timeInterval) {
  if (questionIndex < questionsArray.length) {
    let questionCurrent = questionsArray[questionIndex];
    /*
    Use a function to decode possible HTML entities for the correctAnswer variable. 
    The variables presented in the DOM are decoded automatically.
    */
    let correctAnswer = decodeHTML(questionCurrent.correct_answer);
    let questionsHTML = `
      <h2 class="text-center">Question: ${questionIndex + 1} / ${questionsArray.length}</h2>
      <p class="text-center">${questionCurrent.question}</p>`;
    let answersArray = questionCurrent.incorrect_answers;
    answersArray.push(correctAnswer);
    answersArray = shuffle(answersArray);
    let answersHTML = answersArray.map(function (answer) {
      return `
        <div class="btn-container d-flex">
          <button class="answer-button btn btn-primary flex-fill m-1">${answer}</button>
        </div>`;
    });
    if (questionCurrent.type === "multiple") {
      let answerAreaOne = answersHTML.slice(0, 2);
      let answerAreaTwo = answersHTML.slice(2, 4);
      $(".answer-area-one").html(answerAreaOne);
      $(".answer-area-two").html(answerAreaTwo);
    } else {
      $(".answer-area-one").html(answersHTML);
    }
    $(".question-area").html(questionsHTML);
    waitForAndCheckAnswer(questionsArray, questionIndex, correctAnswer, timeSwitch, timeInterval);
  } else {
    alert("game finished");
  }
}

/*
Function to check if the submitted answer is correct and in that case highlight the button green. 
*/

function waitForAndCheckAnswer(questionsArray, questionIndex, correctAnswer, timeSwitch, timeInterval) {
  let timeLimitCounter;
  if (timeSwitch) {
    let timeLimit = timeInterval;
    $("p.score-area-time").html(timeLimit);
    timeLimitCounter = setInterval(() => {
      $("p.score-area-time").html(--timeLimit);
      if (timeLimit === 0) {
        // Trigger a click on a button that does not contain the correct answer if the time limit expires.
        $(".answer-button").not(".answer-button:contains(" + correctAnswer + ")").first().trigger("click");
        // Unbind the buttons to prevent unexpected behaviour when clicking the buttons multiple times after timeout.
        $(".answer-button").unbind("click");
      }
    }, 1000);
  }
  $(".answer-button").one("click", function () {
    if (timeSwitch) {
      clearInterval(timeLimitCounter);
    }
    let submittedAnswer = $(this).html();
    let questionResult = submittedAnswer === correctAnswer ? "correct" : "incorrect";
    $(".answer-button:contains(" + correctAnswer + ")").removeClass("btn-primary").addClass("btn-success");
    $(".answer-button").not(".btn-success").removeClass("btn-primary").addClass("btn-danger");
    addScore(questionResult);
    questionIndex += 1;
    setTimeout(() => {
      $(".answer-area-one").empty();
      $(".answer-area-two").empty();
      displayNextQuestion(questionsArray, questionIndex, timeSwitch, timeInterval);
    }, 2000);
  });
}

/*
Function to display the current score.
*/

function addScore(questionResult) {
  if (questionResult === "correct") {
    let correctScore = parseInt($(".score-area-correct").html(), 10);
    correctScore += 1;
    $(".score-area-correct").html(correctScore);
    $(".score-area-points").html(correctScore * 500);
  } else if (questionResult === "incorrect") {
    let incorrectScore = parseInt($(".score-area-incorrect").html(), 10);
    incorrectScore += 1;
    $(".score-area-incorrect").html(incorrectScore);
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
The function below was copied from  
https://stackoverflow.com/questions/7394748/whats-the-right-way-to-decode-a-string-that-has-special-html-entities-in-it/7394787#7394787
and later modified. The correctAnswer variable is not present in the DOM and therefore the HTML entities does not get decoded. 
This function takes care of that.
*/

function decodeHTML(stringHTML) {
  let txt = document.createElement("textarea");
  txt.innerHTML = stringHTML;
  return txt.value;
}

/*
Load the categories when the document is ready. 
*/

$(document).ready(displayOpenTriviaCategories);