## Todo 
* auth on restful api
* prevent replay attack 

```javascript
digest = base64encode(hmac("johndoe", "secret", "GET+/users/johndoe/financialrecords+20apr201312:59:24+nonce"))
```
```
hmac johndoe:nonce:[digest]
```

```
GET /users/johndoe/financialrecords HTTP/1.1
Host: example.org
Authentication: hmac johndoe:123456:[digest]
Date: 20 apr 2013 12:59:24
```
验证用usercode   
查询用userid    
涉及查询的都需要提供accessToken表明身份  
get identity时会返回身份信息，准许列表，和accessToken  
accessToken与nonce，账号id，账号权限有关， 一旦账号权限的标志泄露，则可以用彩虹表突破，使用户变成超级用户  