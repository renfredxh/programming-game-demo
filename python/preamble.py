from browser import document

def print(*objects, sep='\n', end='\n'):
    text = sep.join([str(object) for object in objects])
    document['console'].html += "➔ {}{}".format(text, end)
