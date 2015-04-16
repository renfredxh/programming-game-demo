from browser import window

level = window.Level

class Door:

    def __init__(self, id):
        self.obj = level.doors.get(id)

    def open(self):
        if not self.obj.is_open:
            self.obj.open()
            self.obj.is_open = True

    def close(self):
        if self.obj.is_open:
            self.obj.close()
            self.obj.is_open = False

door = Door('1')
