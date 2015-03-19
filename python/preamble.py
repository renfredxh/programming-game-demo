from browser import document
import sys

class Console:

    def __init__(self):
        pass

    def write(self, output):
        print("""<span class="error">{}</span>""".format(output));

def print(*objects, sep='\n', end='\n'):
    text = sep.join([str(object) for object in objects])
    document['console'].html += "{}{}".format(text, end)

sys.stderr = Console()
