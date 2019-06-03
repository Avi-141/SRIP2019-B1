var AnsweredStack = [];
var RandomNumbers = [];
var ArrayEmpty = 1;
var CorrectCount = 0;
var TotsPresent = 0;


function genQuest(qsid, AID, status) {
    var ScrollpageDiv = document.getElementById("qbody");
    var prdiv = document.createElement("div");
    var forqs = document.createElement("div");
    var br = document.createElement("BR");
    forqs.id = qsid;    
    forqs.className = "question";
    prdiv.appendChild(forqs);
    prdiv.appendChild(br);

    for (var i = 0; i < 3; i++) {
        var choiceionDiv = document.createElement("div");
        choiceionDiv.className = "answer";

        var input = document.createElement("INPUT");
        input.setAttribute("type", "radio");
        input.id = AID.concat((i + 1).toString());    
        input.name = qsid;     

        var span = document.createElement("SPAN");
        span.id = qsid.concat((i + 1).toString());    

        choiceionDiv.appendChild(input);
        choiceionDiv.appendChild(span);
        prdiv.appendChild(choiceionDiv);
    }

    ScrollpageDiv.appendChild(prdiv);
    if (status !== 0 && status!==TotsPresent) {
        var br = document.createElement("BR");
        var hr = document.createElement("HR");
        ScrollpageDiv.insertBefore(br, prdiv);
        ScrollpageDiv.insertBefore(hr, prdiv);
    }

}
function ResWindowDispl(RID, status) {
    var ScrollpageDiv = document.getElementById("ShowRes");
    var prdiv = document.createElement("div");
    var forqs = document.createElement("div");
    var br = document.createElement("BR");
    forqs.id = RID;       //R1
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
    if (status !== 0 && status!==TotsPresent) {
        var br = document.createElement("BR");
        var hr = document.createElement("HR");
        ScrollpageDiv.insertBefore(br, prdiv);
        ScrollpageDiv.insertBefore(hr, prdiv);
    }
}
function putContainers() {
    TotsPresent = Math.floor((Math.random() * 4) + 3);
    var qsid = "Q";
    var AId = "A";
    var RId = "R";
    for (var i = 0; i < TotsPresent; i++) {
        var Qstring = qsid.concat((i + 1).toString());
        var Astring = AId.concat((i + 1).toString());
        var Rstring = RId.concat((i + 1).toString());
        genQuest(Qstring, Astring, i);
        ResWindowDispl(Rstring, i);
    }
}

