from browser import window

level = window.Level

class Block:

    def __init__(self, id):
        self.obj = level.blocks.get(id)
        self.color = self.obj.color

    def move(self, dist):
        self.obj.move(dist)

    def __setattr__(self, name, value):
        object.__setattr__(self, name, value)
        if name in ['color']:
            self.obj.set(name, value)

block = Block('1')