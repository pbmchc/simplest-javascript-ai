document.getElementById('starter').onclick = function () {
    simulate(1);
};

document.getElementById('starter').onmousedown = function () {
    this.className += " pressed";
};

document.getElementById('starter').onmouseup = function () {
    this.className = "button";
};

document.getElementById('starter').onmouseleave = function () {
    this.className = "button";
};

document.getElementById('stopper').onclick = function () {
    simulate(0);
};

document.getElementById('stopper').onmousedown = function () {
    this.className += " pressed";
};

document.getElementById('stopper').onmouseup = function () {
    this.className = "button";
};

document.getElementById('stopper').onmouseleave = function () {
    this.className = "button";
};


var counter = 0;
var tickInterval;
var spaceshipPos = 0;
var passes = 0;
var crashes = 0;
var obstacles = 0;
var successRate = 0;
var lastObstacle = 0;
var lastPassed = 0;
var lastCrash = 0;
var tryZone = 0;
var damage = 0;
var time;

function counterTick() {

    moveObstacle();
    collisionCheck();
    experience();
}

function simulate(state) {
    if (state === 1) {
        if (tickInterval == null) {
            tickInterval = setInterval(counterTick, 25);
            time = Date.now();
        }
    }
    else {
        reset();
    }
}

function moveObstacle() {

    var obstacleX = document.getElementsByClassName('obstacle')[0].offsetLeft;
    var obstacleY = document.getElementsByClassName('obstacle')[0].offsetTop;
    var sensorX = document.getElementById('sensor3').offsetLeft + 500;
    var sensorY = document.getElementById('spaceship').offsetTop;
    successRate = Math.floor(passes / obstacles * 100);
    updateChart();
    if (damage >= 100) {
        simulate(0);
        document.getElementById('finalScreen').style.display = 'block';
        setTimeout(function () { document.getElementById('finalScreen').style.display = 'none'; }, 1500);
    };
    var obstacleCenter = obstacleY + (document.getElementsByClassName('obstacle')[0].style.height/2);

    if (obstacleCenter <= 200) {
        document.getElementById('obstacleZone').innerHTML = '0';
    }
    else {
        document.getElementById('obstacleZone').innerHTML = '1';
    }

    var spaceshipCenter = sensorY + 25;

    if (spaceshipCenter <= 200) {
        document.getElementById('spaceshipZone').innerHTML = '0';

    }
    else {
        document.getElementById('spaceshipZone').innerHTML = '1';
    }

    document.getElementById('controlTextarea').innerHTML = "TIME ELAPSED:" + (Math.floor((Date.now()-time)/1000)) + 's\n\n' + 
        "OBSTACLE: X:[" + obstacleX + "], Y:[" + obstacleY + "]\n" + 
        "SPACESHIP: X:[" + sensorX + "], Y:[" + sensorY + "]\n" + "OBSTACLES: " + obstacles + "\n" +
        "PASSES:" + passes + "\n" + "CRASHES:" + crashes + "\n" + "SUCCESS:" + (isNaN(successRate) ? 0 : successRate) + "%";
    document.getElementById('controlTextarea').scrollTop = document.getElementById('controlTextarea').scrollHeight;

    if (obstacleX >= 0) {
        obstacleX = obstacleX - 50;
        document.getElementsByClassName('obstacle')[0].style.left = obstacleX + 'px';
    }
}

function avoidObstacle(direction) {

    if (spaceshipPos < 50) spaceshipPos = 50;
    if (spaceshipPos > 300) spaceshipPos = 300;

    if (direction == 'down') {
        spaceshipPos += 20;
    }
    else {
        spaceshipPos -= 20;
    }

    document.getElementById('spaceship').style.top = spaceshipPos + 'px';
}

function collisionCheck() {
    
    var obstacleHeight = document.getElementsByClassName('obstacle')[0].offsetHeight;
    var obstacleX = document.getElementsByClassName('obstacle')[0].offsetLeft;
    var obstacleY = document.getElementsByClassName('obstacle')[0].offsetTop + obstacleHeight;
    var sensorX = document.getElementById('sensor3').offsetLeft + 500;
    var sensorY = document.getElementById('spaceship').offsetTop;

    if (obstacleX < sensorX && sensorY >= obstacleY-obstacleHeight && sensorY < obstacleY ||
        obstacleX < sensorX && obstacleY - obstacleHeight > sensorY && obstacleY - obstacleHeight < sensorY + 50) {

        document.getElementById('sensor3').style.backgroundColor = "red";
        if (obstacleX <= 0) {
            if (lastCrash === crashes) {
                document.getElementById('hit').style.visibility = 'visible';
                setTimeout(function () { document.getElementById('hit').style.visibility = 'hidden'; }, 100);
                crashes++; obstacles++;
                damage += Math.floor(obstacleHeight / 10);
            }
        }
    }
    else {
        document.getElementById('sensor3').style.backgroundColor = "white";
        if (obstacleX <= 0) { if (lastPassed === passes) { passes++; obstacles++; } }
    }
}

