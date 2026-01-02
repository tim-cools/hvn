import threading

import aiohttp
from aiohttp import web, WSCloseCode
import asyncio
from log import log
import os
import json


class WebServer:

    def __init__(self, ):
        self.host = "127.0.0.1"
        self.port = 8000
        self.dir_static_files = os.path.dirname(os.path.realpath(__file__)) + "/web/build"
        self.ws = None                                # todo manage many ws objects
        self.live_request_handler = None

    async def http_handler(self, request):
        return web.Response(text='Hello, world')

    def send_ws_message(self, data):
        if self.ws is not None:                      # todo manage many ws objects
            log(f"Websocket - send: {data}")
            asyncio.run(self.ws.send_str(data))

    async def websocket_handler(self, request):
        ws = web.WebSocketResponse()
        self.ws = ws                                 # todo manage many ws objects
        await ws.prepare(request)
        log(f"Websocket opened")

        async for msg in ws:
            if msg.type == aiohttp.WSMsgType.TEXT:
                log(f"Websocket received: {msg.data}")
                if msg.data == 'close':
                    await ws.close()
                else:
                    value = json.loads(msg.data)
                    self.live_request_handler(value)
            elif msg.type == aiohttp.WSMsgType.ERROR:
                log('ws connection closed with exception %s' % ws.exception())
        log(f"Websocket closed")

    def create_runner(self):
        app = web.Application()
        app.add_routes([
            web.get('/ws', self.websocket_handler),
            web.get('/hello', self.http_handler),
            web.static('/', self.dir_static_files),
        ])
        return web.AppRunner(app)

    async def start_site(self):
        runner = self.create_runner()
        await runner.setup()
        site = web.TCPSite(runner, self.host, self.port)
        await site.start()

    def start(self, live_request_handler):
        self.live_request_handler = live_request_handler

        loop = asyncio.get_event_loop()
        loop.run_until_complete(self.start_site())

        thread = threading.Thread(target=loop.run_forever)
        thread.start()

        log(f"Web-server started ('{self.host}', {self.port}): {self.dir_static_files}")