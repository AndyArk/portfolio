var conditionList = [{
    symbol0: 0.6,
    symbol1: 0.4,
    symbol0Image: 'resources/tshirt_blue.png',
    symbol1Image: 'resources/tshirt_pink.png',
    symbol0Count: 0,
    symbol1Count: 0,
},{
    symbol0: 0.25,
    symbol1: 0.75,
    symbol0Image: 'resources/tshirt_green.png',
    symbol1Image: 'resources/tshirt_orange.png',
    symbol0Count: 0,
    symbol1Count: 0,
    switch: 18
},{
    symbol0: 0.5,
    symbol1: 0.5,
    symbol0Image: 'resources/tshirt_purple.png',
    symbol1Image: 'resources/tshirt_burgundy.png',
    symbol0Count: 0,
    symbol1Count: 0,
    switch: 18
}];

/*Customize the Order of the Trials
randomized:
    If True, the conditions are presented in random order
    If false, two Options:
        1. Randomly decide which condition is presented first
        2. Choose which condition is first
            0: 50-50 then 90-10 condition
            1: 75-25 then reversal condition */
var randomize = false; //Set true or false
if (randomize){
    var condition = Math.floor(Math.random()*2);
}else{
    condition = 0; //Specify Initial Condition
    //condition = Math.floor(Math.random()*2); //Random condition presented first
}
var practice = true;
var conditionTrials = [5,36,36]; //Number of trials presented for each condition
var nTrials = 77; //Total number of trials, must equal the sum of conditionTrials
var Trial = 0; //Current Trial

//Initialize Participant
var d = new Date();
var subjID = 'MIT' + Math.random().toString().substring(3,8);
var filename = subjID; //+ '_' + d.getTime();
//Initialize Experiment Variables
var reward = 0;
var totalReward = 0;
var b = 0;
var currChar;
var mode = 0;
var k1 = Math.floor(Math.random()*2);
var k2 = 1 - k1;
var timerID_nextTrial;
var timerID_StartGame;
var LR = ['left', 'right','none'];
var colors = [['blue', 'pink'], ['green','orange'],['purple','burgundy']];

// Initialization
$(document).ready(function() {
    $('#endExperiment').hide();
    $('#startGame').hide();
    $('.row').hide();
    $('#feedback').hide();
    $('#image_plus').hide();
    $('#image_minus').hide();
    $('#neutral').hide();
    $('#confirmation').hide();
    $('#question').hide();


    //Buttons with Symbols
    $(document).keydown(function(event){
        if (mode == 0){
            if(event.which == 32){
                StartGame();
                timerID_nextTrial = setTimeout(  () => {   conditionTrials[condition] -= 1;currChar = 'none';reward=0;RT=0;b=2;nextTrial();  },   3000);
            }
        }

        if(mode == 1) {

            if (event.which == 37) {
                //Cancel NextTrial Timer
                clearTimeout(timerID_nextTrial);
                mode = 2;
                conditionTrials[condition] -= 1;
                $('#confirmation').show();
                document.getElementById("confirmation").style.cssFloat='left';
                //Run Code with delay 3 - (currentTime - startTrialTime)
                const currTime = new Date().getTime();
                RT = calcReactionTime(startTrialTime);
                setTimeout(  () => {
                    $('#confirmation').hide();
                    b = 0;
                    updateButtons(k1);
                    totalReward = updateBank(k1);
                    setTimeout(  () => {    nextTrial();  },   500);

                },   3000 - (currTime - startTrialTime));
            }
            if (event.which == 39) {
                clearTimeout(timerID_nextTrial);
                mode = 2;
                conditionTrials[condition] -= 1;
                $('#confirmation').show();
                document.getElementById("confirmation").style.cssFloat = 'right';
                //Run Code with delay 3 - (currentTime - startTrialTime)
                const currTime = new Date().getTime();
                RT = calcReactionTime(startTrialTime);
                setTimeout(  () => {
                    $('#confirmation').hide();
                    b = 1;
                    updateButtons(k2);
                    totalReward = updateBank(k2);
                    mode = 2;
                    setTimeout(  () => {    nextTrial();  },   500);

                },   3000 - (currTime - startTrialTime));
            }
        }
    });


function nextTrial() {
    mode = 2;
    $('#image_plus').hide();
    $('#image_minus').hide();
    $('.row').hide();
    $('#neutral').show();
    timerID_StartGame = setTimeout(  () => {
        $('#neutral').hide();
        StartGame();
        timerID_nextTrial = setTimeout(  () => {   conditionTrials[condition] -= 1;currChar = 'none';reward=0;RT=0;b=2;nextTrial();  },   3000);
        },   500);

    Trial++;

    //Save trial results to file
    if(!practice){
        var col0 = Trial;
        var col1 = condition;
        var col2 = LR[b];
        var col3 = colors[condition][currChar];
        var col4 = reward;
        var col5 = RT;
        var col6 = colors[condition][k1];
        var col7 = colors[condition][k2];
        var col8 = conditionList[condition]['symbol'+k1];
        var col9 = conditionList[condition]['symbol'+k2];
        var col10 = totalReward + '\n';
        $.post("post_results.php",{filename: filename, trial: col0, condition: col1, button_selected: col2, color_selected: col3, reward: col4, RT: col5, symbolLeft: col6, symbolRight: col7, probLeft: col8, probRight: col9, totalReward: col10},
            function(data, status){
                console.log("Data: " + data + "\nStatus: " + status);
        });
    }

    // Initial start experiment
    if (Trial == 0){
        $('#buttons').hide();
        $('#startGame').show();
        $('#startGame').text("Start Game");
        k1 = Math.floor(Math.random()*2); //1 or 0
        k2 = 1 - k1;  //Opposite of k1

    }

    // end experiment
    if (Trial == nTrials) {
        $('.row').hide();
        $('#startGame').hide();
        $('#Instructions').show();
        $('#title').hide();
        $('#neutral').hide();
        clearTimeout(timerID_nextTrial);
        clearTimeout(timerID_StartGame);
        $("#Instructions").text("You're done! \nYour code is " + subjID + ". Please copy this number onto your survey. This ID number is the only method used to link the activity and questionnaire, no identifying information is used. Thank you!");
    }

    if(Trial == 5) {
        probability_input(condition, 'The practice trials have now ended. The remaining trials will be for real money!');
        practice = false;
    }

    if (Trial == 23) {
        probability_input(condition, 'Thank you for your response! Press space to continue!');
    }

    if (Trial == 59) {
        probability_input(condition, 'Thank you for your response! Press space to continue!');
    }

    if (Trial == 41){
        pause_with_instructions("The first half of the trials of over.\n\nPress space to continue.");
    }

    //Switch probabilities starting on Trial 25
    //24 trials 50/50, 16 remaining trials 90/10
    randomizeCondition();

    startTrialTime = new Date().getTime();
}

});

