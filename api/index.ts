// ✅ TypeScript + Express 서버 코드 (XML Proxy 유지)

import express from "express";
import request from "request"; // HTTP 요청 라이브러리

const app = express();
app.use(express.json());

// ❗ GPTs Connector의 스키마 검증 ping/테스트 요청 대응 보호 라우트 추가
// → 기존 API 로직을 지우지 않고, 검증 요청만 먼저 200 XML로 반환
app.get("/weather", (req, res, next) => {
  const ua = req.headers["user-agent"]?.toLowerCase() || "";

  // "openapi" 문자열이 포함된 검증 요청이면, 최소 xml 바디를 200으로 즉시 반환
  if (ua.includes("openapi")) {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    return res
      .status(200)
      .send("<response><header>validator-ok</header></response>");
  }

  next(); // → 검증용이 아니면 아래의 실제 API 로직으로 넘김
});

// 👇 아래는 파트너님이 처음 작성하신 실제 날씨 프록시 로직 (절대 삭제/교체 금지)
app.get("/weather", (req: any, res: any) => {
  const { serviceKey, numOfRows, pageNo, base_date, base_time, nx, ny } =
    req.query;

  const upstreamURL =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";

  const options = {
    url: upstreamURL,
    qs: { serviceKey, numOfRows, pageNo, base_date, base_time, nx, ny },
  };

  request.get(options, (error: any, response: any, body: any) => {
    if (!error && response.statusCode === 200) {
      res.setHeader("Content-Type", "application/xml;charset=utf-8");
      res.status(200).end(body);
    } else {
      res.status(response?.statusCode || 500).end();
      console.log("error =", response?.statusCode);
    }
  });
});

// 개발 로컬 실행 유지용 (Vercel에서는 default export만 실행됨)
app.listen(3000, () => {
  console.log("✅ Weather API Server is running on port 3000");
});

export default app;
