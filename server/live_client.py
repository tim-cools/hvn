import time
import threading
import datetime
import random
import json

from pythonosc import udp_client
from pythonosc.dispatcher import Dispatcher
from pythonosc import osc_server

from log import log



class LiveClient:

    def __init__(self, responseHandler):
        self.localhost = "127.0.0.1"
        self.portLiveServer = 9000
        self.portLocalServer = 9001
        self.connection_timeout_microseconds = 500000
        self.last_server_timestamp = 0
        self.last_connection_timestamp = datetime.datetime.now()
        self.dispatcher = Dispatcher()
        self.is_connected = False
        self.server = osc_server.ThreadingOSCUDPServer((self.localhost, self.portLocalServer), self.dispatcher)
        self.client = udp_client.SimpleUDPClient(self.localhost, self.portLiveServer)
        self.responseHandler = responseHandler
        self.toggle = False

    def start_server(self):
        log(f"LiveClient - Starting Server - Serving on {self.server.server_address}")
        thread = threading.Thread(target=self.server.serve_forever)
        thread.start()

    def start_client(self):
        log(f"LiveClient - Starting Client - Sending to ('{self.localhost}', '{self.portLocalServer}')")
        thread = threading.Thread(target=self.send_ping)
        thread.start()

    def send_ping(self):
        while True:
            self.client.send_message("/ping", [])
            time.sleep(0.2)

            elapsed = datetime.datetime.now() - self.last_connection_timestamp
            if self.is_connected and elapsed.microseconds > self.connection_timeout_microseconds:
                log(f"LiveClient - Server disconnected")
                self.is_connected = False

    def print_handler(self, unused_addr, args, value):
        log(f"{unused_addr} -- [{args}] ~ {value}")

    def get_reply_handler(self, unused_addr, args, value):
        log(f"LiveClient - get reply {args} {value}")
        data = {
            "action": "get",
            "addr": unused_addr,
            "args": args,
            "value": value
        }
        value = json.dumps(data)
        self.responseHandler(value)

    def info_reply_handler(self, unused_addr, args, value):
        log(f"LiveClient - info reply {args} {value}")
        data = {
            "action": "info",
            "addr": unused_addr,
            "args": args,
            "value": self.parse_info(value)
        }
        value = json.dumps(data)
        self.responseHandler(value)

    def observer_reply_handler(self, unused_addr, args, value):
        log(f"LiveClient - observer reply {args} {value}")
        data = {
            "action": "observer",
            "addr": unused_addr,
            "args": args,
            "value": value
        }
        value = json.dumps(data)
        self.responseHandler(value)

    def ping_handler(self, unused_addr, args, value):

        self.last_connection_timestamp = datetime.datetime.now()

        if not self.is_connected:
            log(f"LiveClient - Server connected")
            self.is_connected = True

        if value != self.last_server_timestamp :
            log(f"LiveClient - Server refreshed")
            self.last_server_timestamp = value
            # resubscribe observers

    def start(self):
        self.dispatcher.map("/_get_reply", self.get_reply_handler)
        self.dispatcher.map("/_info_reply", self.info_reply_handler)
        self.dispatcher.map("/_observer_reply", self.observer_reply_handler)
        self.dispatcher.map("/_ping", self.ping_handler)

        self.start_server()
        self.start_client()

    def get(self):
        self.client.send_message("/get", ["live_set master_track mixer_device volume", "value", random.random()])
        log(f"LiveClient - get ")

    def info(self):
        self.client.send_message("/info", ["live_set master_track mixer_device volume", "value", random.random()])
        log(f"LiveClient - get info")

    def handle_request(self, data):
        action = data["action"]
        path = data["path"]
        name = data["name"]
        log(f"LiveClient - /{action}, {path}, {name}")
        self.client.send_message("/" + action, [path, name, random.random()])

    @staticmethod
    def parse_info(request):
        def check(line, name):
            if line.startswith(name + " "):
                value = line[len(name) + 1:]
                info[name] = value

        def checkCollection(line, name, collection, format):
            if line.startswith(name + " "):
                value = line[len(name) + 1:]
                if collection not in info:
                    info[collection] = []
                values = info[collection]
                if format:
                    parts = value.split(" ")
                    values.append({name: parts[0], "type": parts[1]})
                else:
                    values.append(value)

        lines = request.splitlines()
        info = {}
        for line in lines:
            check(line, "id")
            check(line, "type")
            check(line, "description")
            checkCollection(line, "child", "children", True)
            checkCollection(line, "property", "properties", True)
            checkCollection(line, "function", "function", False)
        return info