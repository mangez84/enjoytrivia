# Enjoy Trivia!

## Test

### Known Bugs

#### Solved

- Some questions returned from the OpenTriviaDB API contain [HTML entities](https://www.w3schools.com/html/html_entities.asp) but these are decoded if the string is presented in the DOM. The variable used for the correct answer is not presented in the DOM, which resulted in that the comparison between the correct and submitted answer sometimes failed. This was fixed using a function that decodes the HTML entities in the string containing the correct answer.
- The jQuery [:contains()](https://api.jquery.com/contains-selector/) selector used to mark the correct answer sometimes marked several answers as correct. This could happen if the correct answer is a substring of an incorrect answer. The bug was solved with the help of this [jQuery Forum](https://forum.jquery.com/topic/contains-but-i-want-exact-how) post.

#### Unsolved

Back to the [README.md](README.md#test) file.