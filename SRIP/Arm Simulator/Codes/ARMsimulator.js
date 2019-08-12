/*java -jar ArmSimulator.jar*/
/*Run the original simulation using the above command*/
var names = [];
var count = 1;
var LastButtonId = -1;
var UserFileCounter = 0;
var UserFileIndex = -101;
var codes = [];
var CopyTextBuffer = "Nothing has been copied" +" "+"Go to sample codes and use the copy button below to copy the sample codes to the editor";

function assemblerlistner() {
	var path = window.location.pathname;
	var page = path.split("/").pop();
	if (page == "execute.html") {
		document.getElementById("Run_run").setAttribute("style", "cursor: pointer; opacity: 1;");
		document.getElementById("Run_step").setAttribute("style", "cursor: pointer; opacity: 1;");
		document.getElementById("Run_reset").setAttribute("style", "cursor: pointer; opacity: 1;");
		document.getElementById("Run_clearBreakPoints").setAttribute("style", "cursor: pointer; opacity: 1;");
		document.getElementById("Run_toggleBreakPoints").setAttribute("style", "cursor: pointer; opacity: 1;");
		document.getElementById("execute_step").setAttribute("style", "cursor: pointer; opacity: 1;");
		document.getElementById("execute_run").setAttribute("style", "cursor: pointer; opacity: 1;");
		document.getElementById("data_table").setAttribute("style", "visibility:visible;width:100%; background-color: white;");
		document.getElementById("text_table").setAttribute("style", "visibility:visible;width:100%; background-color: white;");

		initExecute();
	}
	else {
		alert("Select the execute tabe to assemble!");
	}

}

