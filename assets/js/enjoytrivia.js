/*
Main function to obtain data from the API.
Call this function to build a complete URL and to obtain data.  
*/

async function getOpenTriviaData(optionURI) {
  let baseURL = "https://opentdb.com/";
  let completeURL = baseURL + optionURI;
  try {
    let response = await fetch(completeURL);
    return await response.json();
  } catch (error) {
    let errorMessage = "Failed to load data from the OpenTriviaDB API. Please reload page and try again.";
    alert(errorMessage);
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
The code for adding a delay using promises was copied from
https://stackoverflow.com/questions/45498873/add-a-delay-after-executing-each-iteration-with-foreach-loop/45500721#45500721
*/

async function displayOpenTriviaQuestions(optionsURI, timeInterval) {
  $("body").removeAttr("class data-bs-padding-right style");
  $(".game-area").html("");
  $(".game-area").addClass("d-flex flex-wrap justify-content-center align-content-between");
  $(".game-area").append('<div class="question-area w-100"></div>');
  $(".game-area").append('<div class="answer-area w-100"></div>');

  let questionsURI = "api.php?" + optionsURI;
  let questions = await getOpenTriviaData(questionsURI);
  let interval = timeInterval * 1000;
  let questionsHTML;
  let answersHTML;
  let answersArray;
  let submittedAnswer;
  let correctAnswer;
  let questionResult;
  let promise = Promise.resolve();

  questions.results.forEach(function (question) {
    promise = promise.then(function () {
      $(".question-area").html("");
      $(".answer-area").html("");

      correctAnswer = question.correct_answer;
      answersArray = question.incorrect_answers;
      answersArray.push(correctAnswer);
      if (question.type === "multiple") {
        answersArray = shuffle(answersArray);
      }

      questionsHTML = `<p class="text-center">${question.question}</p>`
      answersHTML = answersArray.map(function (answer) {
        return `<button class="btn btn-primary text-center">${answer}</button>`
      })

      $(".question-area").html(questionsHTML);
      $(".answer-area").html(answersHTML);

      $(".answer-area > button").click(function () {
        submittedAnswer = $(this).html();
        questionResult = checkAnswer(submittedAnswer, correctAnswer);
        console.log(questionResult);
      });

      return new Promise(function (resolve) {
        setTimeout(resolve, interval);
      });
    });
  });
}

/*
Check the answer
*/

function checkAnswer(submittedAnswer, correctAnswer) {
  let questionResult;
  if (submittedAnswer === correctAnswer) {
    questionResult = "correct";
  } else {
    questionResult = "incorrect";
  }
  return questionResult;
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