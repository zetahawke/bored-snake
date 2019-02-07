let dificulty, container, globalH, globalW, qvosW, qvosH, intervalTime, interval, score;
let direction = [0, 1]; // right
let snake = [];
let isGameOver = false;

window.onload = function () {
  console.log('loading script');

  dificulty = 2;
  container = document.getElementsByClassName('container')[0];
  intervalTime = 200;
  score = 0.0;

  var cleanElementClasses = function(elem) {
    elem.classList.remove('wall');
    elem.classList.remove('snake');
    elem.classList.remove('apple');
    elem.classList.remove('empty');
  }

  var createElementFromHTML = function (htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
  }

  var applyDifficult = function (dif = dificulty) {
    globalW = container.clientWidth / (dificulty * 10);
    globalH = container.clientHeight / (dificulty * 10);
    qvosW = container.clientWidth / globalW;
    qvosH = container.clientHeight / globalH;
    intervalTime = intervalTime * dificulty;
    divideContainer()
  }

  var divideContainer = function () {
    for (let indexH = 0; indexH < qvosH; indexH++) {
      for (let indexW = 0; indexW < qvosW; indexW++) {
        let tempEmpty = createElementFromHTML('<div id="' + indexH + '-' + indexW + '" class="empty" style="width: ' + globalW + 'px; height: ' + globalH +'px;"></div>')
        container.appendChild(tempEmpty);
      }
    }
    loadWall();
  }

  var loadWall = function () {
    let loadTop = function () {
      for (let index = 0; index < qvosW; index++) {
        var elem = document.getElementById('0-' + index);
        cleanElementClasses(elem);
        elem.classList.add('wall');
      }
    }
    let loadLeft = function () {
      for (let index = 0; index < qvosW; index++) {
        var elem = document.getElementById(index + '-0');
        cleanElementClasses(elem);
        elem.classList.add('wall');
      }
      
    }
    let loadRight = function () {
      for (let index = 0; index < qvosW; index++) {
        var elem = document.getElementById(index + '-' + (qvosW - 1));
        cleanElementClasses(elem);
        elem.classList.add('wall');
      }
    }
    let loadDown = function () {
      for (let index = 0; index < qvosW; index++) {
        var elem = document.getElementById((qvosW - 1) + '-' + index);
        cleanElementClasses(elem);
        elem.classList.add('wall');
      }
    }

    loadTop();
    loadLeft();
    loadRight();
    loadDown();
    loadSnake();
  }

  var loadSnake = function () {
    let large = 4;
    for (let index = large - 1; index >= 0; index--) {
      var elem = document.getElementById((qvosH / 2) + '-' + (qvosH / 2 - index));
      elem.classList.add('snake');
      snake.push(elem);
    }

    spawnApple();
  }

  var spawnApple = function () {
    var availableElements = document.getElementsByClassName('empty');
    var randElem = availableElements[Math.floor(Math.random() * availableElements.length)];
    randElem.classList.add('apple');
  }

  var gameOver = function () {
    intervalTime = 99999999;
    clearInterval(interval);
    isGameOver = true;
  }


  var moveSnake = function () {
    if (isGameOver) {
      return false;
    }
    let headId = snake[snake.length - 1].id;
    let headHeightPos = headId.split('-')[0];
    let headWidthPos = headId.split('-')[1];
    let isApple = false;

    var newHead = document.getElementById((parseInt(headHeightPos) + direction[0]) + '-' + (parseInt(headWidthPos) + direction[1]));

    if (newHead.classList.contains('wall') || newHead.classList.contains('snake')) {
      gameOver();
    }
    if (newHead.classList.contains('apple')) {
      spawnApple();
      isApple = true;
      score += 4 / dificulty;
      loadScore();
    }

    cleanElementClasses(newHead);
    newHead.classList.add('snake');
    snake.push(newHead);

    if (!isApple) {      
      let tailId = snake[0].id;
      
      var oldTaild = document.getElementById(tailId);
      cleanElementClasses(oldTaild);
      oldTaild.classList.add('empty');
      snake.splice(0 , 1);
    }
  };

  var loadScore = function () {
    var elem = document.getElementById('score');
    elem.innerHTML = score;
  }

  var runInterval = function () {
    interval = setInterval(function () {
      moveSnake();
      loadScore();
    }, intervalTime);
  }

  var loadKeyListener = function () {
    window.onkeyup = function (e) {
      var key = e.keyCode ? e.keyCode : e.which;

      if (key == 87) { // W
        if (direction[0] != 1) {
          direction[0] = -1;
          direction[1] = 0;
          moveSnake();
        }
      } else if (key == 65) { // A
        if (direction[1] != 1) {
          direction[1] = -1;
          direction[0] = 0;
          moveSnake();
        }
      } else if (key == 83) { // S
        if (direction[0] != -1) {
          direction[0] = 1;
          direction[1] = 0;
          moveSnake();
        }
      } else if (key == 68) { // D
        if (direction[1] != -1) {
          direction[1] = 1;
          direction[0] = 0;
          moveSnake();
        }
      }
    }
  }

  applyDifficult();
  runInterval();
  loadKeyListener();
}