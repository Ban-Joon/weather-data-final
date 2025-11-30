// ✅ TypeScript + Express 서버 코드

import express from "express";
import request from "request";
import { parseString } from "xml2js"; // XML → JSON 변환

const app = express();

app.get("/weather", (req, res) => {
  const { serviceKey, numOfRows, pageNo, base_date, base_time, nx, ny } =
    req.query;

  const api_url =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?";

  const options = {
    url: api_url,
    qs: { serviceKey, numOfRows, pageNo, base_date, base_time, nx, ny },
  };

  request.get(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      // XML → JSON 변환 후 응답
      parseString(body, { explicitArray: false }, (err, result) => {
        if (err) {
          res.status(500).json({ error: "XML 파싱 오류" });
        } else {
          res.json(result); // ✅ JSON 응답
        }
      });
    } else {
      res.status(response?.statusCode || 500).end();
      console.log("error =", response?.statusCode);
    }
  });
});
// 서버 실행
app.listen(3000, () => {
  console.log("✅ Weather API Server is running on port 3000");
  console.log("👉 테스트 요청 예시:");
  console.log(
    "http://127.0.0.1:3000/weather?serviceKey=xaewDvpKRfgguy5Dgl06BG9bn2wH7nKzTgUzxCD5gU8YCc6NkBeWWKZPJO9ZgjY%2FSmS4qyfS6eS9%2BHP2Kot%2Bgw%3D%3D&numOfRows=10&pageNo=1&base_date=20251130&base_time=0830&nx=59&ny=127"
  );
});
