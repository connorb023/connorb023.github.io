$(document).ready(function() {
    let categories; // Define the categories variable outside the ajax function
    let percentageScore; // Define percentageScore as a global variable
    let wrongAnswers = []; // Define an array to store the questions the user got wrong
  
    // Load the quiz categories on the page
    $.ajax({
      url: "https://opentdb.com/api_category.php",
      method: "GET",
      success: function(response) {
        // Handle the response from the API
        categories = response.trivia_categories;
  
        // Add each category to the dropdown menu
        categories.forEach(function(category) {
          let option = $("<option>").attr("value", category.id).text(category.name);
          $("#category-select").append(option);
        });
      },
 // Add an event listener to the category dropdown menu
    $("#category-select").on("change", function() {
      // Get the selected category ID
      categoryId = $(this).val();

      // Clear any existing questions from the DOM
      $("main").empty();
  
      // Call the getQuestions function with the selected category ID
      getQuestions(categoryId);
    });
  
    function getQuestions(categoryId) {
      $.ajax({
        url: "https://opentdb.com/api.php",
        method: "GET",
        data: {
          amount: 10, // number of questions to retrieve
          category: categoryId, // ID of the selected category
          type: "multiple" // type of questions (multiple choice)
        },
        success: function(response) {
          // Handle the response from the API
          let questions = response.results;
 // Add each question to the DOM
          questions.forEach(function(question, index) {
            let questionDiv = $("<div>").addClass("question");
            let questionNumber = $("<h2>").text("Question " + (index + 1));
            let questionText = $("<p>").addClass("question-text").html(question.question);
            let answersList = $("<ul>").addClass("answers");
   // Add each answer to the answer list
            let answers = question.incorrect_answers.concat(question.correct_answer);
            answers.sort(); // Shuffle the answers so that the correct answer is not always last
            answers.forEach(function(answer) {
              let listItem = $("<li>");
              let radio = $("<input>").attr({
                type: "radio",
                name: "question-" + index,
                value: answer
              });
              let label = $("<label>").text(answer);
              listItem.append(radio).append(label);
  
              // If this is the correct answer, mark it with the data-correct attribute
             
              if (answer === question.correct_answer) 
              
              {radio.attr("data-correct", true);}
  
              answersList.append(listItem);
            });
  
            questionDiv.append(questionNumber).append(questionText).append(answersList);
            $("main").append(questionDiv);
          });
        },
error: function() {
          // Handle any errors that occur while making the request
          console.log("Error: Unable to retrieve quiz questions.");
        }
      });
    }
  
    // Add an event listener to the submit button
    $("footer button").on("click", function() {
      // Get all the selected answers
      let selectedAnswers = $("input[type=radio]:checked");
  
      // Reset the wrongAnswers array
      wrongAnswers = [];
  
      // Loop through each selected answer and check if it is correct
      selectedAnswers.each(function() {
        let isCorrect = $(this).attr("data-correct") === "true";
        let answerText = $(this).siblings("label").text();
      
        if (!isCorrect) {
          wrongAnswers.push(answerText);
        }
      });
 // Calculate the percentage score
      let numCorrect = 10 - wrongAnswers.length;
      percentageScore = numCorrect / 10 * 100;
      
      // Show the results on the page
      $("main").empty();
      let resultDiv = $("<div>").addClass("result");
      let scoreDiv = $("<div>").addClass("score").text("Your score: " + percentageScore + "%");
      let feedbackDiv = $("<div>").addClass("feedback");
      
      if (percentageScore >= 80) {
        feedbackDiv.text("Great job!");
      } else if (percentageScore >= 50) {
        feedbackDiv.text("Not bad, but you could do better.");
      } else {
        feedbackDiv.text("Better luck next time.");
      }
      resultDiv.append(scoreDiv).append(feedbackDiv);
      $("main").append(resultDiv);
      
    });
  });
