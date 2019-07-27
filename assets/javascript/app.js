var i = 0;
defaultLoad = 1;
var time;
var captionText = document.getElementById("InfoCaption");
var modal = document.getElementById("popupInfo");
var topics = ["YES", "NO", "MAYBE", "GREAT JOB!", "OH NO!"];
//Add a new button function
function addNewbutton() {
    var gifInput = $("#gif-input").val().trim().toUpperCase();
    if (gifInput !== "" && $.inArray(gifInput, topics) === -1) {
        topics.push(gifInput);
        $("#gif-input").val("");
    }
    $("#new-button").empty();
    for (var i = 0; i < topics.length; i++) {
        var newButton = $("<div>");
        newButton.addClass("button");
        newButton.attr("data-name", topics[i]);
        newButton.text(topics[i]);
        newButton.appendTo("#new-button");
    };
    return false;
}
//Calling the function to initial buttons
addNewbutton();
//Adding a new button either with a click or a "enter"key
$(document).on("click", "#newGifbutton", addNewbutton);
$(document).on("submit", "#enterFunction", addNewbutton);
//Gifs Display function
function displayGifs(event) {

    if (defaultLoad == 1) {
        value = "yes";
        $(".gif-pic").empty();
    }
    else if (defaultLoad == 2) {
        value = $(this).attr("data-name");
        $(".gif-pic").empty();
    }
    else if (defaultLoad == 3) { value = $(".gif-box").attr("data-name"); }
    $(".gif-pic").masonry({
        columnWidth: ".gif-box",
        itemSelector: ".gif-box",
    });
    defaultLoad = 2;
    var apikey = "RwUKJ3DzRRWT64mYuwCnB9SaSYcsbAfo";
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=";
    $.ajax({
        url: queryURL + value + "&api_key=" + apikey,
        method: "GET"
    }).then(function (gifsSearch) {
        if ($(".gif-box").attr("data-name") !== value) {
            $(".gif-pic").empty();
            i = 0;
            var gifApiinfo = gifsSearch.data.slice(0, 10);
        }
        else {
            i = 10
            var gifApiinfo = gifsSearch.data.slice(i);
            i = 25;
        }
        gifApiinfo.forEach(element => {
            var newgif = ($("<img>").attr({
                src: element.images["original_still"].url
            })
                .data({
                    still: element.images["original_still"].url,
                    moving: element.images.original.url,
                    url: element.url,
                    imgClicked: false
                }));
            var gifbox = $("<div/>").attr({ class: "gif-box" });
            gifbox.attr("data-name", value);
            gifbox.append(newgif);
            var gifinfo = $("<div/>").attr({ class: "gif-info" });
            gifbox.append(gifinfo);
            var rating = $("<p>").html("<b>Rating:</b> " + (element.rating));
            var title = $("<p>").html("<b>Title:</b> " + (element.title));
            gifinfo.append(title);
            gifinfo.append(rating);
            $(".gif-pic").append(gifbox).masonry("appended", gifbox);
            $(".gif-pic").masonry();
        });
        $(".gif-pic").imagesLoaded().done(function () {
            $(".gif-pic").masonry({
                columnWidth: ".gif-box",
                itemSelector: ".gif-box",
            });
        })
    });
}
//Calling function to display intial Gif for "yes"
displayGifs();
//Displays new Gifs after clicking in the button of selection
$(document).on("click", ".button", displayGifs);
//Motion functions (Click, Scroll, Hover)
//Move on mouseover
$(document).on("mouseover", "img", function () {
    clearInterval(time);
    $("#InfoCaption").empty();
    //This will show a popup window with url for the Gif image at the top of the page
    $(".modal").css("display", "block");
    var captionText = $("<a>").html("URL: " + ($(this).data("url"))).attr("href", $(this).data("url"));
    $("#InfoCaption").append(captionText);
        time = setInterval(function () {
            $("#InfoCaption").empty(),
                $("#popupInfo").css("display", "none")
        }, 5000);
})
//Change state (moving or sitll) after click
$(document).on("click", "img", function () {
    if ($(this).data("imgClicked")) {
        $(this).data("imgClicked", false);
        $(this).attr("src", $(this).data("still"));
    } else {
        $(this).data("imgClicked", true);
        $(this).attr("src", $(this).data("moving"));
    }
});
//Display 15 more gifs after scroll down
$(window).on("scroll", function () {
    if ($(window).scrollTop() !== 0) {
        $(".modal").css({ top: "0px" });
    }
    else { $(".modal").css("top", "74px") }
    var scrollHeight = $(document).height();
    var scrollPosition = $(window).height() + $(window).scrollTop();
    if ((scrollHeight - scrollPosition) < 1 && i < 10) {
        defaultLoad = 3;
        displayGifs();
    }
});