function fileonload(status) {
	LastButtonId = parseInt((sessionStorage.getItem("-500")), 10);
	var steps = parseInt((sessionStorage.getItem("-1")), 10);
	var UserFiles = parseInt((sessionStorage.getItem("-100")), 10);
	if (UserFiles >= 0) {
		UserFileCounter = UserFiles;
	}
	if (sessionStorage.getItem("-2") === "1") {
		CopyTextBuffer = "@Adding two numbers\n\n\t.arm\t\t\n\t.data\n\tsum: \t.word \n\tnum1:\t.word 0x0000aaaa\n\tnum2:\t.word 0x0000bbbb\n\n\t.text\n\t.global main     @ \'main\' function is mandatory.\n\n\tmain:\n\tldr r1, =num1\n\tldr r2, =num2\n       \tldr r3, [r1] \n        \tldr r4, [r2] \n\tadd r5, r3, r4\n\tldr r6, =sum\n \tstr r5, [r6]\t\n";
	}
	else if (sessionStorage.getItem("-2") === "2") {
		CopyTextBuffer = "@Adding elemnts of an array\n\n\t.arm\n\n\t.data\n\tnumarray:\t.word 10, 9, 8, 3, 2, 1, 4, 5, 6, 7  \n\tsum:\t\t.word \n\n\t.text\n\t.global main     @ \'main\' function is mandatory.\n\n\tmain:\n        \tmov r0, #10        \t@ Set loop counter to 0\n\tmov r1, #0         \t@ Set initial sum value to 0;  \n\tldr r2, =numarray  \t@ r2 = &numarray\n\t.Lloop: \n\tldr r3, [r2], #4  \t@ r3 = *r2; r2=r2+4 \n        \tadd r1, r1, r3     \t@ sum = sum + numarray[i]\n        \tsubs r0, r0, #1    \t@ Decrement loop counter\n        \tbne .Lloop         \t@ Branch back if the loop counter i!=0 \n\tldr r0, =sum       \t@ r0 = &sum; Reuse register r0\n        \tstr r1, [r0]       \t@ *r0 = r1 (sum = r1) \n";
	}
	else if (sessionStorage.getItem("-2") === "3") {
		CopyTextBuffer = "@Square sum using Subroutine\n\n\t.arm\t\t\t\n\t.data\n\t\n\tarraysize:\t.word 10\n\tarray:\t\t.word 1, -2, 3, -4, 5, -6, 8, -7, 9, -10\n\tsqrsum:\t.word\n\t\n\tinputparameter:\t.word \t0\t@ Memory for square function parameter\n\tretval:\t.word \t\t0\t@ Memory for return value\n\tsaveReight: .word\t0\t@ Save the registers here before we destroy their contents.\n\tsaveRnine: .word\t0\t@ Restore their contents later.\n\tsaveRten: .word\t\t0\n\n\t.text\n\t.global main     @ \'main\' function is mandatory.\n\n\t@ r0 = arraysize; r1 = &array; r3 = sum; r2 = array[i], r4 = &inputparameter\n\t@ r5 = &retval, r6 = retval\n\n\tmain:\n\tldr r0, =arraysize     @ r0 = &arraysize\n        \tldr r0, [r0]           @ r0 = *r0. We are immediately reusing r0.\n        \tldr r1, =array\n        \tmov r3, #0\n\tcmp r0, #0\n\tbeq .Lexit\n\t.Lloop: ldr r2, [r1], #4\t\t@ r2 = array[i]\n\tldr r4, =inputparameter\t\t@ Pass array[i] as parameter\n\tstr r2, [r4]\n\tbl square\t\t\t@ Call Square. Important: We assume square doesn\'t\n\t\t\t\t\t@ change any register values.\n\tldr r5, =retval\n\tldr r6, [r5]\t\t\t@ Read the return value\n\tadd r3, r3, r6\n        \tsubs r0, r0, #1\n\tbne .Lloop\n\tldr r6, =sqrsum        @ r6 = &sqrsum\n \tstr r3, [r6]           @ *r6 = r3\t\n\tb .Lexit\n\tsquare:\n\tldr r12, =saveReight\t\t@ Save the r8 contents in data segment\n\tstr r8, [r12]\n\tldr r12, =saveRnine\t\t@ Save the r9 contents in data segment\n\tstr r9, [r12]\n\tldr r12, =saveRten\t\t@ Save the r10 contents in data segment\n\tstr r10, [r12]\n\tldr r9, =inputparameter\n\tldr r8, [r9]\n \tmul r10, r8, r8\n\tldr r9, =retval\n\tstr r10, [r9] \n\tldr r12, =saveReight\t\t@ Restore the r8 contents in data segment\n\tldr r8, [r12]\n\tldr r12, =saveRnine\t\t@ Restore the r9 contents in data segment\n\tldr r9, [r12]\n\tldr r12, =saveRten\t\t@ Restore the r10 contents in data segment\n\tldr r10, [r12]\n\tmov pc, lr\n\n\t.Lexit:";
	}
	else if (sessionStorage.getItem("-2") === "4")
	 {
	 	CopyTextBuffer = "@Forward branch\n\n\t.text \n\t.global main\n\tmain:\n\tmov r3, #10\n\tmov r4, #11\n\tcmp r3, r4\n\tble .Lif\n\tsub r0, r1, r2\n\tb .Lexit\n\t.Lif:  \tadd r0, r1, r2\n\t.Lexit:\n";
	}
	else if (sessionStorage.getItem("-2") === "5") 
	{
		CopyTextBuffer = "@Square sum\n\n\t.arm\n\t.data\n\tarraysize:\t.word 10\n\tarray:\t\t.word 1, -2, 3, -4, 5, -6, 8, -7, 9, -10\n\tsqrsum:\t.word 0\n\n\t.text\n\t.global main     @ \'main\' function is mandatory.\n\n\t@ r0 = arraysize; r1 = &array; r3 = sum; r2 = array[i]\n\t@ Other Registers Used: r6, r7\n\n\tmain:\n\tldr r0, =arraysize     @ r0 = &arraysize\n        \tldr r0, [r0]           @ r0 = arraysize. We are immediately reusing r0. \n       \tldr r1, =array\t       @ r1 = &array\n       \tmov r3, #0\t       @ r3 = 0 (sum = 0)\n\tcmp r0, #0    \t       @ if (r0 == 0) goto exit; \n\tbeq .Lexit\t       \n\n\t@ We are using r0 as a loop index variable\n\n\t.Lloop: ldr r2, [r1], #4\t\n\tmla r3, r2, r2, r3     \t@ r3 = r2*r2+r3 (sum = sum + array[i]*array[i])\n        \tsubs r0, r0, #1\t\n        \tbne .Lloop\n\tldr r6, =sqrsum        @ r6 = &sqrsum\n \tstr r3, [r6]           @ *r6 = r3\t\n\t.Lexit:";
	}
	var i = 0;
	var UserEntry = -101;
	while (steps >= 1) {
		var text = sessionStorage.getItem((i).toString());
		var temp = parseInt((sessionStorage.getItem((UserEntry).toString())), 10);
		if ((UserFiles >= 1) && (i === temp)) {
			UserEntry = UserEntry - 1;

			var nam = sessionStorage.getItem((UserEntry).toString());
			UserEntry = UserEntry - 1;
			if (status === 1) {
				myfunctionlist(text, nam);
			}
			else {
				init(text);
			}
			UserFileIndex = UserEntry;
			UserFiles = UserFiles - 1;
		}
		else {
			if (text === undefined | text === null) {

				if (status === 1) {
					myfunctionlist("", "");
				}
				else {
					names = init("");
				}
			}
			else {
				if (status === 1) {
					myfunctionlist(text, '');
				}
				else {
					names = init(text);
				}
			}

		}
		steps = steps - 1;
		i = i + 1;
	}
}

