# game.py

class Game:
    def __init__(self, id, devices=[]):
        self.id = id
        self.devices = devices

    def add_device(self, device):
        self.device.append(device)

    def to_dict(self):
        return {
            'id': self.id,
            'devices': self.devices
        }

    @staticmethod
    def from_dict(dict):
        return Game(dict.get('id'), dict.get('devices'))