function StartGame() {
    $('#startGame').hide();
    $('#Instructions').hide();
    $('.row').show();
    $('#title').text("");
    mode = 1;
    startTrialTime = new Date().getTime();
    k1 = Math.floor(Math.random()*2);
    k2 = 1- k1;
    $("#SymbolLeft").attr("src", conditionList[condition]['symbol'+k1+'Image']);
    $("#SymbolRight").attr("src", conditionList[condition]['symbol'+k2+'Image']);

}

function StartExperiment() {
    $('#consent').hide();
    $('#startExperiment').hide();
    $('#Instructions').show();
    $('#startGame').show();
}

function calcReward(charNum){
    //Calculates reward or punishment
    randVal = Math.random();
    probability = conditionList[condition]["symbol"+charNum];
    if (randVal < probability){
        return 0.5;
    }else{
        return -0.5;
    }
}

function updateBank(k1){
    reward = calcReward(k1);
    if(!practice){
        totalReward += reward;
    }
    if (reward > 0){
        $('#image_plus').show();
    }else if (reward < 0){
        $('#image_minus').show();
    }else{
        $('#neutral').show();
    }
    return totalReward;
}

function updateButtons(k){
    $('.row').hide();
    $('#neutral').hide();
    conditionList[condition]['symbol'+k+'Count'] += 1;
    currChar = k;
}

function calcReactionTime(startTrialTime){
    var currentTime = new Date().getTime();
    RT = currentTime - startTrialTime;
    return RT;
}

function randomizeCondition() {
    if (conditionTrials[2] == conditionList[2]['switch']) {
        sCount0 = conditionList[2]['symbol0Count'];
        sCount1 = conditionList[2]['symbol1Count'];
        if (sCount0 > sCount1) {
            conditionList[2]['symbol0'] = 0.1;
            conditionList[2]['symbol1'] = 0.9;
        } else if (sCount1 > sCount0) {
            conditionList[2]['symbol0'] = 0.9;
            conditionList[2]['symbol1'] = 0.1;
        } else {
            randSwitch = Math.floor(Math.random()*2);
            conditionList[2]['symbol' + randSwitch] = 0.9;
            conditionList[2]['symbol' + 1 - randSwitch] = 0.1;
        }
    }
    if (conditionTrials[1] == conditionList[1]['switch'] && condition == 1) {
            temp = conditionList[1]['symbol0'];
            conditionList[1]['symbol0'] = conditionList[1]['symbol1'];
            conditionList[1]['symbol1'] = temp;
    }

    if(randomize){
        condition = Math.floor(Math.random()*2);
    }

        if (conditionTrials[condition] == 0 && (conditionTrials[0]+conditionTrials[1]+conditionTrials[2]!=0)){
            //condition = Math.floor(Math.random()*2);
            condition+=1;
        }
}

function pause_with_instructions(instructions){
    $('.row').hide();
    $('#startGame').hide();
    $('#Instructions').show();
    $('#title').hide();
    $('#neutral').hide();
    mode = 0;
    clearTimeout(timerID_nextTrial);
    clearTimeout(timerID_StartGame);
    $("#Instructions").text(instructions);
}

function probability_input(condition, instructions){
    $('#question').show();
    if(conditionList[condition]['symbol0Count'] > conditionList[condition]['symbol1Count']){
        $('#guess').attr('src', conditionList[condition]['symbol0Image']);
    }else{
        $('#guess').attr('src', conditionList[condition]['symbol1Image']);
    }
    pause_with_instructions('What do you think was the probability of receiving a reward from this t-shirt? (0-100)');
    mode = 2;
    $('#question').submit(function(e){
        e.preventDefault();
        $.ajax({
            url:'db-connect.php',
            type:'post',
            data:{guess: $('#question').serialize(), subject_ID: filename, condition: condition},
            success:function(){
                $('#question').hide();
                pause_with_instructions(instructions);
            }
        });
    });
}
