# Enjoy Trivia!

[Enjoy Trivia!](https://mangez84.github.io/enjoytrivia/) is a game for anyone who is curious and not afraid of a challenge. 

If you want to prove your knowledge, select the desired category, difficulty and number of questions and start playing!

Let the [fun](https://mangez84.github.io/enjoytrivia/) begin!

## Table of Contents

1. [UX](#ux)
    - [User Stories](#user-stories)
        - [New Player Goals](#new-player-goals)
        - [Frequent Player Goals](#frequent-player-goals)
    - [Developer Goals](#developer-goals)
    - [Wireframes](#wireframes)
2. [Features](#features)
    - [Existing Features](#existing-features)
    - [Features Left to Implement](#features-left-to-implement)
3. [Technologies Used](#technologies-used)
    - [Languages Used](#languages-used)
    - [Frameworks, Libraries and Software Used](#frameworks-libraries-and-software-used)
4. [Test](#test)
    - [Known Bugs](TEST.md#known-bugs)
        - [Solved](TEST.md#solved)
        - [Unsolved](TEST.md#unsolved)
5. [Credits](#credits)
    - [Code](#code)
    - [Content](#content)
    - [Media](#media)
        - [Images](#images)

## UX

### User Stories

#### New Player Goals

- As a new player, I want to be able to get questions from a specific category.
- As a new player, I want to be able to choose the level of difficulty.
- As a new player, I want to be able to choose the number of questions.
- As a new player, I want to see a scoreboard that shows the number of correct and incorrect answers.
- As a new player, I want the option to end the game and start over.
- As a new player, I want to be able to play the game on my computer, tablet and smartphone.
- As a new player, I want to be celebrated if I answer all the questions correctly.
- As a new player, I want to clearly see the question and the choices available for answers.
- As a new player, I want the correct answer to be displayed even if I answer incorrectly.

#### Frequent Player Goals

- As a frequent player, I want to be able to increase the difficulty further with configurable time limits for the questions.
- As a frequent player, I want to be able to contact the developer of the game and give feedback.
- As a frequent player, I want to be able to start a game quickly.
- As a frequent player, I do not want to get questions that I have already had.

### Developer Goals

- Strengthen my skills in HTML5, CSS and JavaScript.
- Create a well-structured website with good error handling and clear feedback to users.
- Have fun working with APIs.
- Create a good gaming experience that is also a source of knowledge.

### Wireframes

- [Index Page](assets/wireframes/index.pdf)
- [Give Feedback](assets/wireframes/givefeedback.pdf)
- [Create Game](assets/wireframes/creategame.pdf)
- [Play Game](assets/wireframes/playgame.pdf)
- [Victory](assets/wireframes/victory.pdf)

## Features

### Existing Features

- Clear navigation which makes it easy to start a game.
- Options are available to configure the game with the desired category, difficulty and number of questions.
- The type option can be used to select multiple choice questions or true or false questions.
- A scoreboard that shows the number of correct and incorrect answers.
- The game can be played on computers, tablets and smartphones.
- Good visual feedback when a question is answered correctly or incorrectly.
- It is possible to send feedback to the developer using a form.
- A time-based mode that further challenges the player.
- A source of knowledge because the correct answer is highlighted if the player should answer incorrectly.
- If all questions are answered correctly, the player is rewarded with a celebration.

### Features Left to Implement

- None at the moment.

## Technologies Used

### Languages Used

- [HTML5](https://en.wikipedia.org/wiki/HTML5)
- [CSS3](https://en.wikipedia.org/wiki/CSS)
- [JavaScript](https://en.wikipedia.org/wiki/JavaScript)

### Frameworks, Libraries, APIs and Software Used

- [Bootstrap 5.0](https://getbootstrap.com/docs/5.0/getting-started/introduction/)
    - The project uses the grid system, flex utilities, the offcanvas component and forms from the Bootstrap 5.0 framework.
- [jQuery](https://jquery.com/)
    - jQuery is used as a complement to standard JavaScript for DOM selection and manipulation.
- [Open Trivia Database](https://opentdb.com/)
    - The game is built around the [Open Trivia Database API](https://opentdb.com/api_config.php). All categories, questions and answers are retrieved from this API. The API is free to use for developers and is well documented.
- [EmailJS](https://www.emailjs.com/)
    - The EmailJS SDK is used to send feedback to the developer via email. The SDK is easy to use and enables a secure way to send email with JavaScript.
- [Git](https://git-scm.com/)
    - Git is used to keep track of changes in the project code.
- [Github](https://github.com/)
    - The code is stored in Github and the web application is hosted on GitHub Pages.
- [Gitpod](https://gitpod.io/)
    - Gitpod was used as a development environment throughout the project.
- [Balsamiq](https://balsamiq.com/)
    - Wireframes for the project were created with Balsamiq.
- [Google Fonts](https://fonts.google.com/)
    - The Exo font used in the project is imported from Google Fonts.
- [favicon.io](https://favicon.io/)
    - The favicon used on the website was generated on [favicon.io](https://favicon.io/).

## Test

See separate file [TEST.md](TEST.md#test) for information on completed tests and results from these.

## Credits

### Code

- Code to obtain API data using the fetch() method was copied from this [JavaScript Tutorial](https://www.javascripttutorial.net/javascript-fetch-api/) post. This post also has good descriptions on how to handle asynchronous HTTP requests reliably.
- This [Stack Overflow](https://stackoverflow.com/questions/169506/obtain-form-input-fields-using-jquery/1443005#1443005) post had a good tip about the .serialize() function in jQuery. Code was copied into the project and then modified.
- The function to shuffle an array was copied in its entirety from this [Stack Overflow](https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array/6274381#6274381) post.
- The code for darkening the background image came from this [CSS-Tricks](https://css-tricks.com/design-considerations-text-images/) post.
- The function for decoding HTML entities was copied from this [Stack Overflow](https://stackoverflow.com/questions/7394748/whats-the-right-way-to-decode-a-string-that-has-special-html-entities-in-it/7394787#7394787) post.
- The code for changing the colour of the range slider was found in this [Stack Overflow](https://stackoverflow.com/a/56424165) post.
- The code for solving the bug with multiple correct answers was copied from this [jQuery Forum](https://forum.jquery.com/topic/contains-but-i-want-exact-how) post.
- The code for the balloons when finishing the game was copied from [Bennett Feely on codepen.io](https://codepen.io/bennettfeely/pen/nbFCp).

### Content

### Media

#### Images

- The background image was obtained from [Gerd Altmann on Pixabay](https://pixabay.com/illustrations/board-questions-who-what-how-why-776688/).