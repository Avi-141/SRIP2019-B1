var AnsweredStack = [];
var RandomNumbers = [];
var EmptyTemp = 1;
var CorrectCount = 0;
var TotsPresent = 0;

var qsjson = [];

function thisref(question, choice1, choice2, choice3, ans) {
    this.ques = question;
    this.choice1 = choice1;
    this.choice2 = choice2;
    this.choice3 = choice3;
    this.answer = ans;
}
function start() {
    initJson();
}
function initJson() {
    $.ajax(
        {
            type:"GET",
            url: "flashcardquiz.json",
            data: "",
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            async:false,
            cache: false,
            success: function (data) 
            {

                $(data.stuff).each(function (a, b) 
                {
                    var obj = new thisref(b.ques, b.choice1, b.choice2, b.choice3, b.answer);
                    qsjson.push(obj);
                });
            }

        }
    );
}


function genQuest(QID, AnsID, currstate) {
    var ScrollpageDiv = document.getElementById("qbody");
    var prdiv = document.createElement("div");
    var forqs = document.createElement("div");
    var br = document.createElement("BR");
    forqs.id = QID;     
    forqs.className = "question";
    prdiv.appendChild(forqs);
    prdiv.appendChild(br);

    for (var i = 0; i < 3; i++) {
        var choiceionDiv = document.createElement("div");
        choiceionDiv.className = "answer";

        var input = document.createElement("INPUT");
        input.setAttribute("type", "radio");
        input.id = AnsID.concat((i + 1).toString());    
        input.name = QID;     

        var span = document.createElement("SPAN");
        span.id = QID.concat((i + 1).toString());    

        choiceionDiv.appendChild(input);
        choiceionDiv.appendChild(span);
        prdiv.appendChild(choiceionDiv);
    }

    ScrollpageDiv.appendChild(prdiv);
    if (currstate !==0 && currstate!==TotsPresent) {
        var br = document.createElement("BR");
        var hr = document.createElement("HR");
        ScrollpageDiv.insertBefore(br, prdiv);
        ScrollpageDiv.insertBefore(hr, prdiv);
    }

}
function ResWindowDispl(RID, currstate) {
    var ScrollpageDiv = document.getElementById("ShowRes");
    var prdiv = document.createElement("div");
    var forqs = document.createElement("div");
    var br = document.createElement("BR");
    forqs.id = RID;     
    forqs.className = "question";
    prdiv.appendChild(forqs);
    prdiv.appendChild(br);

    for (var i = 0; i < 2; i++) {
        var AnswerDiv = document.createElement("div");
        AnswerDiv.className = "answer";

        var span = document.createElement("SPAN");
        span.id = RID.concat((i + 1).toString());  

        AnswerDiv.appendChild(span);
        prdiv.appendChild(AnswerDiv);
    }

    ScrollpageDiv.appendChild(prdiv);
    if (currstate !==0 && currstate!==TotsPresent) {
        var br = document.createElement("BR");
        var hr = document.createElement("HR");
        ScrollpageDiv.insertBefore(br, prdiv);
        ScrollpageDiv.insertBefore(hr, prdiv);
    }
}
function CreateForms() {
   // var tots = document.getElementById("questionCount").value;
   /// tots= parseInt(tots);
   // if (tots > 3 && tots < qsjson.length) {
    TotsPresent = Math.floor((Math.random() * 3) + 4);
    var QId = "QS";
    var AnsID = "A";
    var RId = "R";
    for (var i = 0; i < TotsPresent; i++) {
        var Qstring = QId.concat((i + 1).toString());
        var Astring = AnsID.concat((i + 1).toString());
        var Rstring = RId.concat((i + 1).toString());
        genQuest(Qstring, Astring, i);
        ResWindowDispl(Rstring, i);
    }
   //return 1;
}
//else return 0;
//}
function ResToShow() {
    var RID = "R";
    var QID = "QS";
    for (var i = 0; i < TotsPresent; i++) {
        var QIDcurr = QID.concat((i + 1).toString());    
        var TempRID = RID.concat((i + 1).toString());  
        var AnsID = TempRID.concat("1");   
        var UserAnsID = TempRID.concat("2");    
        var Decision = "Correct Answer : ";
        document.getElementById(TempRID).innerHTML = qsjson[RandomNumbers[i]].ques;
        document.getElementById(AnsID).innerHTML = Decision + qsjson[RandomNumbers[i]].answer;
        if (AnsweredStack[i] === -1) {
            document.getElementById(UserAnsID).innerHTML = "Question Skipped by you :(";
            document.getElementById(UserAnsID).style.color = "black";
        }
        else {
            var t1;
            var t2;
            if (AnsweredStack[i] === 1) {
                t1 = document.getElementById(QIDcurr.concat("1")).innerHTML;
                t2 = qsjson[RandomNumbers[i]].answer;
            }
            else if (AnsweredStack[i] === 2) {
                t1 = document.getElementById(QIDcurr.concat("2")).innerHTML;
                t2 = qsjson[RandomNumbers[i]].answer;
            }
            else if (AnsweredStack[i] === 3) {
                t1 = document.getElementById(QIDcurr.concat("3")).innerHTML;
                t2 = qsjson[RandomNumbers[i]].answer;
            }
            if (t1 !== t2) {
                Decision = "You chose Incorrect!"+":";
                //Decision.style.color="red";
            document.getElementById(UserAnsID).style.color = "red";
            } else {
                Decision = "You chose Correct, Expert! : ";
                document.getElementById(UserAnsID).style.color = "green";
            }
            document.getElementById(UserAnsID).innerHTML = Decision + t1;
        }
    }
}
function removeChildren() {
    var qDiv = document.getElementById("qbody");
    while (qDiv.hasChildNodes()) {
        qDiv.removeChild(qDiv.firstChild);
    }

    var rDiv = document.getElementById("ShowRes");
    while (rDiv.hasChildNodes()) {
        rDiv.removeChild(rDiv.firstChild);
    }
}
function begin() {
    document.getElementById("Titles").innerHTML = "Quiz for Integer Arithmetic";
    document.getElementById("result").style.display = "none";
    document.getElementById("ShowRes").style.display = "none";
    document.getElementById("bts").style.visibility = "hidden";
    document.getElementById("btsb").style.display = "block";
    removeChildren();
    CreateForms();
    /*if(currstate==0)
    {
        alert("You have to answer atleast 4 questions out of a max possible " + qsjson.length +" questions ");
    }
    else
    {*/
    GenQs();
    document.getElementById("qbody").style.display = "block";
}
function endgame(){
    document.getElementById("btsb").style.display = "none";
    document.getElementById("bts").style.visibility = "visible";
    submitAnswers();
    document.getElementById("qbody").style.display = "none";
    document.getElementById("result").innerHTML = "You have scored "+(CorrectCount).toString() + " out of " + TotsPresent;
    ResToShow();
    document.getElementById("Titles").innerHTML = "Your results are here!";
    // if(((CorrectCount).toString())===TotsPresent)
      //  alert("All correct, Good JOB");
    document.getElementById("result").style.display = "block";
    document.getElementById("ShowRes").style.display = "block";
    CorrectCount = 0;
    EmptyTemp = 1;
    AnsweredStack = [];
    RandomNumbers = [];
}

