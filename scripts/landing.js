var pointsArray = document.getElementsByClassName('point');

var animatePoints = function() {

    var revealPoint = function() {
         // #7
         $(this).css({
             opacity: 1,
             transform: 'scaleX(1) translateY(0)'
         });
     };
    $.each($('.point'), revealPoint);
};

$(window).load(function() {
  var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;


  if ($(window).height() > 950) {
       animatePoints();
   }

  $(window).scroll(function(event) {
    if ($(window).scrollTop() >= scrollDistance) {
      animatePoints();
    }
  });
});
