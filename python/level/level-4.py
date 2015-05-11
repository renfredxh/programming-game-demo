from browser import window

SCRIPT_ID = '36,74'

level = window.Level
variables = (level.variables.to_dict()).get(SCRIPT_ID)

def hint():
    print('Methods sometimes need more than one item inside the parenthesis to run.'
          '\n\nWhat happens if you try moving the block 8 spaces to the left?')

class Block:

    def __init__(self, id):
        self.obj = level.largeBlocks.get(id)

    def move(self, direction, distance):
        self.obj.move(direction, distance)

block = Block('1')
