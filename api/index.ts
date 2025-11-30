// ✅ TypeScript + Express 서버 코드 (XML Proxy 버전)

import express from "express";
import request from "request"; // ✅ request 라이브러리 그대로 사용

const app = express();

// GET /weather 라우트 생성
app.get("/weather", (req: any, res: any) => {
  const { serviceKey, numOfRows, pageNo, base_date, base_time, nx, ny } =
    req.query;

  // 1) 기상청 UltraSrtNcst API 주소 (HTTP, XML 반환용)
  const api_url =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?";

  // 2) request 옵션 구성
  const options = {
    url: api_url,
    qs: { serviceKey, numOfRows, pageNo, base_date, base_time, nx, ny },
  };

  // 3) 외부 API 호출 실행
  request.get(options, (error: any, response: any, body: any) => {
    if (!error && response.statusCode === 200) {
      // ✅ 성공: XML 그대로 반환
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      res.status(200).end(body);
    } else {
      // ❗ 실패: 상태코드 그대로 반환
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
    "http://127.0.0.1:3000/weather?serviceKey=YOUR_API_KEY&numOfRows=10&pageNo=1&base_date=20251130&base_time=0830&nx=60&ny=127"
  );
});
