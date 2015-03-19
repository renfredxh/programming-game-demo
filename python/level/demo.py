from browser import window

level = window.Level

class Block:

    def __init__(self, id):
        self.obj = level.blocks.get(id)
        self.color = self.obj.color

    def move(self, direction, distance):
        self.obj.move(direction, distance)

    def __setattr__(self, name, value):
        object.__setattr__(self, name, value)
        if name in ['color']:
            self.obj.set(name, value)

block1 = Block('1')
block2 = Block('2')
block3 = Block('3')
block4 = Block('4')
