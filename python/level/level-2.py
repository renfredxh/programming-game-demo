from browser import window

SCRIPT_ID = '31,88'

level = window.Level
variables = (level.variables.to_dict()).get(SCRIPT_ID)

class Door:

    def __init__(self, id):
        self.obj = level.doors.get(id)

    def open(self):
        if not self.obj.is_open:
            self.obj.open()

    def close(self):
        if self.obj.is_open:
            self.obj.close()

door = Door('1')
