const express = require("express"); // 익스프레스 프레잉워크 불러오기
const morgan = require("morgan"); // 콘솔 창에 요청에 대한 추가 로그를 기록 -> 통신할 때 추가 정보를 콘솔창에 올려줍니다. METHOD : GET URL : localhost:8080/ 201
const dotenv = require("dotenv"); // .env 파일에 적혀 있는 환경변수를 사용 가능하게
const cookieParser = require("cookie-parser"); // 쿠키 설정
const session = require("express-session"); // 세션 설정

dotenv.config(); // .env 파일에서 변수 불러오기, process.env.PORT = 8081
const app = express(); // express 내부에 http 모듈 내장
app.set("port", process.env.PORT || 8081); // 서버가 실행될 포트 설정, app.set(키, 값) -> 데이터 짱, port -> 8080, app.get('port') -> 8080

// 써드파티 미들웨어 선언하는 부분
app.use(morgan("dev")); // 'dev' -> develop 개발할 때, combined(배포)
app.use(cookieParser(process.env.COOKIE_SECRET)); // COOKIE_SECRET 암호화
app.use(
  session({
    // 세션에 대한 기본 설정
    resave: false, // 세션 데이터가 바뀌기 전까지 세션 저장소의 값을 저장할 것인지
    saveUninitialized: false, // 세션이 필요하기 전에 세션 구동할지 여부
    secret: process.env.COOKIE_SECRET, // 암호화는 쿠키 파서랑 같은 걸로
    cookie: {
      httpOnly: true,
      secure: false, // http 환경에서만 사용할 수 있게(https 에서는 불가능)
    },
  })
);

// 애플리케이션 레벨 미들웨어
// 모든 요청에서 실행되는 미들웨어
app.use((req, res, next) => {
  console.log("모든 요청에서 실행되는지 확인");
  next(); // 해당 주소의 미들웨어 실행문 -> 다음 미들웨어로 넘어가기 위한 문장입니다.
});

// 주소에 GET 요청이 올 때, 어떤 동작을 할지 적는 부분, res -> 응답에 관한 정보가 들어 있는 친구, GET localhost:8080/
app.get("/", (req, res, next) => {
  console.log("GET / 요청에 대해서만 실행 확인");
  res.status(200).send("정상 작동");
});

// 주소에 GET 요청과 URL http://localhost:8080/error로 올 때, 에러 미들웨어 실행시키는 친구
app.get("/error", (req, res, next) => {
  console.log("에러 발생");
  throw new Error("하단 에러 미들웨어로 이동"); // error.message -> 하단 에러 미들웨어로 이동
});

// 에러 미들웨어 처리하는 부분 -> 에러 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err); // console.log(error)
  res.status(500).send(err.message); // http 웹에 에러 표시 해주는 부분
});

// http 웹 서버 구동하는 방식과 동일
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중입니다");
});

// 미들웨어란 요청울 벋었울 때, 응답을 해주기까지 중간에서 처리하는 과정을 말합니다.
// request -> 정보를 추출하기 위해 하는 모든 활동들? 로그인을 했는지 진실 여부 판단 -> 정보를 데이터베이스에서 뽑아서 원하는 형식 -> 응답
// 미들웨어는 4가지 부분으로 나뉩니다.
// 1. 애플리케이션 레벨 미들웨어 -> ex. app.use, app.METHOD
// 2. 라우터 레벨 미들웨어 (x) -> ex. router.use, router.METHOD
// 3. 오류 처리 미들웨어 -> (err, req, res, next) 4가지 인자를 받는 미들웨어
// 4. 써드파티 미들웨어 -> 오늘 해볼거, npm 으로 설치
