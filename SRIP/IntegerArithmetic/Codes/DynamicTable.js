var row1,row2;
const n = 16;

for (let r=0;r<n;r++){
  var col='';
  var temp = r;
  var bin='';
  var x=r+1;
  while(temp>0){
    let d=temp%2;
    bin= d+bin;
    temp=temp>>1;
  }
  var two=r;
  var one=r;
  var sig=r;
  if(r===0){
    bin='0';
  }
  if(x>8){
    two=r-16;
  }
  if(x>8){
    one=r-15;
  }
  if(r>=8){
    sig=8-r;
  }
  col+='<td>'+x+'</td>';
  col+='<td>'+bin+'</td>';
  col+= '<td>'+two+'</td>';
  col+= '<td>'+one+'</td>';
  col+='<td>'+r+'</td>';
  col+='<td>'+sig+'</td>';
  var row='<tr onClick=getRow(this) id="'+x+'">'+col+'</tr>';
  $("#binary4bit").append(row);
}
var rowover = "<tr id ='overflow' style='display: none'> <td></td><td></td><td></td><td></td><td></td><td></td> </tr>"
$("#binary4bit").append(rowover);

var prev= null;

const getRow2 = (prev,ele) => {
  for(let i=1;i<=n;i++){
    document.getElementById(i).style.background = 'white';
    for(let j=1;j<=5;j++){
      document.getElementById(i).cells[j].style.background='';
    }
  }
  document.getElementById(ele.id).style.background = '#4c5c96';
  if(prev!=null){
    document.getElementById(prev.id).style.background = '#4c5c96';
    row1=document.getElementById(prev.id);
  }
  row2=document.getElementById(ele.id);
}

const getRow = (elem) => {
  getRow2(prev,elem);
  prev=elem;
}

const addBinary = () => {
  var flag1=0,flag2=0,flag3=0,flag4=0,flag5=0;
  var bin=Number(row1.cells[4].innerHTML)+Number(row2.cells[4].innerHTML);
  var unsig=Number(row1.cells[4].innerHTML)+Number(row2.cells[4].innerHTML);
  var res="";
  if(unsig>15)
  {
    document.getElementById("over").innerHTML="4 BIT OVERFLOW";
    alert("4 BIT OVERFLOW! 4 BIT OVERFLOW");
  }
  else{
    document.getElementById("over").innerHTML=""; 
  }
  var  t=bin;
  while(t>0){
    let d=t%2;
    res= d+res;
    t=t>>1;
  }
  document.getElementById("Binrep").value =res;
  document.getElementById("2s").value=Number(row1.cells[2].innerHTML)+Number(row2.cells[2].innerHTML);
  document.getElementById("1s").value=Number(row1.cells[3].innerHTML)+Number(row2.cells[3].innerHTML);
  document.getElementById("Unsi").value=Number(row1.cells[4].innerHTML)+Number(row2.cells[4].innerHTML);
  document.getElementById("Sig").value=Number(row1.cells[5].innerHTML)+Number(row2.cells[5].innerHTML);

var table = document.getElementById("table");
  for (var i = 1, rows1; rows1 = table.rows[i]; i++) {
   if(rows1.cells[1].innerHTML===res){
      rows1.cells[1].style.background = '#64E986';
       flag1=1;
      document.getElementById("overflow").cells[1].style.background='white';
       document.getElementById("overflow").cells[1].innerHTML='';
      }
    if(rows1.cells[2].innerHTML===document.getElementById("2s").value){
      rows1.cells[2].style.background = '#64E986';
       flag2=1;
      document.getElementById("overflow").cells[2].style.background='white';
       document.getElementById("overflow").cells[2].innerHTML='';
      flag2=1;
         }
    if(rows1.cells[3].innerHTML===document.getElementById("1s").value){
      rows1.cells[3].style.background = '#64E986';
       flag3=1;
      document.getElementById("overflow").cells[3].style.background='white';
       document.getElementById("overflow").cells[3].innerHTML='';
     }
    if(rows1.cells[4].innerHTML===document.getElementById("Unsi").value){
      rows1.cells[4].style.background = '#64E986';
         flag4=1;
      document.getElementById("overflow").cells[4].style.background='white';
       document.getElementById("overflow").cells[4].innerHTML='';}
    if(rows1.cells[5].innerHTML===document.getElementById("Sig").value){
      rows1.cells[5].style.background = '#64E986';
      flag5=1;
       document.getElementById("overflow").cells[5].style.background='white';
       document.getElementById("overflow").cells[5].innerHTML='';
  
    }
}
var retrieve=document.getElementById("overflow");
if(flag1===0)
{
document.getElementById("overflow").style.display = '';
document.getElementById("overflow").cells[1].innerHTML="4-BitOverflow";  
document.getElementById("overflow").cells[1].style.background="#64E986";
}
if(flag2===0)
{
document.getElementById("overflow").style.display= '';
document.getElementById("overflow").cells[2].innerHTML="2s-OverFlow";  
document.getElementById("overflow").cells[2].style.background="#64E986";
}
if(flag3===0)
{
document.getElementById("overflow").style.display='';
document.getElementById("overflow").cells[3].innerHTML="1s-OverFlow";  
document.getElementById("overflow").cells[3].style.background="#64E986";
}
if(flag4===0)
{
document.getElementById("overflow").style.display='';
document.getElementById("overflow").cells[4].innerHTML="Overflow!";  
document.getElementById("overflow").cells[4].style.background="#64E986";
}
if(flag5===0)
{
document.getElementById("overflow").style.display='';
retrieve.cells[5].innerHTML="Overflow!";  
retrieve.cells[5].style.background="#64E986";
}
}