function Constructer(name) {
	this.name = name;
	this.text = "Add your code here!";
	this.StackUndoRedo = [];
	this.UndoRedoCounter = -1;
	this.StackTop = -1;
}

function init(TextNode) {
	var str = "mips";
	var app = count.toString();
	str = str.concat(app);
	str = str.concat(".asm");
	count = count + 1;
	var name1 = new Constructer(str);
	if (TextNode !== "") {
		name1.text = TextNode;
	}
	name1.StackUndoRedo.push(name1.text);
	name1.StackTop = name1.StackTop + 1;
	name1.UndoRedoCounter = name1.UndoRedoCounter + 1;
	names.push(name1);
	sessionStorage.setItem("-1", (count - 1).toString());
	return names;
}
function myfunctionlist(TextNode, BtnName) {
	if (count < 10) {
		names = init(TextNode);
		var btn = document.createElement("BUTTON");
		if (BtnName !== "") {
			btn.innerHTML = BtnName;
			names[count - 2].name = BtnName;
		}
		else {
			btn.innerHTML = names[count - 2].name;
		}

		btn.id = (count - 2).toString();
		btn.addEventListener("click", function () { clicklistner(btn.id); });
		document.getElementById("mydiv").appendChild(btn);
	}
	else {
		alert('File capacity Full');
	}
}
function clicklistner(y) {
	var x = parseInt((y), 10);
	var node = document.getElementById("mytext");
	LastButtonId = x;
	node.value = names[x].text;
	sessionStorage.setItem((x).toString(), names[x].text);
	sessionStorage.setItem("-500", LastButtonId);
}

function textareachanged(status) {
	var node = document.getElementById("mytext");
	names[LastButtonId].text = node.value;
	sessionStorage.setItem((LastButtonId).toString(), names[LastButtonId].text);
	if (status !== 0) {
		update_stack(node, LastButtonId);
	}
}
// //******************************************************************************************************
function about_popup() {
	var cls = document.getElementsByClassName("close")[0];
	var cls2 = document.getElementsByClassName("close_btn")[0];
	cls.addEventListener("click", function () { close_popup(); });
	cls2.addEventListener("click", function () { close_popup(); });
	var mymodl = document.getElementById("my-modal");
	mymodl.setAttribute("style", "display:block;");
}
function close_popup() {
	var mymodl = document.getElementById("my-modal");
	mymodl.setAttribute("style", "display:none;");
}

