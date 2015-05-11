from browser import window

SCRIPT_ID = '22,74'

level = window.Level
variables = (level.variables.to_dict()).get(SCRIPT_ID)

def hint():
    print('This door needs a key instead of a password, try finding it!')

class MissingKeyError(Exception):
    pass

class Key:
    pass

class Door:

    def __init__(self, id):
        self.obj = level.doors.get(id)

    def open(self, key=None):
        if key is None:
            raise MissingKeyError("Key required to open door")
        if not self.obj.is_open:
            if isinstance(key, Key):
                self.obj.open()
            else:
                raise MissingKeyError("Key required to open door")

    def close(self):
        if self.obj.is_open:
            self.obj.close()

if variables is not None:
    if 'key' in variables:
        key = Key()

door = Door('4')
