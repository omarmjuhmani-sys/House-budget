async function scanReceipt() {

const file = document.getElementById('receiptImage').files[0];

if (!file) {
    alert("اختر صورة");
    return;
}

document.getElementById("output").value =
"جاري تحليل الفاتورة...";

const result = await Tesseract.recognize(
    file,
    'ara+eng'
);

const text = result.data.text;

document.getElementById("output").value = text;

categorize(text);

}

function categorize(text) {

let category = "أخرى";
let item = "فاتورة";
let amount = 0;

const lower = text.toLowerCase();

// استخراج أكبر مبلغ من الفاتورة
const numbers = text.match(/\d+(\.\d+)?/g);

if (numbers) {

    const values = numbers
    .map(n => parseFloat(n))
    .filter(n => !isNaN(n));

    amount = Math.max(...values);

}

// تصنيف ذكي

if (
    lower.includes("بوابة الشعب") ||
    lower.includes("supermarket") ||
    lower.includes("market") ||
    lower.includes("تخفيضات")
) {
    category = "سوبرماركت";
}

else if (
    lower.includes("fuel") ||
    lower.includes("diesel") ||
    lower.includes("gasoline") ||
    lower.includes("بنزين") ||
    lower.includes("ديزل")
) {
    category = "وقود";
}

else if (
    lower.includes("electric") ||
    lower.includes("كهرباء")
) {
    category = "كهرباء";
}

else if (
    lower.includes("water") ||
    lower.includes("مياه")
) {
    category = "ماء";
}

document.getElementById("market").innerText =
(category === "سوبرماركت")
? amount.toFixed(2)
: "0.00";

document.getElementById("fuel").innerText =
(category === "وقود")
? amount.toFixed(2)
: "0.00";

// إرسال مباشر للشيت
saveExpense(
    category,
    item,
    amount
);

}

async function saveExpense(category, item, amount) {

try {

const response = await fetch(
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

const result = await response.text();

console.log(result);

alert(
"تم الحفظ بالشيت\n" +
"التصنيف: " + category +
"\nالمبلغ: " + amount
);

}
catch(error) {

console.error(error);

alert(
"فشل الربط مع Google Sheet"
);

}

}