function Code() {
	this.text = "";
}
function init_codes() {
	var code1 = new Code();
	var code2 = new Code();
	var code3 = new Code();
	var code4=  new Code();
	var code5=  new Code();
	code1.text = "@Adding two numbers\n\n\t.arm\t\t\n\t.data\n\tsum: \t.word \n\tnum1:\t.word 0x0000aaaa\n\tnum2:\t.word 0x0000bbbb\n\n\t.text\n\t.global main     @ \'main\' function is mandatory.\n\n\tmain:\n\tldr r1, =num1\n\tldr r2, =num2\n       \tldr r3, [r1] \n        \tldr r4, [r2] \n\tadd r5, r3, r4\n\tldr r6, =sum\n \tstr r5, [r6]\t\n";
	code2.text = "@Adding elements of an array\n\n\t.arm\n\n\t.data\n\tnumarray:\t.word 10, 9, 8, 3, 2, 1, 4, 5, 6, 7  \n\tsum:\t\t.word \n\n\t.text\n\t.global main     @ \'main\' function is mandatory.\n\n\tmain:\n        \tmov r0, #10        \t@ Set loop counter to 0\n\tmov r1, #0         \t@ Set initial sum value to 0;  \n\tldr r2, =numarray  \t@ r2 = &numarray\n\t.Lloop: \n\tldr r3, [r2], #4  \t@ r3 = *r2; r2=r2+4 \n        \tadd r1, r1, r3     \t@ sum = sum + numarray[i]\n        \tsubs r0, r0, #1    \t@ Decrement loop counter\n        \tbne .Lloop         \t@ Branch back if the loop counter i!=0 \n\tldr r0, =sum       \t@ r0 = &sum; Reuse register r0\n        \tstr r1, [r0]       \t@ *r0 = r1 (sum = r1) \n";
	code3.text = "@Square sum using Subroutine\n\n\t.arm\t\t\t\n\t.data\n\t\n\tarraysize:\t.word 10\n\tarray:\t\t.word 1, -2, 3, -4, 5, -6, 8, -7, 9, -10\n\tsqrsum:\t.word\n\t\n\tinputparameter:\t.word \t0\t@ Memory for square function parameter\n\tretval:\t.word \t\t0\t@ Memory for return value\n\tsaveReight: .word\t0\t@ Save the registers here before we destroy their contents.\n\tsaveRnine: .word\t0\t@ Restore their contents later.\n\tsaveRten: .word\t\t0\n\n\t.text\n\t.global main     @ \'main\' function is mandatory.\n\n\t@ r0 = arraysize; r1 = &array; r3 = sum; r2 = array[i], r4 = &inputparameter\n\t@ r5 = &retval, r6 = retval\n\n\tmain:\n\tldr r0, =arraysize     @ r0 = &arraysize\n        \tldr r0, [r0]           @ r0 = *r0. We are immediately reusing r0.\n        \tldr r1, =array\n        \tmov r3, #0\n\tcmp r0, #0\n\tbeq .Lexit\n\t.Lloop: ldr r2, [r1], #4\t\t@ r2 = array[i]\n\tldr r4, =inputparameter\t\t@ Pass array[i] as parameter\n\tstr r2, [r4]\n\tbl square\t\t\t@ Call Square. Important: We assume square doesn\'t\n\t\t\t\t\t@ change any register values.\n\tldr r5, =retval\n\tldr r6, [r5]\t\t\t@ Read the return value\n\tadd r3, r3, r6\n        \tsubs r0, r0, #1\n\tbne .Lloop\n\tldr r6, =sqrsum        @ r6 = &sqrsum\n \tstr r3, [r6]           @ *r6 = r3\t\n\tb .Lexit\n\tsquare:\n\tldr r12, =saveReight\t\t@ Save the r8 contents in data segment\n\tstr r8, [r12]\n\tldr r12, =saveRnine\t\t@ Save the r9 contents in data segment\n\tstr r9, [r12]\n\tldr r12, =saveRten\t\t@ Save the r10 contents in data segment\n\tstr r10, [r12]\n\tldr r9, =inputparameter\n\tldr r8, [r9]\n \tmul r10, r8, r8\n\tldr r9, =retval\n\tstr r10, [r9] \n\tldr r12, =saveReight\t\t@ Restore the r8 contents in data segment\n\tldr r8, [r12]\n\tldr r12, =saveRnine\t\t@ Restore the r9 contents in data segment\n\tldr r9, [r12]\n\tldr r12, =saveRten\t\t@ Restore the r10 contents in data segment\n\tldr r10, [r12]\n\tmov pc, lr\n\n\t.Lexit:";
	code4.text = "@Forward branch\n\n\t.text \n\t.global main\n\tmain:\n\tmov r3, #10\n\tmov r4, #11\n\tcmp r3, r4\n\tble .Lif\n\tsub r0, r1, r2\n\tb .Lexit\n\t.Lif:  \tadd r0, r1, r2\n\t.Lexit:\n";
	code5.text="@Square sum\n\n\t.arm\n\t.data\n\tarraysize:\t.word 10\n\tarray:\t\t.word 1, -2, 3, -4, 5, -6, 8, -7, 9, -10\n\tsqrsum:\t.word 0\n\n\t.text\n\t.global main     @ \'main\' function is mandatory.\n\n\t@ r0 = arraysize; r1 = &array; r3 = sum; r2 = array[i]\n\t@ Other Registers Used: r6, r7\n\n\tmain:\n\tldr r0, =arraysize     @ r0 = &arraysize\n        \tldr r0, [r0]           @ r0 = arraysize. We are immediately reusing r0. \n       \tldr r1, =array\t       @ r1 = &array\n       \tmov r3, #0\t       @ r3 = 0 (sum = 0)\n\tcmp r0, #0    \t       @ if (r0 == 0) goto exit; \n\tbeq .Lexit\t       \n\n\t@ We are using r0 as a loop index variable\n\n\t.Lloop: ldr r2, [r1], #4\t\n\tmla r3, r2, r2, r3     \t@ r3 = r2*r2+r3 (sum = sum + array[i]*array[i])\n        \tsubs r0, r0, #1\t\n        \tbne .Lloop\n\tldr r6, =sqrsum        @ r6 = &sqrsum\n \tstr r3, [r6]           @ *r6 = r3\t\n\t.Lexit:";
	codes.push(code1);
	codes.push(code2);
	codes.push(code3);
	codes.push(code4);
	codes.push(code5);
	return codes;
}
function codes_show(x) {
	codes = init_codes();
	var node = document.getElementById("code_mytext");
	node.value = codes[x - 1].text;
}


