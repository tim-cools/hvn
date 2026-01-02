from live_client import LiveClient
from web_server import WebServer


web_server = WebServer()

live_client = LiveClient(web_server.send_ws_message)
live_client.start()

web_server.start(live_client.handle_request)

command = None
while command != "q":
    command = input()
    if command == "s":
        live_client.get()


"""
def server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server_socket.bind(('', portLocalServer))
    print(f'server: started {portLocalServer}')

    while True:
        rand = random.randint(0, 10)
        message, address = server_socket.recvfrom(1024)
        print(f'server: {message, address}')
        message = message.upper()
        # if rand >= 4:
        #    print(f'SERVER: send{message, address}')
        #    server_socket.sendto(message, address)*/

def client():
    print(f'client: start')
    for pings in range(10):
        client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        client_socket.settimeout(1.0)
        message = b'test'
        addr = ("127.0.0.1", portLiveServer)

        start = time.time()
        client_socket.sendto(message, addr)
        try:
            data, server = client_socket.recvfrom(1024)
            end = time.time()
            elapsed = end - start
            print(f'client: {data} {pings} {elapsed}')
        except socket.timeout:
            print('client: no response')
    print(f'client: stop')


def shutdown(sig, frame):
    print("Server shutting down...")
    sys.exit(0)


signal.signal(signal.SIGINT, shutdown)

severThread = Thread(target=server)
severThread.daemon = True

clientThread = Thread(target=client)
clientThread.daemon = True

severThread.start()
clientThread.start()


def is_any_thread_alive(threads):
    return True in [t.is_alive() for t in threads]


try:
    while is_any_thread_alive([severThread, clientThread]):
        time.sleep(10)
    print("finished")

except KeyboardInterrupt:
    print("KeyboardInterrupt...")
    severThread.join()
    clientThread.join()
"""
