const SOLUTION_ORDER = Array.from({ length: 9 }, (_, idx) => idx + 1);

let currentShuffle = [];
let draggedItem = null;
let count = 0;

const startTiles = document.getElementById('StartTiles');
const answerTiles = document.getElementById('AnswerTiles');
const lifeCount = document.getElementById('LifeCount');
const error = document.getElementById('error');
const overlayLose = document.querySelector('.overlay-lose');
const overlayWin = document.querySelector('.overlay-win');
const chooseWrap = document.querySelector('.ChooseWrap');
const gameStage = document.querySelector('.game-stage');
const gameBoxWrap = document.querySelector('.GameBoxWrap');
const musicPlayer = document.querySelector('.player-ctn');
const lifeCountbox = document.querySelector('.life');
const lifeTitle = document.querySelector('.LifeTitle');
const confirmButton = document.getElementById('confirmButton');

function generateRandomOrder() {
  const pool = [...SOLUTION_ORDER];
  const order = [];
  while (pool.length) {
    const index = Math.floor(Math.random() * pool.length);
    order.push(pool.splice(index, 1)[0]);
  }
  return order;
}

function setImgAttribute(img) {
  img.setAttribute('ondragstart', 'dragStartEvent(event)');
  img.setAttribute('ondragover', 'allowDrop(event)');
  img.setAttribute('ondrop', 'dropEvent(event)');
  img.setAttribute('draggable', 'true');
}

function buildQuestionTiles() {
  answerTiles.innerHTML = '';
  SOLUTION_ORDER.forEach((value) => {
    const img = document.createElement('img');
    img.setAttribute('src', './images/question.jpg');
    img.setAttribute('id', `${value * 100}`);
    img.setAttribute('value', 'Question');
    setImgAttribute(img);
    answerTiles.appendChild(img);
  });
}

function renderPuzzleTiles(num) {
  startTiles.innerHTML = '';
  currentShuffle.forEach((value) => {
    const img = document.createElement('img');
    img.setAttribute('src', `./images/dune${num}_${value}.jpg`);
    img.setAttribute('id', `${value}`);
    img.className = `Dune${value}`;
    setImgAttribute(img);
    startTiles.appendChild(img);
  });
}

function resetGameState() {
  count = 0;
  draggedItem = null;
  error.style.display = 'none';
  error.innerHTML = '';
  lifeCount.innerHTML = 'ooo';
  lifeTitle.style.color = '';
  lifeTitle.innerHTML = 'Life count';
  overlayLose.classList.remove('is-open');
  overlayWin.classList.remove('is-open');

  if (confirmButton) {
    confirmButton.classList.remove('is-disabled');
    confirmButton.textContent = 'confirm';
    confirmButton.setAttribute('aria-disabled', 'false');
    confirmButton.setAttribute('tabindex', '0');
  }
}

function clickImgPuzzle(num) {
  chooseWrap.style.display = 'none';
  if (gameStage) {
    gameStage.style.display = 'grid';
    gameStage.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  gameBoxWrap.style.display = 'grid';
  musicPlayer.style.display = 'block';
  lifeCountbox.style.display = 'flex';

  resetGameState();

  currentShuffle = generateRandomOrder();
  buildQuestionTiles();
  renderPuzzleTiles(num);
}

function getAnswerImages() {
  return Array.from(answerTiles.querySelectorAll('img'));
}

function isAnswerBoxFilled() {
  return getAnswerImages().every((item) => parseInt(item.id, 10) < 100);
}

function isPuzzleSolved() {
  const answerImages = getAnswerImages();
  return answerImages.length === SOLUTION_ORDER.length &&
    answerImages.every((item, idx) => parseInt(item.id, 10) === SOLUTION_ORDER[idx]);
}

function handleSolved() {
  if (overlayWin.classList.contains('is-open')) {
    return;
  }

  error.style.display = 'none';
  overlayWin.classList.add('is-open');

  if (confirmButton) {
    confirmButton.classList.add('is-disabled');
    confirmButton.textContent = '완료';
    confirmButton.setAttribute('aria-disabled', 'true');
    confirmButton.setAttribute('tabindex', '-1');
  }
}

function evaluatePuzzle(isAutoCheck = false) {
  if (!isAnswerBoxFilled()) {
    if (!isAutoCheck) {
      error.style.display = 'block';
      error.innerHTML = 'fill the answer box !';
    }
    return false;
  }

  if (isPuzzleSolved()) {
    handleSolved();
    return true;
  }

  if (!isAutoCheck) {
    error.style.display = 'block';
    error.innerHTML = 'try again';
    count++;
    if (lifeCount.innerHTML.length > 0) {
      lifeCount.innerHTML = lifeCount.innerHTML.slice(0, -1);
    }
    if (count === 3) {
      lifeTitle.style.color = 'red';
      lifeTitle.innerHTML = 'Last Chance';
    }
    if (count > 3) {
      overlayLose.classList.add('is-open');
      if (confirmButton) {
        confirmButton.classList.add('is-disabled');
        confirmButton.setAttribute('aria-disabled', 'true');
        confirmButton.setAttribute('tabindex', '-1');
      }
    }
  }

  return false;
}

function checkWinLose() {
  evaluatePuzzle(false);
}

if (confirmButton) {
  confirmButton.addEventListener('click', () => {
    if (confirmButton.classList.contains('is-disabled')) {
      return;
    }
    checkWinLose();
  });

  confirmButton.addEventListener('keydown', (event) => {
    if (confirmButton.classList.contains('is-disabled')) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      checkWinLose();
    }
  });
}

