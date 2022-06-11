const express = require('express') // 익스프레스 모듈 불러오기

const app = express(); // express 내부에 http 모듈 내장
app.set('port', process.env.PORT || 8080); // 서버가 실행될 포트 설정, app.set(키, 값) -> 데이터 짱, port -> 8080, app.get('port') -> 8080

// 모든 요청에서 실행되는 미들웨어
app.use((req, res, next) => {
    console.log('모든 요청에서 실행되는지 확인');
    next(); // 해당 주소의 미들웨어 실행문
})

// 주소에 GET 요청이 올 때, 어떤 동작을 할지 적는 부분, res -> 응답에 관한 정보가 들어 있는 친구, GET localhost:8080/
app.get('/', (req, res) => {
    console.log('GET / 요청에 대해서만 실행 확인');
});

// 주소에 GET 요청과 URL /error로 올 때, 에러 미들웨어 실행시키는 친구
app.get('/error', (req, res, next) => {
    console.log('에러 발생');
    throw new Error('하단 에러 미들웨어로 이동'); // error.message -> 하단 에러 미들웨어로 이동
})

// 에러 미들웨어 처리하는 부분
app.use((err, req, res, next) => {
    console.error(err); // console.log(error)
    res.status(500).send(err.message); // http 웹에 에러 표시 해주는 부분
})

// http 웹 서버 구동하는 방식과 동일
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중입니다');
});