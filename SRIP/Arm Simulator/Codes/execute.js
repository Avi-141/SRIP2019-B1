var gpr;
var ip;
var sp;
var pc;
var zero;
var carry;
var fault;
/*gpr=general purpose registor,ip=instruction pointer,
pc=prog counter,sp=stack pointer and other are flags*/

function reset() {
    gpr = [0, 0, 0, 0];
    self.maxSP;
    ip = 0;
    zero = false;
    carry = false;
    fault = false;
    sp = 269484032;
    pc = 67108864;
}

/*build the step function as
increment the pc and check with prog_Add_lenth
var and then with counter variable of for loop, 
call particular ids one by one and start focusing
if loop detected then play game with pc also
create two fucntion processResult() and detectLoop(intial pc,final pc)*/

//some value here; intialize it to simulate the load address command

var AddressForData;
var VariablesValue = [];
var VariablesType = [];
var VariablesName = [];
var CountVariables = 0;
var ProgramInitialAddr = 67108864;
var DataSegIndex = -1;
var TextSegIndex = -1;
var program;
var ProgLines;
var ProgramAddrLengthCount = 0;
var TextSegmentCode = [];
var StepCounter = 0;
var status = 0;
var PreviousId = "";


function initExecute() {
    if (status == 0) {
        reset();
        program = names[LastButtonId].text;
        ProgLines = program.split("\n");

        //trimming and finding index of data and text segment
        for (var i = 0; i < ProgLines.length; i++) {
            ProgLines[i] = ProgLines[i].trim(); //remove whitespace from start and end
            var TempSeg = ProgLines[i].indexOf(".data");
            var TempText = ProgLines[i].indexOf(".text");
            if (TempSeg !== -1) {
                DataSegIndex = i;
            }
            if (TempText !== -1) {
                TextSegIndex = i;
            }
        }
        //alert("At max total number of variables-:" + (TextSegIndex-DataSegIndex));
        //now processing the variables
        for (var i = DataSegIndex + 1; i < TextSegIndex; i++) {

            var TempName;
            var TempType;
            var TempValue;

            var TempVarNameIndex = ProgLines[i].indexOf(":");
            if (TempVarNameIndex !== -1) {
                TempName = ProgLines[i].slice(0, TempVarNameIndex);
                var TempVarTypeIndexStart = ProgLines[i].indexOf(".");
                var TempStr = ProgLines[i].slice(TempVarTypeIndexStart);
                var TempVarTypeIndexEnd = TempStr.indexOf(" ");
                TempType = TempStr.slice(1, TempVarTypeIndexEnd);
                TempValue = TempStr.slice(TempVarTypeIndexEnd + 1);
                if (TempValue[0] === '"') {
                    TempValue = TempValue.slice(1, TempValue.length - 2);
                }
            }
            VariablesName.push(TempName);
            VariablesType.push(TempType);
            VariablesValue.push(TempValue);
            CountVariables++;
        }

        setTheIntialArea();
    }
    status = 1;
}
function setTheIntialArea() {
    var node = document.getElementById("text_table");

    for (var i = TextSegIndex + 1; i < ProgLines.length; i++) {
        var TempStr = ProgLines[i];
        if (TempStr !== "" && TempStr.indexOf(":") === -1) {
            var CommentIndex = TempStr.indexOf("#");
            if (CommentIndex !== -1) {
                TempStr = TempStr.slice(0, CommentIndex);
            }
            TextSegmentCode.push(TempStr);
            var cbox = document.createElement("INPUT");
            cbox.setAttribute("type", "checkbox");

            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');
            td1.id = ("bkpt").concat(ProgramAddrLengthCount.toString());
            td2.innerHTML = ProgramInitialAddr + ProgramAddrLengthCount;
            td2.id = ("addr").concat(ProgramAddrLengthCount.toString());
            td3.innerHTML = TempStr;
            td3.id = ("code").concat(ProgramAddrLengthCount.toString());

            var tr = document.createElement('tr');
            tr.id = ("tr").concat(ProgramAddrLengthCount.toString());
            td1.appendChild(cbox);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            node.appendChild(tr);
            ProgramAddrLengthCount++;
        }
    }
    var SpNode = document.getElementById("sp");
    var PcNode = document.getElementById("pc");
    SpNode.innerHTML = sp;
    PcNode.innerHTML = pc;
    pc += ProgramAddrLengthCount;
    status = 1;
    PreviousId = "";
}


