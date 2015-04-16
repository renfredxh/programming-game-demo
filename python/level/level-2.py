from browser import window

level = window.Level

class Door:

    def __init__(self, id):
        self.obj = level.blocks.get(id)

    def open(self):
        self.obj.open()

door = Door('1')
