/*jshint esversion: 8 */
/*
Function and jQuery event listener for sending feedback to the developer.
Parts of the code below was copied from https://www.emailjs.com/docs/sdk/send-form/
*/

$("#form-feedback").submit(function (event) {
  event.preventDefault();
  sendFeedback();
});

function sendFeedback() {
  emailjs.sendForm('default_service', 'enjoytrivia', '#form-feedback')
    .then(function (response) {
      if (response.status = 200) {
        $(".feedback-area p").html("Thanks for the feedback! Go ahead and create a game!");
      };
    }, function (error) {
      let errorMessage = "Failed to send feedback. Thanks for the effort but please try again later."
      alert(error.name + ": " + errorMessage);
    });
}