function stepUtil() {
    var path = window.location.pathname;
    var page = path.split("/").pop();
    if (page == "execute.html") {
        var RetStatus = 0;
        if (StepCounter < ProgramAddrLengthCount && status == 1) {
            if (StepCounter > 0) {
                document.getElementById(("code").concat((StepCounter - 1).toString())).parentElement.style = "background-color:white";
            }
            var TempNode = document.getElementById(("code").concat(StepCounter.toString()));
            status = processResult(TempNode.innerHTML, StepCounter);

            TempNode.parentElement.style = "background-color:grey;";
            StepCounter++;
            var PcNode = document.getElementById("pc");
            PcNode.innerHTML = pc;
            PcNode.parentElement.style = "background-color:grey";
            pc += 4;
            RetStatus = 1;
        }
        else {
            var TextNode = document.getElementById("parsertext");
            if (status === 1) {
                TextNode.innerHTML = "Program Completed Successful";
                TextNode.style = "color:green;width: 100%;height:95%;";
                document.getElementById(("code").concat((StepCounter - 1).toString())).parentElement.style = "background-color:white";
            }
            else {
                TextNode.innerHTML = "Invalid Instruction";
                TextNode.style = "color:red;width: 100%;height:95%;";

            }
            RetStatus = 0;
        }
        return RetStatus;

    }
    else{
        alert("Works in Exxecute tab");
    }

}
function processResult(ProcessingCode, index) {
    var status = 1;
    if (TextSegmentCode[index] === ProcessingCode) {
        var TempIndex = ProcessingCode.indexOf(" ");
        var TempOpcode = ProcessingCode.slice(0, TempIndex);
        if (PreviousId !== "") {
            document.getElementById(PreviousId).parentElement.style = "background-color:white";
        }
        switch (TempOpcode) {
            case "li":
                var newstr = ProcessingCode.split(",");
                var reg = newstr[0].slice(TempIndex + 1);
                var value = newstr[1].slice(1);
                var NodeReg = document.getElementById(reg);
                NodeReg.innerHTML = value;
                NodeReg.parentElement.style = "background-color:grey";
                PreviousId = reg;
                break;
            case "mov":
                //alert("Move ins (R->R)");
                var newstr = ProcessingCode.split(",");
                var reg1 = newstr[0].slice(TempIndex + 1);

                var IndexTemp = newstr[1].indexOf("$");
                var reg2 = newstr[1].slice(IndexTemp, IndexTemp + 3);

                var NodeReg1 = document.getElementById(reg1);
                var NodeReg2 = document.getElementById(reg2);
                NodeReg1.innerHTML = NodeReg2.innerHTML;
                NodeReg1.parentElement.style = "background-color:grey";
                PreviousId = reg1;
                break;
            case "add":
                //alert("Add ins  (R->R)");
                var newstr = ProcessingCode.split(",");
                var reg1 = newstr[0].slice(TempIndex + 1);

                var IndexTemp = newstr[1].indexOf("$");
                var reg2 = newstr[1].slice(IndexTemp, IndexTemp + 3);

                var IndexTemp = newstr[2].indexOf("$");
                var reg3 = newstr[2].slice(IndexTemp, IndexTemp + 3);

                var NodeReg1 = document.getElementById(reg1);
                var NodeReg2 = document.getElementById(reg2);
                var NodeReg3 = document.getElementById(reg3);
                //reg1=reg2+reg3
                NodeReg1.innerHTML = parseInt((NodeReg2.innerHTML), 10) + parseInt((NodeReg3.innerHTML), 10);
                NodeReg1.parentElement.style = "background-color:grey";
                PreviousId = reg1;
                break;
            case "sub":
                // alert("Sub ins  (R->R)");
                var newstr = ProcessingCode.split(",");
                var reg1 = newstr[0].slice(TempIndex + 1);

                var IndexTemp = newstr[1].indexOf("$");
                var reg2 = newstr[1].slice(IndexTemp, IndexTemp + 3);

                var IndexTemp = newstr[2].indexOf("$");
                var reg3 = newstr[2].slice(IndexTemp, IndexTemp + 3);

                var NodeReg1 = document.getElementById(reg1);
                var NodeReg2 = document.getElementById(reg2);
                var NodeReg3 = document.getElementById(reg3);
                //reg1=reg2-reg3
                NodeReg1.innerHTML = parseInt((NodeReg2.innerHTML), 10) - parseInt((NodeReg3.innerHTML), 10);
                NodeReg1.parentElement.style = "background-color:grey";
                PreviousId = reg1;
                break;
            case "mult":
                // alert("Mult ins  (R->R)");
                var newstr = ProcessingCode.split(",");
                var reg1 = newstr[0].slice(TempIndex + 1);

                var IndexTemp = newstr[1].indexOf("$");
                var reg2 = newstr[1].slice(IndexTemp, IndexTemp + 3);

                var value = newstr[2].slice(1);
                var NodeReg1 = document.getElementById(reg1);
                var NodeReg2 = document.getElementById(reg2);
                //reg1=reg2*value
                NodeReg1.innerHTML = parseInt((NodeReg2.innerHTML), 10) * parseInt((value), 10);
                NodeReg1.parentElement.style = "background-color:grey";
                PreviousId = reg1;
                break;
            case "div":
                //alert("Div ins  (R->R)");
                var newstr = ProcessingCode.split(",");
                var reg1 = newstr[0].slice(TempIndex + 1);

                var IndexTemp = newstr[1].indexOf("$");
                var reg2 = newstr[1].slice(IndexTemp, IndexTemp + 3);

                var IndexTemp = newstr[2].indexOf("$");
                var reg3 = newstr[2].slice(IndexTemp, IndexTemp + 3);

                var NodeReg1 = document.getElementById(reg1);
                var NodeReg2 = document.getElementById(reg2);
                var NodeReg3 = document.getElementById(reg3);
                //reg1=reg2/reg3
                NodeReg1.innerHTML = parseInt((NodeReg2.innerHTML), 10) / parseInt((NodeReg3.innerHTML), 10);
                NodeReg1.parentElement.style = "background-color:royalblue";
                PreviousId = reg1;
                break;
            default:
                status = 0;
                break;
        }
    }
    return status;
}
function clearParserText() {
    document.getElementById("parsertext").innerHTML = "";
}
function runExecute() {
    var path = window.location.pathname;
    var page = path.split("/").pop();
    if (page == "execute.html") {
        var status = 1;
        while (status == 1) {
            status = stepUtil();
        }
    }
    else{
        alert("Works in Exxecute tab");
    }
}