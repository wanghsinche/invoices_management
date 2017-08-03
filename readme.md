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
