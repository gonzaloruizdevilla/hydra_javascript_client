#!/usr/bin/env python
# encoding: utf-8

import socket
import psutil
import sys
import BaseHTTPServer
import time

if len(sys.argv) != 5:
    print "Usage: {0} CHECK_HOST CHECK_PORT LISTEN_HOST LISTEN_PORT".format(sys.argv[0])
    sys.exit()
else:
    CHECK_HOST = sys.argv[1]
    CHECK_PORT = int(sys.argv[2])
    LISTEN_HOST = sys.argv[3]
    LISTEN_PORT = int(sys.argv[4])
         
def isOpen(ip,port):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        s.connect((ip, int(port)))
        s.shutdown(2)
        return True
    except:
        return False

class MyHandler(BaseHTTPServer.BaseHTTPRequestHandler):
    def do_HEAD(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
    def do_GET(self):
        """Respond to a GET request."""
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()     
        if isOpen(CHECK_HOST, CHECK_PORT):
            self.wfile.write("0\n")
            self.wfile.write(psutil.cpu_percent(interval=0.1, percpu=False))
            self.wfile.write("\n")
            self.wfile.write(psutil.virtual_memory().percent)
        else:
            self.wfile.write("1")

server_class = BaseHTTPServer.HTTPServer
httpd = server_class((LISTEN_HOST, LISTEN_PORT), MyHandler)
print time.asctime(), "Server Starts - %s:%s" % (LISTEN_HOST, LISTEN_PORT)
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    pass
httpd.server_close()
print time.asctime(), "Server Stops - %s:%s" % (LISTEN_HOST, LISTEN_PORT)