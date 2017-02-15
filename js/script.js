let sessions = 0;
let workout_time = 0;
let rest_time = 0;
const timer = document.querySelector("#timer span");
const form = document.querySelector("form");
const content = document.querySelector("body");

//sounds
victory_sound = document.querySelector("audio#victory");

//FADE IN, FADE OUT functions

Element.prototype.fadeIn = function(callbackF) {

  var s = this.style;
  s.opacity = parseFloat(0);
  s.display = 'flex';
  (function fade(){if((s.opacity-=(-.05))>1) { if(typeof callbackF === 'function') callbackF(); } else setTimeout(fade,30)})();

}

Element.prototype.fadeOut = function(callbackF) {

  var s = this.style;
  s.opacity = 1;
  s.display = 'flex';
  (function fade(){if((s.opacity-=.05)<=0) { s.display="none"; if(typeof callbackF === 'function') callbackF(); } else setTimeout(fade,30)})();


}

//play workout function
function play_workout(session = 0, w_time = 0, r_time = 0) {
  console.log(`session ${session}, w_time ${w_time}, r_time ${r_time}`);
  if(w_time != 0) {
    if(w_time <= 10) content.style.background = "#e74c3c";
    else content.style.background = "#f39c12";
    timer.innerHTML = w_time;
    setTimeout(() => { play_workout(session, w_time-1, r_time) }, 1000);
  }
  else if(r_time != 0) {
    if(r_time <= 10) content.style.background = "#e74c3c";
    else content.style.background = "#2ecc71";
    timer.innerHTML = r_time;
    setTimeout(() => { play_workout(session, w_time, r_time-1) }, 1000);
  }
  else if(session > 1) {
    setTimeout(() => { play_workout(session-1, workout_time, rest_time) }, 1000);
  }
  else {
    content.style.background = "#f1c40f";
    victory_sound.currentTime = 0;
    victory_sound.play();
    timer.innerHTML = "Victory!";
    setTimeout(() => { timer.fadeOut(); form.fadeIn(); }, 3000);
  }
}
//Watch for options changes

Array.from(document.querySelectorAll("form input")).forEach(input => {

    input.addEventListener('change',() => {

        sessions = document.querySelector("form input[id=sessions]").value;
        workout_time = document.querySelector("form input[id=workout_time]").value;
        rest_time = document.querySelector("form input[id=rest_time]").value;
   });

});

document.querySelector("form a.submit").addEventListener('click',() => {

    //let workout_length = sessions * (number.parseFloat(workout_time) + number.parseFloat(rest_time)); //calculate full session time
    form.fadeOut();
    timer.fadeIn();
    play_workout(sessions, workout_time, rest_time);

});
