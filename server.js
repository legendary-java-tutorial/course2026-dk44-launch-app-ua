// Стартовий застосунок модуля 6: сторінка з текстом версії та лічильник відвідувань у томі /data.
// Маршрут /crash завершує процес кодом 1 — для дослідів із політикою перезапуску (рівень 47).
const http = require("http");
const fs = require("fs");

const PORT = 3000;
const file = "/data/counter.txt";
const greeting = "Привіт із Release Day!";

function readCount() {
  if (!fs.existsSync(file)) {
    return 0;
  }
  return Number(fs.readFileSync(file, "utf8")) || 0;
}

// Без права запису в том застосунку працювати немає сенсу: виходимо кодом 1, політика перезапуску підніме його знову
try {
  fs.writeFileSync(file, String(readCount()));
} catch (err) {
  console.log("Не можу записати лічильник: " + err.code + " " + file);
  process.exit(1);
}

http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  if (req.url === "/crash") {
    console.log("Маршрут /crash: процес завершується з кодом 1");
    res.end("Збій на запит\n");
    setTimeout(() => process.exit(1), 50);
    return;
  }
  const count = readCount() + 1;
  fs.writeFileSync(file, String(count));
  res.end(greeting + " Відвідувань: " + count + "\n");
}).listen(PORT, () => {
  console.log("Застосунок слухає порт " + PORT);
});