function copy_code() {
	var node = document.getElementById("code_mytext");
	node.select();
	CopyTextBuffer = node.value;
	if (CopyTextBuffer === "@Adding two numbers\n\n\t.arm\t\t\n\t.data\n\tsum: \t.word \n\tnum1:\t.word 0x0000aaaa\n\tnum2:\t.word 0x0000bbbb\n\n\t.text\n\t.global main     @ \'main\' function is mandatory.\n\n\tmain:\n\tldr r1, =num1\n\tldr r2, =num2\n       \tldr r3, [r1] \n        \tldr r4, [r2] \n\tadd r5, r3, r4\n\tldr r6, =sum\n \tstr r5, [r6]\t\n")
	{
		sessionStorage.setItem("-2", "1");
	}
	else if (CopyTextBuffer === "@Adding elemnts of an array\n\n\t.arm\n\n\t.data\n\tnumarray:\t.word 10, 9, 8, 3, 2, 1, 4, 5, 6, 7  \n\tsum:\t\t.word \n\n\t.text\n\t.global main     @ \'main\' function is mandatory.\n\n\tmain:\n        \tmov r0, #10        \t@ Set loop counter to 0\n\tmov r1, #0         \t@ Set initial sum value to 0;  \n\tldr r2, =numarray  \t@ r2 = &numarray\n\t.Lloop: \n\tldr r3, [r2], #4  \t@ r3 = *r2; r2=r2+4 \n        \tadd r1, r1, r3     \t@ sum = sum + numarray[i]\n        \tsubs r0, r0, #1    \t@ Decrement loop counter\n        \tbne .Lloop         \t@ Branch back if the loop counter i!=0 \n\tldr r0, =sum       \t@ r0 = &sum; Reuse register r0\n        \tstr r1, [r0]       \t@ *r0 = r1 (sum = r1) \n") 
	{
		sessionStorage.setItem("-2", "2");
	}
	else if (CopyTextBuffer === "@Square sum using Subroutine\n\n\t.arm\t\t\t\n\t.data\n\t\n\tarraysize:\t.word 10\n\tarray:\t\t.word 1, -2, 3, -4, 5, -6, 8, -7, 9, -10\n\tsqrsum:\t.word\n\t\n\tinputparameter:\t.word \t0\t@ Memory for square function parameter\n\tretval:\t.word \t\t0\t@ Memory for return value\n\tsaveReight: .word\t0\t@ Save the registers here before we destroy their contents.\n\tsaveRnine: .word\t0\t@ Restore their contents later.\n\tsaveRten: .word\t\t0\n\n\t.text\n\t.global main     @ \'main\' function is mandatory.\n\n\t@ r0 = arraysize; r1 = &array; r3 = sum; r2 = array[i], r4 = &inputparameter\n\t@ r5 = &retval, r6 = retval\n\n\tmain:\n\tldr r0, =arraysize     @ r0 = &arraysize\n        \tldr r0, [r0]           @ r0 = *r0. We are immediately reusing r0.\n        \tldr r1, =array\n        \tmov r3, #0\n\tcmp r0, #0\n\tbeq .Lexit\n\t.Lloop: ldr r2, [r1], #4\t\t@ r2 = array[i]\n\tldr r4, =inputparameter\t\t@ Pass array[i] as parameter\n\tstr r2, [r4]\n\tbl square\t\t\t@ Call Square. Important: We assume square doesn\'t\n\t\t\t\t\t@ change any register values.\n\tldr r5, =retval\n\tldr r6, [r5]\t\t\t@ Read the return value\n\tadd r3, r3, r6\n        \tsubs r0, r0, #1\n\tbne .Lloop\n\tldr r6, =sqrsum        @ r6 = &sqrsum\n \tstr r3, [r6]           @ *r6 = r3\t\n\tb .Lexit\n\tsquare:\n\tldr r12, =saveReight\t\t@ Save the r8 contents in data segment\n\tstr r8, [r12]\n\tldr r12, =saveRnine\t\t@ Save the r9 contents in data segment\n\tstr r9, [r12]\n\tldr r12, =saveRten\t\t@ Save the r10 contents in data segment\n\tstr r10, [r12]\n\tldr r9, =inputparameter\n\tldr r8, [r9]\n \tmul r10, r8, r8\n\tldr r9, =retval\n\tstr r10, [r9] \n\tldr r12, =saveReight\t\t@ Restore the r8 contents in data segment\n\tldr r8, [r12]\n\tldr r12, =saveRnine\t\t@ Restore the r9 contents in data segment\n\tldr r9, [r12]\n\tldr r12, =saveRten\t\t@ Restore the r10 contents in data segment\n\tldr r10, [r12]\n\tmov pc, lr\n\n\t.Lexit:") 
	{
		sessionStorage.setItem("-2", "3");
	}
	else if (CopyTextBuffer === "@Forward branch\n\n\t.text \n\t.global main\n\tmain:\n\tmov r3, #10\n\tmov r4, #11\n\tcmp r3, r4\n\tble .Lif\n\tsub r0, r1, r2\n\tb .Lexit\n\t.Lif:  \tadd r0, r1, r2\n\t.Lexit:\n")
	{
		sessionStorage.setItem("-2", "4");
	}
	else if(CopyTextBuffer==="@Square sum\n\n\t.arm\n\t.data\n\tarraysize:\t.word 10\n\tarray:\t\t.word 1, -2, 3, -4, 5, -6, 8, -7, 9, -10\n\tsqrsum:\t.word 0\n\n\t.text\n\t.global main     @ \'main\' function is mandatory.\n\n\t@ r0 = arraysize; r1 = &array; r3 = sum; r2 = array[i]\n\t@ Other Registers Used: r6, r7\n\n\tmain:\n\tldr r0, =arraysize     @ r0 = &arraysize\n        \tldr r0, [r0]           @ r0 = arraysize. We are immediately reusing r0. \n       \tldr r1, =array\t       @ r1 = &array\n       \tmov r3, #0\t       @ r3 = 0 (sum = 0)\n\tcmp r0, #0    \t       @ if (r0 == 0) goto exit; \n\tbeq .Lexit\t       \n\n\t@ We are using r0 as a loop index variable\n\n\t.Lloop: ldr r2, [r1], #4\t\n\tmla r3, r2, r2, r3     \t@ r3 = r2*r2+r3 (sum = sum + array[i]*array[i])\n        \tsubs r0, r0, #1\t\n        \tbne .Lloop\n\tldr r6, =sqrsum        @ r6 = &sqrsum\n \tstr r3, [r6]           @ *r6 = r3\t\n\t.Lexit:")
	{
		sessionStorage.setItem("-2","5");
	}
	document.execCommand("copy");

}
function selectAll() {
	var node = document.getElementById("code_mytext");
	node.select();
	CopyTextBuffer = node.value;
}


