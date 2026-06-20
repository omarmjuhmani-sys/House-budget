async function scanReceipt() {

const file = document.getElementById('receiptImage').files[0];

if (!file) {
alert("اختر صورة");
return;
}

document.getElementById("output").value = "جاري تحليل الفاتورة...";

const result = await Tesseract.recognize(
file,
'ara+eng'
);

const text = result.data.text;

document.getElementById("output").value = text;

categorize(text);

}

function categorize(text) {

const lines = text.split("\n");

let supermarket = 0;
let fuel = 0;

lines.forEach(line => {

const match = line.match(/\d+(\.\d+)?/);

if (!match) return;

const price = parseFloat(match[0]);

const lower = line.toLowerCase();

if (
    lower.includes("milk") ||
    lower.includes("bread") ||
    lower.includes("cheese") ||
    lower.includes("rice") ||
    lower.includes("حليب") ||
    lower.includes("خبز") ||
    lower.includes("جبنة") ||
    lower.includes("رز")
) {
    supermarket += price;
}

if (
    lower.includes("fuel") ||
    lower.includes("diesel") ||
    lower.includes("gasoline") ||
    lower.includes("بنزين") ||
    lower.includes("ديزل")
) {
    fuel += price;
}

});

document.getElementById("market").innerText =
supermarket.toFixed(2);

document.getElementById("fuel").innerText =
fuel.toFixed(2);

if (supermarket > 0) {
saveExpense("سوبرماركت", "فاتورة", supermarket);
}

if (fuel > 0) {
saveExpense("وقود", "فاتورة", fuel);
}

}

async function saveExpense(category, item, amount) {

try {

await fetch(
"https://script.google.com/macros/s/AKfycby_cco8H2isAJgpjxhx_3WqJxeGqJRTMgndHfr64KRBMqN7PfI1zurdmAz40iGqOn_i/exec",
{
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
category: category,
item: item,
amount: amount
})
}
);

console.log("Saved");

} catch (error) {

console.error(error);

}

}