function putResult() {
    var RID = "R";
    var qsid = "Q";
    for (var i = 0; i < TotsPresent; i++) {
        var qsidcurr = qsid.concat((i + 1).toString());    
        var TempRID = RID.concat((i + 1).toString());  
        var ID_ans = TempRID.concat("1");   
        var UserID_ans = TempRID.concat("2");    
        var ResultStatus = "Correct Answer : ";
        document.getElementById(TempRID).innerHTML = qsjson[RandomNumbers[i]].ques;
        document.getElementById(ID_ans).innerHTML = ResultStatus + qsjson[RandomNumbers[i]].answer;
        if (AnsweredStack[i] ==== -1) {
            document.getElementById(UserID_ans).innerHTML = "Question Not answered";
            document.getElementById(UserID_ans).style.color = "black";
        }
        else {
            var t1;
            var t2;
            if (AnsweredStack[i] ==== 1) {
                t1 = document.getElementById(qsidcurr.concat("1")).innerHTML;
                t2 = qsjson[RandomNumbers[i]].answer;
            }
            else if (AnsweredStack[i] ==== 2) {
                t1 = document.getElementById(qsidcurr.concat("2")).innerHTML;
                t2 = qsjson[RandomNumbers[i]].answer;
            }
            else if (AnsweredStack[i] ==== 3) {
                t1 = document.getElementById(qsidcurr.concat("3")).innerHTML;
                t2 = qsjson[RandomNumbers[i]].answer;
            }
            if (t1 !==== t2) {
                ResultStatus = "You chose Incorrect!"+":";
                //ResultStatus.style.color="red";
            document.getElementById(UserID_ans).style.color = "red";
            } else {
                ResultStatus = "You chose Correct, Expert! : ";
                document.getElementById(UserID_ans).style.color = "green";
            }
            document.getElementById(UserID_ans).innerHTML = ResultStatus + t1;
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
function putQuestion() {
    var qsid = "Q";
    for (var i = 0; i < TotsPresent; i++) {
        var qsidcurr = qsid.concat((i + 1).toString());
        getContent(qsidcurr);
    }
}

function newsetgen() {
    document.getElementById("Titles").innerHTML = "Quiz for Integer Arithmetic";
    document.getElementById("result").style.display = "none";
    document.getElementById("ShowRes").style.display = "none";
    document.getElementById("bts").style.visibility = "hidden";
    document.getElementById("btsb").style.display = "block";
    removeChildren();
    putContainers();
    putQuestion();
    document.getElementById("qbody").style.display = "block";
}
function submitAnswers() {
    var AID = "A";
    var qsid = "Q";
    for (var i = 0; i < TotsPresent; i++) {
        var TempAID = AID.concat((i + 1).toString());
        var JsonId = RandomNumbers[i];  
        var qsidcurr = qsid.concat((i + 1).toString());
        var userAns = checkAnswer(TempAID, JsonId, qsidcurr);
        AnsweredStack.push(userAns);
    }
}


function endgame(){
    document.getElementById("btsb").style.display = "none";
    document.getElementById("bts").style.visibility = "visible";
    submitAnswers();
    document.getElementById("qbody").style.display = "none";
    document.getElementById("result").innerHTML = "You have score "+(CorrectCount).toString() + " out of " + TotsPresent;
    putResult();
    document.getElementById("Titles").innerHTML = "Your results are here!";
    // if(((CorrectCount).toString())====TotsPresent)
      //  alert("All correct, Good JOB");
    document.getElementById("result").style.display = "block";
    document.getElementById("ShowRes").style.display = "block";
    CorrectCount = 0;
    ArrayEmpty = 1;
    AnsweredStack = [];
    RandomNumbers = [];
}

function generateRandomIndex() {
    var x = Math.floor((Math.random() * 10) + 0);
    var temp = RandomNumbers.indexOf(x);
    while (temp !== -1 && ArrayEmpty ==== 0) {
        x = Math.floor((Math.random() * 10) + 0);
        temp = RandomNumbers.indexOf(x);
    }
    RandomNumbers.push(x);
    ArrayEmpty = 0;
    return x;
}

function getContent(qsidcurr) {
    var RandomIndex = generateRandomIndex();

    var StoreRandom = [];
    for (var i = 0; i < 3; i++) {

        var x = Math.floor((Math.random() * 3) + 1);
        var temp = StoreRandom.indexOf(x);
        while (temp !== -1) 
        {
            x = Math.floor((Math.random() * 3) + 1);
            temp = StoreRandom.indexOf(x);
        }
        StoreRandom.push(x);
    }

    document.getElementById(qsidcurr).innerHTML = qsjson[RandomIndex].ques;
    document.getElementById(qsidcurr.concat((StoreRandom[0]).toString())).innerHTML = qsjson[RandomIndex].choice1;
    document.getElementById(qsidcurr.concat((StoreRandom[1]).toString())).innerHTML = qsjson[RandomIndex].choice2;
    document.getElementById(qsidcurr.concat((StoreRandom[2]).toString())).innerHTML = qsjson[RandomIndex].choice3;
}

/*function putQuestion() {
    var qsid = "Q";
    for (var i = 0; i < TotsPresent; i++) {
        var qsidcurr = qsid.concat((i + 1).toString());
        getContent(qsidcurr);
    }
}*/

function checkAnswer(ID_ans, JsonId, qsid) {
    var userAns = -1;
    if (document.getElementById(ID_ans.concat("1")).checked) {
        userAns = 1;
        if (document.getElementById(qsid.concat("1")).innerHTML === qsjson[JsonId].answer) {
            CorrectCount = CorrectCount + 1;
        }
    }
    if (document.getElementById(ID_ans.concat("2")).checked) {
        userAns = 2;
        if (document.getElementById(qsid.concat("2")).innerHTML === qsjson[JsonId].answer) {
            CorrectCount = CorrectCount + 1;
        }
    }
    if (document.getElementById(ID_ans.concat("3")).checked) {
        userAns = 3;
        if (document.getElementById(qsid.concat("3")).innerHTML === qsjson[JsonId].answer) {
            CorrectCount = CorrectCount + 1;
        }
    }
    return userAns;
}
var showpercent;

/*function submitAnswers() {
    var AID = "A";
    var qsid = "Q";
    for (var i = 0; i < TotsPresent; i++) {
        var TempAID = AID.concat((i + 1).toString());
        var JsonId = RandomNumbers[i];  
        var qsidcurr = qsid.concat((i + 1).toString());
        var userAns = checkAnswer(TempAID, JsonId, qsidcurr);
        AnsweredStack.push(userAns);
    }
}*/
