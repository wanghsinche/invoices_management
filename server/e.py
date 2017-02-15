#-*- coding:utf8 -*-
# Written by Vamei
# Server side
import socket

HOST = ""
PORT = 8080

text = """
HTTP/1.x 200 ok
Content-Type: text/html


<html>
<body>
<p> hahah</p>
</body>
</html>
"""


s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind((HOST, PORT))
s.listen(3)
print "..."
conn, attr = s.accept()

request = conn.recv(1024)
method = request.split(" ")[0]
src = request.split(" ")[1]

if method.lower() == "get":
    conn.sendall(text)
    pass
conn.close()
print src
print "end"