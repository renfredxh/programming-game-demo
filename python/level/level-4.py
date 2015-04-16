from browser import window

SCRIPT_ID = '36,74'

level = window.Level
variables = (level.variables.to_dict()).get(SCRIPT_ID)

class Block:

    def __init__(self, id):
        self.obj = level.largeBlocks.get(id)

    def move(self, direction, distance):
        self.obj.move(direction, distance)

block = Block('1')
