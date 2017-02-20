let sessions = 0;
let workout_time = 0;
let rest_time = 0;
let workout_length = 0;
let time_left = 0;
let present_session = 1;
const info = document.querySelector(".info");
const timer = document.querySelector("#timer span");
const form = document.querySelector("form");
const content = document.querySelector("body");
const workout_complete = document.querySelector(".info h3[data-bind='sessions'] span");
const time_left_info = document.querySelector(".info h3[data-bind='time_left'] span");

//sounds
let victory_sound = document.querySelector("audio#victory");
let rest_sound = document.querySelector("audio#rest");
let fight_sound = document.querySelector("audio#fight");
let tensec_sound = document.querySelector("audio#tensec");

//Youtube get playlists

let request = new XMLHttpRequest();
request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     console.dir(this.response.items);
    }
  };
  request.open("GET", "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=PL3JsLcHQKdHuC5GBjFeBb1o71ihwCTZQu&key=AIzaSyB7zZzAkQ7H09mtTwoenyki8FA38dIBOGk", true);
  request.send();

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

//Seconds formatting

Number.prototype.formatTime = function() {
      let sec_num = parseInt(this, 10);
      let hours   = Math.floor(sec_num / 3600);
      let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      let seconds = sec_num - (hours * 3600) - (minutes * 60);

      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      return hours+':'+minutes+':'+seconds;
}

//play workout function
play_workout = (session = 0, w_time = 0, r_time = 0) => {
  //console.log(`session ${session}, w_time ${w_time}, r_time ${r_time}`);//debug
  if(w_time != 0) {
    if(w_time == 10) {
      tensec_sound.currentTime = 0;
      tensec_sound.play();
    }
    if(w_time == 1) {
      rest_sound.currentTime = 0;
      rest_sound.play();
    }
    if(w_time <= 10) content.style.background = "#e74c3c";
    else content.style.background = "#f39c12";
    timer.innerHTML = w_time;
    time_left_info.innerHTML = (workout_length--).formatTime();
    setTimeout(() => { play_workout(session, w_time-1, r_time) }, 1000);
  }
  else if(r_time != 0) {
    if(r_time == 10) {
      tensec_sound.currentTime = 0;
      tensec_sound.play();
    }
    if(r_time <= 10) content.style.background = "#e74c3c";
    else content.style.background = "#2ecc71";
    timer.innerHTML = r_time;
    time_left_info.innerHTML = (workout_length--).formatTime();
    setTimeout(() => { play_workout(session, w_time, r_time-1) }, 1000);
  }
  else if(session > 1) {
    present_session++;
    workout_complete.innerHTML = present_session+"/"+sessions;
    fight_sound.currentTime = 0;
    fight_sound.play();
    setTimeout(() => { play_workout(session-1, workout_time, rest_time) }, 1000);
  }
  else {
    content.style.background = "#f1c40f";
    victory_sound.currentTime = 0;
    victory_sound.play();
    timer.innerHTML = "Victory!";
    setTimeout(() => { info.fadeOut(); form.fadeIn(); content.style.background = "#ffff"; }, 3000);
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

    workout_length = sessions * (parseInt(workout_time) + parseInt(rest_time)); //calculate full session time
    present_session = 1;
    workout_complete.innerHTML = present_session+"/"+sessions;
    time_left = workout_length;
    time_left_info.innerHTML = workout_length.formatTime();
    fight_sound.currentTime = 0;
    fight_sound.play();
    form.fadeOut();
    info.fadeIn();

    play_workout(sessions, workout_time, rest_time);

});
