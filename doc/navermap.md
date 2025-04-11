
#네이버 지도 API연동하기

```javascript
<script
  type="text/javascript"
  src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=발급받은키&submodules=geocoder"
></script>
```

처음에는 위와같이 코드를 작성하였는데 인증문제가 발생하였다.
그냥 [네이버 공식 블로그](https://m.blog.naver.com/n_cloudplatform/222012109447_)를 따라하였었는데

네이버 클라우드의 공식문서에 따르면 [네이버 클라이언트 아이디 발급](https://navermaps.github.io/maps.js.ncp/docs/tutorial-1-Getting-Client-ID.html)할 때 일반, 공공 금융의 구분이 있었던 과거와 다르게 통합하였다.

변경 전
```javascript
<!-- 일반 -->
<script type="text/javascript" src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=YOUR_CLIENT_ID"></script>

<!-- 공공 -->
<script type="text/javascript" src="https://oapi.map.naver.com/openapi/v3/maps.js?govClientId=YOUR_CLIENT_ID"></script>

<!-- 금융 -->
<script type="text/javascript" src="https://oapi.map.naver.com/openapi/v3/maps.js?finClientId=YOUR_CLIENT_ID"></script>
```
변경 후
```javascript
<!-- 개인/일반 통합 -->
<script type="text/javascript" src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=YOUR_CLIENT_ID"></script>
```
이러면 공식 블로그를 지우는 것이 좋을 것 같다...
