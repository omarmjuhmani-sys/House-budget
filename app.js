async function scanReceipt() {

const file =
document.getElementById('receiptImage').files[0];

if(!file){
alert("اختر صورة");
return;
}

document.getElementById("output").value =
"جاري التحليل ...";

const result =
await Tesseract.recognize(
file,
'ara+eng'
);

const text = result.data.text;

document.getElementById("output").value =
text;

categorize(text);

}

function categorize(text){

const lines = text.split("\n");

let supermarket = 0;
let fuel = 0;

lines.forEach(line=>{

const price =
parseFloat(
line.match(/\d+(\.\d+)?/)
);

if(!price) return;

const lower =
line.toLowerCase();

if(
lower.includes("milk") ||
lower.includes("bread") ||
lower.includes("cheese") ||
lower.includes("حليب") ||
lower.includes("خبز")
){
supermarket += price;
}

if(
lower.includes("fuel") ||
lower.includes("diesel") ||
lower.includes("بنزين")
){
fuel += price;
}

});

document.getElementById("market")
.innerText = supermarket.toFixed(2);

document.getElementById("fuel")
.innerText = fuel.toFixed(2);

}
async function saveExpense(category, item, amount){

try{

await fetch(
"https://script.google.com/macros/s/AKfycbyLNxqCIOa4mLZeXT0yoTkUS-qhvODhmcGujGUCEcdxIuVHax8LSraM78ymMWX8-YM/exec",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
category:category,
item:item,
amount:amount
})
}
);

console.log("Saved");

}catch(err){

console.error(err);

}

}
