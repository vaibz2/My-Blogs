let today = new Date();
let time = today.getHours();
let greeting_txt = "Good morning.";
if(time >= 12 && time < 16){
    greeting_txt = 'Good afternoon.';
} else if(time >= 16 && time < 24){
    greeting_txt = 'Good evening.';
} else{
    greeting_txt = "Good morning.";
}
document.querySelector("p.day").innerHTML = greeting_txt;