var button = document.querySelector('#click');
var container = document.querySelector('#container')
var counter = document.querySelector('#counter')
var clear = document.querySelector('#clear')
//* Color Selector //


button.addEventListener('click', function (event) {
    var image = document.createElement('img');
      image.src = 'images/ant.png';
      image.style.left = (100 * Math.random()) + '%';
      image.style.top = (100 * Math.random()) + '%';
        container.appendChild(image);
    var images = container.querySelectorAll('img');
    var count = images.length;
    console.log(count);
    counter.innerHTML = count;
});


//

container.addEventListener('click', function (event) {
    console.log(event.target.tagName);
    if (event.target.tagName == 'img'); {
        event.target.remove();
          var images = container.querySelectorAll('img');
          var count = images.length;
        console.log(count);
          counter.innerHTML = count;
        console.log("Click has been logged!");
    }
});

clear.addEventListener('click', function (event) {
    container.innerHTML = clear;
    var images = container.querySelectorAll('img');
        var count = images.length;
        console.log(count);
          counter.innerHTML = count;
        console.log("Cleared!");
        alert("You can also click on an ant to get rid of it!");
});

$(function() {
	//bg color selector ---> from CodePen
  $(".color").click(function(){
		var color = $(this).attr("data-value");
    $("body").css("background-color", color);
	});

  if (Modernizr.inputtypes.color) {
    $(".picker").css("display", 'inline-block');
    var c = document.getElementById('colorpicker');
    c.addEventListener('change', function(e) {
      //d.innerHTML = c.value;
      var color = c.value;
      $("body").css("background-color", color);
		}, false);
  }
});
function pickColor() {
  $("#colorpicker").click();
}

console.log("Colorpicker");