function getSelectedText(el) {
	if (typeof el.selectionStart === "number") {
		alert("Invalid");
		return el.value.slice(el.selectionStart, el.selectionEnd);
	} else if (typeof document.selection !== "undefined") {
		var range = document.selection.createRange();
		if (range.parentElement() === el) {
			alert("Invalid");
			return range.text;
		}
	}
	return "";
}




function paste() {
	var el = document.getElementById("mytext");
	if (CopyTextBuffer === "") {
		alert("Select to copy and paste");
	}
	else {
		typeInTextarea(el, CopyTextBuffer);
		textareachanged(1);
	}

}
function typeInTextarea(el, newText) {
	var start = el.selectionStart;
	var end = el.selectionEnd;
	var text = el.value;
	var before = text.substring(0, start);
	var after = text.substring(end, text.length);
	el.value = (before + newText + after);
	el.selectionStart = el.selectionEnd = start + newText.length;
	el.focus();
}
function copy() {
	var el = document.getElementById("mytext");
	var temp_copy = getSelectedText(el);
	if (temp_copy === "") {
		alert("Nothing selected to copy");
	}
	else {
		CopyTextBuffer = temp_copy;
	}
}
function cut() {
	var el = document.getElementById("mytext");
	var temp_copy = getSelectedText(el);
	if (temp_copy === "") {
		alert("Nothing to cut");
	}
	else {
		CopyTextBuffer = temp_copy;
		removeOutTextarea(el);
	}
}
function removeOutTextarea(el) {
	var start = el.selectionStart;
	var end = el.selectionEnd;
	var text = el.value;
	var before = text.substring(0, start);
	var after = text.substring(end, text.length);
	el.value = (before + after);
	el.focus();
}
function save_function() {
	var node = document.getElementById("code_mytext");
	//console.log(node);
	var txt = node.value;
	//console.log(txt);
	//if(txt==null)
	//	console.log("fuck");
	var FileName = "file.txt";
	var blob = new Blob([txt], { type: "text/x-asm;charset=utf-8" });
	saveAs(blob, FileName);
}
function saveAs_function() {
	var node = document.getElementById("code_mytext");
	var txt = node.value;
	console.log(txt);
	var FileName = "ARM";
	var blob = new Blob([txt], { type: "text/x-asm;charset=utf-8" });
	saveAs(blob, FileName);
}
function close_fun() {
	if (LastButtonId !== -1) {
		var node = document.getElementById((LastButtonId).toString());
		var parent = node.parentNode;
		parent.removeChild(node);
		alert("Please refresh or reload page to restore the Closed file\n\t!");
	}
	else {
		alert("No file to close!");
	}

}
function closeAll_fun() {
	if (count !== 1) {
		var node = document.getElementById("mydiv");
		while (node.hasChildNodes()) {
			node.removeChild(node.firstChild);
		}
		alert("Please refresh or reload page to restore the Closed file\n\t!");
	}
	else {
		alert("No file to close!");
	}
}

