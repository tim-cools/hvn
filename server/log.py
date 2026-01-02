import datetime


def log(value):
    print(datetime.datetime.now().isoformat(), "-", value)