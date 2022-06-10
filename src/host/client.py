#!/usr/bin/env python
# -*- coding:utf-8 -*-
# Auther: linvo
 
import socket
import time
 
class Client(object):

    def __init__(self, host, port, timeout = 5):
        """
        链接远程接口服务
        """
        self.sock = None
        try:
            socket.setdefaulttimeout(timeout) 
            self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 
            self.sock.connect((host, port))
        except socket.error as e:
            raise Exception('SOCKET ERROR:' + str(e))
        except Exception as e:
            raise Exception('CONNECT ERROR:' + str(e))
 
 
 
    def send(self, data):
        """
        socket通信
        发送和接收
        data: 发送的数据
        ret: 接收的数据
        """
        ret = None
        # 链接成功，开始传输
        if self.sock:
            data = str(data)
            try:
                result = self.sock.sendall(data.encode('utf-8') )
            except Exception as e:
                result = str(e)
 
            if result is not None:
                raise Exception('SEND ERROR:')
            else:
                # 接收 
                ret = ''
                try:
                    while True:
                        buffer = self.sock.recv(2048)
                        if buffer: 
                            ret += buffer
                        else:
                            break
                except Exception as e:
                    raise Exception('RECV ERROR:' + str(e))
        return ret

client = Client('127.0.0.1',3059)
while True:
#   client.send("{ \"directive\": 'browser.open', \"data\": { \"url\",'https://www.baidu.com/' } }")
  client.send('1122ww')
  time.sleep(1)