function experience() {

    var spaceShipZone;
    var obstacleZone;

    var obstacleY = document.getElementsByClassName('obstacle')[0].offsetTop;
    var obstacleCenter = obstacleY + (document.getElementsByClassName('obstacle')[0].offsetHeight / 2);

    if (obstacleCenter <= 200) {
        document.getElementById('obstacleZone').innerHTML = '0';
        obstacleZone = '0';
    }
    else {
        document.getElementById('obstacleZone').innerHTML = '1';
        obstacleZone = '1';
    }

    var sensorY = document.getElementById('spaceship').offsetTop;
    var spaceshipCenter = sensorY + 25;

    if (spaceshipCenter <= 200) {
        document.getElementById('spaceshipZone').innerHTML = '0';
        spaceShipZone = '0';
    }
    else {
        document.getElementById('spaceshipZone').innerHTML = '1';
        spaceShipZone = '1';
    }

    document.getElementById('tryingOption').innerHTML = tryZone;

    var chosenOption = spaceShipZone + obstacleZone + tryZone;
    var experienceData = document.getElementById('success' + chosenOption).innerHTML;

    if (tryZone === 0) {
        var chosenOptionOppos = spaceShipZone + obstacleZone + '1';
        var experienceDataOppos = document.getElementById('success' + chosenOptionOppos).innerHTML;
        if (parseInt(experienceDataOppos) > parseInt(experienceData)) {
            chosenOption = chosenOptionOppos;
            experienceData = document.getElementById('success' + chosenOption).innerHTML;
            tryZone = 1;
        }
    }

    if (tryZone === 1) {
        var chosenOptionOppos = spaceShipZone + obstacleZone + '0';
        var experienceDataOppos = document.getElementById('success' + chosenOptionOppos).innerHTML;
        if (parseInt(experienceDataOppos) > parseInt(experienceData)) {
            chosenOption = chosenOptionOppos;
            experienceData = document.getElementById('success' + chosenOption).innerHTML;
            tryZone = 0;
        }
    }

    if (tryZone == 0) {
        avoidObstacle('up');
    }
    else {
        avoidObstacle('down');
    }

    if (lastObstacle != obstacles) {

        if (lastPassed != passes) {
            experienceData = parseInt(experienceData) + 1;
            document.getElementById('success' + chosenOption).innerHTML = experienceData;
            lastPassed = passes;
        }
        if (lastCrash != crashes) {
            experienceData = parseInt(experienceData) - 1;
            document.getElementById('success' + chosenOption).innerHTML = experienceData;
            lastCrash = crashes;
        }

        lastObstacle = obstacles;

        tryZone = Math.floor(Math.random() * 2);

        var newHeight = Math.floor((Math.random() * 130) + 20);
        var positionY = Math.floor(Math.random() * (400-newHeight));

        document.getElementsByClassName('obstacle')[0].style.top = positionY + 'px';
        document.getElementsByClassName('obstacle')[0].style.left = null;
        document.getElementsByClassName('obstacle')[0].style.right = '0';
        document.getElementsByClassName('obstacle')[0].style.height = newHeight + 'px';
    }
}

google.charts.load('current', {'packages':['gauge']});
google.charts.setOnLoadCallback(drawChart);

var data, chart, options;
function drawChart() {

    data = google.visualization.arrayToDataTable([
      ['Label', 'Value'],
      ['%', 0]
    ]);

    options = {
        width: 400,
        redFrom: 90, redTo: 100,
        minorTicks: 10,
        greenFrom: 0, greenTo: 20,
        height: 140
    };

    chart = new google.visualization.Gauge(document.getElementById('successMeter'));

    chart.draw(data, options);
}

function updateChart() {
    data.setValue(0, 1, damage);
    chart.draw(data, options);
}

function reset() {
    clearInterval(tickInterval);
    tickInterval = null;
    document.getElementsByClassName('obstacle')[0].style.left = null;
    document.getElementsByClassName('obstacle')[0].style.right = '0';
    document.getElementById('spaceship').style.left = 30 + 'px';
    document.getElementById('spaceship').style.top = 50 + 'px';
    document.getElementById('sensor3').style.backgroundColor = "white";
    spaceshipPos = 0;
    passes = 0;
    crashes = 0;
    obstacles = 0;
    damage = 0;
    var tds = document.getElementsByTagName('td');
    for (var i = 0; i < tds.length; i++) {
        if (tds[i].id.indexOf('success') !== -1)
            tds[i].innerHTML = '0';
    }
    time = 0;
    updateChart();
}