function  validateNickname(realName, nickname){
    const feedbackName = document.getElementById("realName"); 
    const feedbackNickname = document.getElementById("duckNickname");
    if (!realName.trim()||!nickname.trim()){
        feedbackName.textContent = "Please fill in both your name and the duck nickname";
        feedbackNickname.textContent = "Please fill in both your name and the duck nickname";
        feedbackName.style.color  ="red";
        feedbackNickname.style.color = "red";
        return false; 
    }
    if(nickname.length<4||nickname.includes(" ")||nickname.toLowerCase === realName.toLowerCase){
        feedbackNickname.textContent = "Nickname must be 4+ characters, no spaces, and not the same as your real name";
        feedbackNickname.style.color = "red";
        return false;
    }else{
    feedbackNickname.textContent = "✔ Valid nickname for unicode \u2714.";
    feedbackNickname.style.color = "green";
    return true;
    }
}
let confirmed= false;
const realNameInput = document.getElementById("realName");
const nicknameInput = document.getElementById("duckNickName");
const nicknameFeedback = document.getElementById("nicknameFeedback");

realNameInput.addEventListener("input",()=>{
    validateNickname(realNameInput.value, nicknameInput.value);
    if(confirmed)updateFinalNickname();
});
nicknameInput.addEventListener("input",()=>{
    validateNickname(realNameInput.value, nicknameInput.value);
    if(confirmed)updateFinalNickname();
});
function removeDuckSelection(){
    document.querySelectorAll(".duck-thumb").forEach(duck=>{
        duck.classList.remove("selected");
    });
}
function selectDuck1(){
    removeDuckSelection();
    const duck = document.getElementById("duck1");
    duck.classList.add("selected");
    document.getElementById("selectedDuck").src = duck.src;
}
function selectDuck2(){
    removeDuckSelection();
    const duck = document.getElementById("duck2");
    duck.classList.add("selected");
    document.getElementById("selectedDuck").src = duck.src;
}
function selectDuck3(){
    removeDuckSelection();
    const duck = document.getElementById("duck3");
    duck.classList.add("selected");
    document.getElementById("selectedDuck").src = duck.src;
}
document.getElementById("duck1").addEventListener("click", selectedDuck1);
document.getElementById("duck2").addEventListener("click", selectedDuck2);
document.getElementById("duck3").addEventListener("click", selectedDuck3);

document.getElementById("cconfirmSelection").addEventListener("click",()=>{
    if(!selectedDuck){
        nicknameFeedback.textContent = "please select a duck.";
        nicknameFeedback.style.color = "red";
        return;
    }
    const realName =realNameInput.value.trim();
    const nickname = nicknameInput.value.trim();
    const isValid = validateNickname(realName, nickname);
    if(!isValid) return;

    confirmed = true;
    updateFinalNickname();
    document.getElementById("selectedDuck").src = selectedDuck.src;
});