function dragStartEvent(event) {
  draggedItem = event.target;
}

function allowDrop(event) {
  event.preventDefault();
}

function dropEvent(event) {
  event.preventDefault();

  if (event.target.tagName !== 'IMG' || !draggedItem) {
    return;
  }

  if (event.target === draggedItem) {
    draggedItem = null;
    return;
  }

  const tempSrc = event.target.src;
  event.target.src = draggedItem.src;
  draggedItem.src = tempSrc;

  const tempValue = event.target.getAttribute('id');
  event.target.setAttribute('id', draggedItem.getAttribute('id'));
  draggedItem.setAttribute('id', tempValue);

  evaluatePuzzle(true);
  draggedItem = null;
}

/* audio JS */

function createTrackItem(index,name,duration){
    var trackItem = document.createElement('div');
    trackItem.setAttribute("class", "playlist-track-ctn");
    trackItem.setAttribute("id", "ptc-"+index);
    trackItem.setAttribute("data-index", index);
    document.querySelector(".playlist-ctn").appendChild(trackItem);

    var playBtnItem = document.createElement('div');
    playBtnItem.setAttribute("class", "playlist-btn-play");
    playBtnItem.setAttribute("id", "pbp-"+index);
    document.querySelector("#ptc-"+index).appendChild(playBtnItem);

    var btnImg = document.createElement('i');
    btnImg.setAttribute("class", "fas fa-play");
    btnImg.setAttribute("height", "40");
    btnImg.setAttribute("width", "40");
    btnImg.setAttribute("id", "p-img-"+index);
    document.querySelector("#pbp-"+index).appendChild(btnImg);

    var trackInfoItem = document.createElement('div');
    trackInfoItem.setAttribute("class", "playlist-info-track");
    trackInfoItem.innerHTML = name
    document.querySelector("#ptc-"+index).appendChild(trackInfoItem);

    var trackDurationItem = document.createElement('div');
    trackDurationItem.setAttribute("class", "playlist-duration");
    trackDurationItem.innerHTML = duration
    document.querySelector("#ptc-"+index).appendChild(trackDurationItem);
  }

  var listAudio = [
    {
      name:"Only I Will Remain",
      file:"./video/Only I Will Remain.mp3",
      duration:"06:44"
    },
    {
      name:"Worm Ride",
      file:"./video/Worm Ride.mp3",
      duration:"02:19"
    },
    {
      name:"Herald of the Change",
      file:"./video/Herald of the Change.mp3",
      duration:"05:02"
    },
  ]

  for (var i = 0; i < listAudio.length; i++) {
      createTrackItem(i,listAudio[i].name,listAudio[i].duration);
  }
  var indexAudio = 0;

  function loadNewTrack(index){
    var player = document.querySelector('#source-audio')
    player.src = listAudio[index].file
    document.querySelector('.title').innerHTML = listAudio[index].name
    this.currentAudio = document.getElementById("myAudio");
    this.currentAudio.load()
    this.toggleAudio()
    this.updateStylePlaylist(this.indexAudio,index)
    this.indexAudio = index;
  }

  var playListItems = document.querySelectorAll(".playlist-track-ctn");

  for (let i = 0; i < playListItems.length; i++){
    playListItems[i].addEventListener("click", getClickedElement.bind(this));
  }

  function getClickedElement(event) {
    for (let i = 0; i < playListItems.length; i++){
      if(playListItems[i] == event.target){
        var clickedIndex = event.target.getAttribute("data-index")
        if (clickedIndex == this.indexAudio ) { // alert('Same audio');
            this.toggleAudio()
        }else{
            loadNewTrack(clickedIndex);
        }
      }
    }
  }

  document.querySelector('#source-audio').src = listAudio[indexAudio].file
  document.querySelector('.title').innerHTML = listAudio[indexAudio].name


  var currentAudio = document.getElementById("myAudio");

  currentAudio.load()
  
  currentAudio.onloadedmetadata = function() {
        document.getElementsByClassName('duration')[0].innerHTML = this.getMinutes(this.currentAudio.duration)
  }.bind(this);

  var interval1;

  function toggleAudio() {

    if (this.currentAudio.paused) {
      document.querySelector('#icon-play').style.display = 'none';
      document.querySelector('#icon-pause').style.display = 'block';
      document.querySelector('#ptc-'+this.indexAudio).classList.add("active-track");
      this.playToPause(this.indexAudio)
      this.currentAudio.play();
    }else{
      document.querySelector('#icon-play').style.display = 'block';
      document.querySelector('#icon-pause').style.display = 'none';
      this.pauseToPlay(this.indexAudio)
      this.currentAudio.pause();
    }
  }

  function pauseAudio() {
    this.currentAudio.pause();
    clearInterval(interval1);
  }

  var timer = document.getElementsByClassName('timer')[0]

  var barProgress = document.getElementById("myBar");


  var width = 0;

  function onTimeUpdate() {
    var t = this.currentAudio.currentTime
    timer.innerHTML = this.getMinutes(t);
    this.setBarProgress();
    if (this.currentAudio.ended) {
      document.querySelector('#icon-play').style.display = 'block';
      document.querySelector('#icon-pause').style.display = 'none';
      this.pauseToPlay(this.indexAudio)
      if (this.indexAudio < listAudio.length-1) {
          var index = parseInt(this.indexAudio)+1
          this.loadNewTrack(index)
      }
    }
  }


  function setBarProgress(){
    var progress = (this.currentAudio.currentTime/this.currentAudio.duration)*100;
    document.getElementById("myBar").style.width = progress + "%";
  }


  function getMinutes(t){
    var min = parseInt(parseInt(t)/60);
    var sec = parseInt(t%60);
    if (sec < 10) {
      sec = "0"+sec
    }
    if (min < 10) {
      min = "0"+min
    }
    return min+":"+sec
  }

  var progressbar = document.querySelector('#myProgress')
  progressbar.addEventListener("click", seek.bind(this));


  function seek(event) {
    var percent = event.offsetX / progressbar.offsetWidth;
    this.currentAudio.currentTime = percent * this.currentAudio.duration;
    barProgress.style.width = percent*100 + "%";
  }

  function forward(){
    this.currentAudio.currentTime = this.currentAudio.currentTime + 5
    this.setBarProgress();
  }

  function rewind(){
    this.currentAudio.currentTime = this.currentAudio.currentTime - 5
    this.setBarProgress();
  }


  function next(){
    if (this.indexAudio <listAudio.length-1) {
        var oldIndex = this.indexAudio
        this.indexAudio++;
        updateStylePlaylist(oldIndex,this.indexAudio)
        this.loadNewTrack(this.indexAudio);
    }
  }

  function previous(){
    if (this.indexAudio>0) {
        var oldIndex = this.indexAudio
        this.indexAudio--;
        updateStylePlaylist(oldIndex,this.indexAudio)
        this.loadNewTrack(this.indexAudio);
    }
  }

  function updateStylePlaylist(oldIndex,newIndex){
    document.querySelector('#ptc-'+oldIndex).classList.remove("active-track");
    this.pauseToPlay(oldIndex);
    document.querySelector('#ptc-'+newIndex).classList.add("active-track");
    this.playToPause(newIndex)
  }

  function playToPause(index){
    var ele = document.querySelector('#p-img-'+index)
    ele.classList.remove("fa-play");
    ele.classList.add("fa-pause");
  }

  function pauseToPlay(index){
    var ele = document.querySelector('#p-img-'+index)
    ele.classList.remove("fa-pause");
    ele.classList.add("fa-play");
  }


  function toggleMute(){
    var btnMute = document.querySelector('#toggleMute');
    var volUp = document.querySelector('#icon-vol-up');
    var volMute = document.querySelector('#icon-vol-mute');
    if (this.currentAudio.muted == false) {
       this.currentAudio.muted = true
       volUp.style.display = "none"
       volMute.style.display = "block"
    }else{
      this.currentAudio.muted = false
      volMute.style.display = "none"
      volUp.style.display = "block"
    }
  }