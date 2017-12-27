
// ----- Game Variables ----- //

// Initial array of foods
var foodsArr = ["cheese", "chicken", "rice", "pizza", "spaghetti",];

// ----- Helper Functions ----- //

// renderButtons will display the food buttons for all foods within the
// foodsArr array.
function renderButtons() {
  // Empty the buttons panel before redrawing it
  $("#buttonPanel").empty();

  // Loop through the array of foods
  for (var i = 0; i < foodsArr.length; i++) {
    // Dynamicaly generate a button for each food in the array
    var button = $("<button>");
    button.addClass("foodButton");
    button.attr("data-food", foodsArr[i]);
    button.text(foodsArr[i]);

    // Add the button to the HTML
    $("#buttonPanel").append(button);
  }
}

// ----- Event Handlers ----- //

// An event handler for the user form to add additional foods to the array
$("#add-food").on("click", function(event) {
  event.preventDefault();

  // Get the input from the textbox
  var food = $("#food-input").val().trim();

  // The food from the textbox is then added to our foodsArr array
  foodsArr.push(food);
  $("#food-input").val("");

  // Redraw the food buttons
  renderButtons();
});

// fetchFoodGifs will fetch food Gifs with the Giphy API
function fetchFoodGifs() {
  // Get the food name from the button clicked
  var foodName = $(this).attr("data-food");
  var foodStr = foodName.split(" ").join("+");

  // Construct the Giphy URL
  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + foodStr + 
                 "&rating=pg-13&limit=20&api_key=dc6zaTOxFJmzC";

  // Make the AJAX call to the Giphy API
  $.ajax({
    method: "GET",
    url: queryURL,
  })
  .done(function( result ) {
    // Get the results array
    var dataArray = result.data;

    // Create and display div elements for each of the returned Gifs
    $("#gifPanel").empty();
    for (var i = 0; i < dataArray.length; i++) {
      var newDiv = $("<div>");
      newDiv.addClass("foodGif");

      var newRating = $("<h2>").html("Rating: " + dataArray[i].rating);
      newDiv.append(newRating);

      var newImg = $("<img>");
      newImg.attr("src", dataArray[i].images.fixed_height_still.url);
      newImg.attr("data-still", dataArray[i].images.fixed_height_still.url);
      newImg.attr("data-animate", dataArray[i].images.fixed_height.url);
      newImg.attr("data-state", "still");
      newDiv.append(newImg);

      // Append the new Gifs to the gifPanel
      $("#gifPanel").append(newDiv);
    }
  });
}

// animatefoodGif will animate a still Gif and stop a moving Gif
function animatefoodGif() {
  // The image state will be either "still" or "animated"
  var state = $(this).find("img").attr("data-state");

  // Make the Gif either animated or still depending on the "data-state" value
  if (state === "still") {
    $(this).find("img").attr("src", $(this).find("img").attr("data-animate"));
    $(this).find("img").attr("data-state", "animate");
  } else {
    $(this).find("img").attr("src", $(this).find("img").attr("data-still"));
    $(this).find("img").attr("data-state", "still");
  }
}

// Render the initial food buttons when the HTML has finished loading
$(document).ready(function() {
  renderButtons();
});

// An event handler for the food buttons to fetch appropriate Gifs
$(document).on("click", ".foodButton", fetchFoodGifs);

// Add an event handler for the food Gifs to make the image animate and stop
$(document).on("click", ".foodGif", animatefoodGif);