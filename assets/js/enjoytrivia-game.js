/*
Main function to obtain data from the API.
Call this function to build a complete URL and to obtain data.  
*/

async function getOpenTriviaData(optionsURI, optionsObject) {
  let baseURL = "https://opentdb.com/";
  let completeURL = baseURL + optionsURI;
  try {
    let response = await fetch(completeURL);
    let responseJSON = await response.json();
    if (response.status === 200 && responseJSON.response_code === 0) {
      return responseJSON;
    }
    /*
    Code to handle cases where there are not enough questions with the selected category and difficulty.
    There is no way to check the number of questions per type via the API.
    The game will start with the maximum number of questions for the selected difficulty and displays questions of both types.  
    */
    else if (response.status === 200 && responseJSON.response_code === 1) {
      response = await fetch(baseURL + "api_count.php?category=" + optionsObject.category);
      responseJSON = await response.json();
      if (optionsObject.difficulty === "easy") {
        optionsObject.amount = responseJSON.category_question_count.total_easy_question_count;
      } else if (optionsObject.difficulty === "medium") {
        optionsObject.amount = responseJSON.category_question_count.total_medium_question_count;
      } else if (optionsObject.difficulty === "hard") {
        optionsObject.amount = responseJSON.category_question_count.total_hard_question_count;
      } else {
        optionsObject.amount = responseJSON.category_question_count.total_question_count;
      }
      optionsObject.type = "";
      let questionsURI = "api.php?category=" + optionsObject.category + "&difficulty=" + optionsObject.difficulty + "&type=" + optionsObject.type + "&amount=" + optionsObject.amount;
      let alertMessage = "There are not enough questions in the database for your selected options. The game will start with the maximum number of questions available for your selected category and difficulty. Questions of both types may be displayed.";
      alert(alertMessage);
      return await getOpenTriviaData(questionsURI);
    } else if (response.status === 200 && responseJSON.trivia_categories) {
      return responseJSON;
    }
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

$("#form-game").submit(function (event) {
  event.preventDefault();
  let optionsObject = {
    category: $("#form-category").val(),
    difficulty: $("#form-difficulty").val(),
    type: $("#form-type").val(),
  };
  let optionsURI = $(this).serialize();
  let timeSwitch = $("#form-time-switch").prop("checked");
  let timeInterval = $("#form-time-duration").val();
  displayOpenTriviaQuestions(optionsURI, optionsObject, timeSwitch, timeInterval);
});

/*
Function for managing the game and displaying questions.
Remove the offcanvas backdrop effect from the body when starting the game.
*/

async function displayOpenTriviaQuestions(optionsURI, optionsObject, timeSwitch, timeInterval) {
  $(".feedback-area").remove();
  $(".game-area").empty();
  $(".game-area").addClass("flex-grow-1 d-flex flex-wrap align-content-between");
  $(".game-area").append(fetchGameHTML());
  if (timeSwitch) {
    $(".score-area-time").removeClass("text-decoration-line-through");
  }
  let questionsURI = "api.php?" + optionsURI;
  let questionsRecieved = await getOpenTriviaData(questionsURI, optionsObject);
  let questionsArray = shuffle(questionsRecieved.results);
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
        <div class="score-area col-lg-6 d-flex flex-wrap justify-content-around">
          <div>
            <h3>Correct:</h3>
            <p class="score-area-correct">0</p>
          </div>
          <div>
            <h3>Incorrect:</h3>
            <p class="score-area-incorrect">0</p>
          </div>
        </div>
        <div class="score-area col-lg-6 d-flex flex-wrap justify-content-around">
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
        <div class="end-game-area col-12 d-flex justify-content-center my-3">
          <a href="index.html" class="end-game-anchor btn btn-danger">End Game</a>
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
    Use decodeHTML() to decode possible HTML entities for the correctAnswer and incorrectAnswer variables. 
    The variables presented in the DOM are decoded automatically.
    */
    let correctAnswer = decodeHTML(questionCurrent.correct_answer);
    // Use a variable with the incorrect answer for the time-based mode.
    let incorrectAnswer = decodeHTML(questionCurrent.incorrect_answers[0]);
    let questionsHTML = `
      <h2 class="text-center mb-3">Question: ${questionIndex + 1} / ${questionsArray.length}</h2>
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
    waitForAndCheckAnswer(questionsArray, questionIndex, correctAnswer, incorrectAnswer, timeSwitch, timeInterval);
  } else {
    let numberQuestions = parseInt($(".score-area-correct").html(), 10) + parseInt($(".score-area-incorrect").html(), 10);
    let maxPoints = numberQuestions * 500;
    let playerPoints = parseInt($(".score-area-points").html(), 10);
    let finishHTML;
    if (playerPoints === 0) {
      finishHTML = `
      <h2 class="text-center mb-3">Wooops!</h2>
      <p class="text-center">You did not answer any questions correctly! Better luck next time!</p>`;
    } else if (playerPoints === maxPoints) {
      finishHTML = `
      <h2 class="text-center mb-3">Congratulations!</h2>
      <p class="text-center">You finished the game with ${playerPoints} points! Since this is the maximum number of points for this round, you will get a balloon!</p>
      <div class="d-flex justify-content-around">
        <div class="balloon"></div>`;
    } else {
      finishHTML = `
      <h2 class="text-center mb-3">Hurray!</h2>
      <p class="text-center">You finished the game with ${playerPoints} points!</p>`;
    }
    $(".answer-area-one").remove();
    $(".answer-area-two").remove();
    $(".question-area").html(finishHTML);
  }
}

/*
Function to check if the submitted answer is correct and in that case highlight the button green. 
*/

function waitForAndCheckAnswer(questionsArray, questionIndex, correctAnswer, incorrectAnswer, timeSwitch, timeInterval) {
  let timeLimitCounter;
  if (timeSwitch) {
    let timeLimit = timeInterval;
    $("p.score-area-time").html(timeLimit);
    timeLimitCounter = setInterval(() => {
      $("p.score-area-time").html(--timeLimit);
      if (timeLimit === 0) {
        // Trigger a click on a button with the incorrect answer if the time limit expires.
        $(".answer-button").filter(function () {
          return $(this).text() === incorrectAnswer;
        }).trigger("click");
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
    /*
    Use jQuery filter() and text() methods to get an exact match of the correct answer.
    Code was copied from https://forum.jquery.com/topic/contains-but-i-want-exact-how
    */
    $(".answer-button").filter(function () {
      return $(this).text() === correctAnswer;
    }).removeClass("btn-primary").addClass("btn-success");
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