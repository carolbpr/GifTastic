window.onload = function () {
    addNewbutton();
    displayGifs();
    $(document).on("click", ".button", displayGifs);
    $("#newGifbutton").on("click", addNewGifbutton);
    $(document).on("click", 'img', imageClick);

}
defaultLoad = false;
var topics = ["Yes", "No", "Maybe", "Great Job", "Oh no"];
function addNewbutton() {
    $("#new-button").empty();
    for (var i = 0; i < topics.length; i++) {
        var newButton = $('<div>');
        newButton.addClass("button");
        newButton.attr("data-name", topics[i]);
        newButton.text(topics[i]);
        newButton.appendTo("#new-button");
    }
};
function displayGifs(value) {
    value = $(this).attr("data-name");
    event.preventDefault();
    $(".gif-pic").empty();
    var apikey = "RwUKJ3DzRRWT64mYuwCnB9SaSYcsbAfo";
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=";
    $.ajax({
        url: queryURL + value + "&api_key=" + apikey,
        method: "GET"
    }).then(function (gifsSearch) {
        var gifApiinfo = gifsSearch.data.slice(0, 10);
        gifApiinfo.forEach(element => {
            var newgif = ($('<img>').attr({
                src: element.images['480w_still'].url
            })
                .data({
                    still: element.images['480w_still'].url,
                    moving: element.images.original.url,
                    imgClicked: false
                }));
            var gifbox = $("<div/>").attr({ class: "gif-box" });
            $(".gif-pic").append(gifbox);
            gifbox.append(newgif);

            var gifinfo = $("<div/>").attr({ class: "gif-info" });
            gifbox.append(gifinfo);
            var rating = $("<p>").html("<b>Rating:</b> " + element.rating);
            gifinfo.append(rating);

        });
    });

}

function addNewGifbutton() {
    event.preventDefault();
    var gifInput = $("#gif-input").val().trim();
    if (gifInput !== "") {
        topics.push(gifInput);
        addNewbutton();
    }
};

function imageClick() {
    if ($(this).data("imgClicked")) {
        $(this).data("imgClicked", false);
        $(this).attr("src", $(this).data("still"));
    } else {
        $(this).data("imgClicked", true);
        $(this).attr("src", $(this).data("moving"));
    }
}