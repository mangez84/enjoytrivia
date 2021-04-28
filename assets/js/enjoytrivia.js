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
    let errorMessage = 'Failed to load data from API. Please reload page and try again.';
    alert(errorMessage);
  }
}

/* 
Get trivia categories when clicking on "Choose Category".
Use the jQuery .one() method to only call the API on the first click. 
A large part of the code below was copied from 
https://www.javascripttutorial.net/javascript-fetch-api/ and later modified.
*/

$("#form-category").one("click", displayOpenTriviaCategories)

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