/*function open_window() {
	var FileInp = document.getElementById("inp_file");
	if (FileInp) {
		FileInp.click();
	}
}*/
function dispFile(contents) {
  document.getElementById('contents').innerHTML=contents
}
function clickElem(elem) {
	// Thx user1601638 on Stack Overflow (6/6/2018 - https://stackoverflow.com/questions/13405129/javascript-create-and-save-file )
	var eventMouse = document.createEvent("MouseEvents")
	eventMouse.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
	elem.dispatchEvent(eventMouse)
}
function openFile(func) {
	readFile = function(e) {
		var file = e.target.files[0];
		if (!file) {
			return;
		}
		var reader = new FileReader();
		reader.onload = function(e) {
			var contents = e.target.result;
			fileInput.func(contents)
			document.body.removeChild(fileInput)
		}
		reader.readAsText(file)
	}
	fileInput = document.createElement("input")
	fileInput.type='file'
	fileInput.style.display='none'
	fileInput.onchange=readFile
	fileInput.func=func
	document.body.appendChild(fileInput)
	clickElem(fileInput)
}
function setinputfileintextarea() {
	var FileInp = document.getElementById("inp_file");
	var files = FileInp.files;
	var file = files.item(0);
	var reader = new FileReader();
	var contents;
	reader.onload = function (event) {
		contents = event.target.result;
		myfunctionlist(contents, file.name);
		UserFileCounter = UserFileCounter + 1;
		sessionStorage.setItem("-100", (UserFileCounter).toString());
		sessionStorage.setItem((UserFileIndex).toString(), (count - 2).toString());
		UserFileIndex--;
		sessionStorage.setItem((UserFileIndex).toString(), file.name);
		UserFileIndex--;
	};
	reader.onerror = function (event) {
		alert("Cannot read file! Code " + event.target.error.code);
	};
	reader.readAsText(file);

}

