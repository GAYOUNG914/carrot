const carrot_size = 80;
const carrot_count = 5;
const bug_count = 5;
const GAME_DURATION_SEC=5;

const field = document.querySelector('.game_field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game_button')
const gameTimer = document.querySelector('.game_timer')
const gameScore = document.querySelector('.game_score')

const popUp = document.querySelector('.popup');
const popUpText = document.querySelector('.pop-up_message');
const popRefresh = document.querySelector('.pop-up_refresh');

const carrotSound = new Audio('./sound/carrot_pull.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const wonSound = new Audio('./sound/game_win.mp3');
const alertSound = new Audio('./sound/alert.wav');
const bgSound = new Audio('./sound/bg.mp3');

let started = false; //게임 시작 되었는지 안되었는지, false 면 시작이 안됐단 소리
let score= 0; // 최종점수 기억
let timer = undefined; //남은 시간

gameBtn.addEventListener('click', ()=>{
    if(started){//게임이 시작 되었다면
        stopGame();
    }else{
        startGame();
    }
    
});

popRefresh.addEventListener('click', ()=>{
    hidePopUpWithText();
    startGame();
});

field.addEventListener('click', onFieldClick);

function startGame(){
    started = true;
    initGame();
    showStopButton();
    showTimerAndScore();
    startGameTimer();
    playSound(bgSound);
};

function stopGame(){
    started = false;
    stopGameTimer();
    hideGameButton();
    showPopUpWithText('REPLAY??');
    playSound(alertSound);
    stopSound(bgSound);
};

function  finishiGame(win){
    started = false;
    hideGameButton();
    if(win){
        playSound(wonSound);
    }else{
        playSound(bugSound)
    }
    stopGameTimer();
    stopSound(bgSound);
    showPopUpWithText(win? 'YOU WON!' : 'YOU LOST...');
};


function showStopButton(){
    const icon =gameBtn.querySelector('.fa-solid');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    gameBtn.style.visibility = 'visible';
};

function hideGameButton(){
    gameBtn.style.visibility = 'hidden';
};

function showTimerAndScore(){
    gameTimer.style.visibility = 'visible';
    gameScore.style.visibility = 'visible';
}

function startGameTimer(){ 
    let remainingTimeSec = GAME_DURATION_SEC;
    updateTimerText(remainingTimeSec);
    timer = setInterval(()=>{
        if(remainingTimeSec <=0){
            clearInterval(timer);
            finishiGame(carrot_count === score);
            return;
        }
        updateTimerText(--remainingTimeSec);
    },1000);
};

function stopGameTimer(){
    clearInterval(timer);//위에서 timer에 clearInterval 만들었었으니까 그거 쓰면 됨
};

function updateTimerText(time){
    const minutes = Math.floor(time/60);
    const seconds = time % 60;
    gameTimer.innerText = `${minutes}:${seconds}`;
}

function showPopUpWithText(text){
    popUpText.innerHTML = text;
    popUp.classList.remove('pop-up_hide');
}

function hidePopUpWithText(){
    popUp.classList.add('pop-up_hide');
}

function initGame(){
    score= 0;
    field.innerHTML = '';//시작할 때 마다 필드 리셋
    gameScore.innerText = carrot_count;
    //벌레와 당근을 생성한 뒤 filed에 추가해준다
    // console.log(fieldRect);
    addItem('carrot', carrot_count, 'img/carrot.png')
    addItem('bug', bug_count, 'img/bug.png')
}

function onFieldClick(event){
    if(!started){
        return;
    }
    const target = event.target;
    if(target.matches('.carrot')){
        // console.log('당근')
        target.remove();
        score++;
        playSound(carrotSound);
        updateScoreBoard();
        if(score === carrot_count){
            finishiGame(true);
        }
    }else if(target.matches('.bug')){
        // console.log('벌레');
        playSound(bugSound);
        finishiGame(false);
    }
};

function playSound(sound) {
    sound.currentTime= 0;
    sound.play();
}

function stopSound(sound) {
    sound.pause();
};

function updateScoreBoard(){
    gameScore.innerText = carrot_count - score;
}
function addItem(className, count, imgPath){
    const x1 = 0;
    const y1 =0;
    const x2 = fieldRect.width - carrot_size; //당근 사이즈만큼 빼줘야 그림이 필드를 넘어가지 않는다
    const y2 = fieldRect.height - carrot_size; //당근 사이즈만큼 빼줘야 그림이 필드를 넘어가지 않는다
    for(let i=0; i <count; i++){
        const item = document.createElement('img');

        item.setAttribute('class', className);
        item.setAttribute('src', imgPath);
        item.style.position = 'absolute';

        const x = randomNumber(x1, x2);
        const y = randomNumber(y1, y2);
        item.style.left = `${x}px`
        item.style.top = `${y}px`
        field.appendChild(item);
    }
}

function randomNumber(min, max){
    return Math.random() * (max-min) + min;
}