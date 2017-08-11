## Todo 
* auth on restful api [done]  
* prevent replay attack [done]
* post [done]   
* update [done]   
* query list and detail [done]  
* add users and change password  [done]
* import and export exl [almost done]


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
accessToken与nonce，账号id，账号权限有关， 一旦账号权限的标志泄露，则用户变成超级用户  