function generateRandomIndex() {
    var x = Math.floor((Math.random() * 10) + 0);
    var temp = RandomNumbers.indexOf(x);
    while (temp !==-1 && EmptyTemp === 0) {
        x = Math.floor((Math.random() * 10) + 0);
        temp = RandomNumbers.indexOf(x);
    }
    RandomNumbers.push(x);
    EmptyTemp = 0;
    return x;
}

function getContent(QIDcurr) {
    var RandomIndex = generateRandomIndex();

    var StoreRandom = [];
    for (var i = 0; i < 3; i++) {

        var x = Math.floor((Math.random() * 3) + 1);
        var temp = StoreRandom.indexOf(x);
        while (temp !==-1) 
        {
            x = Math.floor((Math.random() * 3) + 1);
            temp = StoreRandom.indexOf(x);
        }
        StoreRandom.push(x);
    }

    document.getElementById(QIDcurr).innerHTML = qsjson[RandomIndex].ques;
    document.getElementById(QIDcurr.concat((StoreRandom[0]).toString())).innerHTML = qsjson[RandomIndex].choice1;
    document.getElementById(QIDcurr.concat((StoreRandom[1]).toString())).innerHTML = qsjson[RandomIndex].choice2;
    document.getElementById(QIDcurr.concat((StoreRandom[2]).toString())).innerHTML = qsjson[RandomIndex].choice3;
}

function GenQs() {
    var QID = "QS";
    for (var i = 0; i < TotsPresent; i++) {
        var QIDcurr = QID.concat((i + 1).toString());
        getContent(QIDcurr);
    }
   return;
}

function checkAnswer(AnsId, JsonId, QId) {
    var userAns = -1;
    if (document.getElementById(AnsId.concat("1")).checked) {
        userAns = 1;
        if (document.getElementById(QId.concat("1")).innerHTML == qsjson[JsonId].answer) {
            CorrectCount = CorrectCount + 1;
        }
    }
    if (document.getElementById(AnsId.concat("2")).checked) {
        userAns = 2;
        if (document.getElementById(QId.concat("2")).innerHTML == qsjson[JsonId].answer) {
            CorrectCount = CorrectCount + 1;
        }
    }
    if (document.getElementById(AnsId.concat("3")).checked) {
        userAns = 3;
        if (document.getElementById(QId.concat("3")).innerHTML == qsjson[JsonId].answer) {
            CorrectCount = CorrectCount + 1;
        }
    }
    return userAns;
}
function submitAnswers() {
    var AnsID = "A";
    var QID = "QS";
    for (var i = 0; i < TotsPresent; i++) {
        var TempAnsID = AnsID.concat((i + 1).toString());
        var JsonId = RandomNumbers[i]; 
        var QIDcurr = QID.concat((i + 1).toString());
        var userAns = checkAnswer(TempAnsID, JsonId, QIDcurr);
        AnsweredStack.push(userAns);
    }
}


function startTimer(duration, display) {
    var start = Date.now(),
        diff,
        minutes,
        seconds;
    function timer() {
        diff = duration - (((Date.now() - start) / 1000) | 0);
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds; 

        if (diff <= 0) {
            start = Date.now() + 1000;
        }
    };
    timer();
    setInterval(timer, 1000);
}

window.onload = function () {
    var threeMinutes = 60 * 3.5,
        display = document.querySelector('#time');
    startTimer(threeMinutes, display);
};