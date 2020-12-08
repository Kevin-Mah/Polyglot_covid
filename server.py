import http.server
import socketserver
import os

os.system('go run main.go')
# Simple python web server from CMPT 371
PORT = 8080
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()