//COMMAND MANAGER

var CommandManager = (function() {
  function CommandManager() {}

  CommandManager.executed = [];
  CommandManager.unexecuted = [];
  
  CommandManager.execute = function execute(cmd) {
    cmd.execute();
    CommandManager.executed.push(cmd);
  };
  
  CommandManager.undo = function undo() {
    var cmd1 = CommandManager.executed.pop();
    if (cmd1 !== undefined){
      if (cmd1.unexecute !== undefined){
        cmd1.unexecute();
      }
      CommandManager.unexecuted.push(cmd1);
    }
  };
  
  CommandManager.redo = function redo() {
    var cmd2 = CommandManager.unexecuted.pop();
    
    if (cmd2 === undefined){
      cmd2 = CommandManager.executed.pop();
      CommandManager.executed.push(cmd2); 
      CommandManager.executed.push(cmd2); 
    }
    
    if (cmd2 !== undefined){
      cmd2.execute();
      CommandManager.executed.push(cmd2); 
    }
  };
  
  return CommandManager;
})();

CommandManager.execute({
  execute: function(){
    // do something
  },
  unexecute: function(){
    // undo something
  }
});
function exit_Window() {
	alert("\nThis method is only allowed to be called for windows that were opened by a script\nusing the window.open method.");
}

function update_stack(el, StackId) {
	if (names[StackId].StackUndoRedo[names[StackId].StackTop] !== el.value) {
		names[StackId].StackUndoRedo.push(el.value);
		names[StackId].StackTop++;
	}
	names[StackId].UndoRedoCounter = names[StackId].StackTop;
}
function undo_fun() {
	CommandManager.undo();
	/*var node = document.getElementById("mytext");
	if (names[LastButtonId].UndoRedoCounter <= 0) {
		alert("Nothing there to Undo");
	}
	else {
		node.value = names[LastButtonId].StackUndoRedo[names[LastButtonId].UndoRedoCounter - 1];
		names[LastButtonId].UndoRedoCounter--;
		textareachanged(0);
	}*/
}
/*function redo_fun() {
	var node = document.getElementById("mytext");
	if (names[LastButtonId].UndoRedoCounter === names[LastButtonId].StackTop) {
		alert("Nothing present to Redo");
	}
	else {
		node.value = names[LastButtonId].StackUndoRedo[names[LastButtonId].UndoRedoCounter + 1];
		names[LastButtonId].UndoRedoCounter++;
		textareachanged(0);
	}
}*/
