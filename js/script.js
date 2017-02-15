let sessions = 0;
let workout_time = 0;
let rest_time = 0;

//FADE IN, FADE OUT functions

Element.prototype.fadeIn = function(callbackF) {

  var s = this.style;
  s.opacity = parseFloat(0);
  s.display = 'block';
  (function fade(){if((s.opacity-=(-.05))>1) { if(typeof callbackF === 'function') callbackF(); } else setTimeout(fade,30)})();

}

Element.prototype.fadeOut = function(callbackF) {

  var s = this.style;
  s.opacity = 1;
  s.display = 'block';
  (function fade(){if((s.opacity-=.05)<=0) { s.display="none"; if(typeof callbackF === 'function') callbackF(); } else setTimeout(fade,30)})();


}

//play workout function
play_workout(session = 0, w_time = 0, r_time = 0)  => {
  if(w_time != 0) {
    document.querySelector("#timer span").innerHTML = w_time;
    setTimeout(() => { play_workout(session, w_time-1, r_time) }, 1000);
  }
  else if(r_time != 0) {
    document.querySelector("#timer span").innerHTML = r_time;
    setTimeout(() => { play_workout(session, w_time, r_time-1) }, 1000);
  }
  else if(session != 0) {
    setTimeout(() => { play_workout(session-1, workout_time, rest_time) }, 1000);
  }
  else {
    //finished
  }
}
//Watch for options changes

document.querySelector("form input").addEventListener('change',() => {
    sessions = document.querySelector("form input[id=sessions]").value;
    workout_time = document.querySelector("form input[id=workout_time]").value;
    rest_time = document.querySelector("form input[id=rest_time]").value;
});

document.querySelector("form input.submit").addEventListener('click',() => {

    let workout_length = sessions * (number.parseFloat(workout_time) + number.parseFloat(rest_time)); //calculate full session time
    play_workout(sessions, workout_time, rest_time);

});
