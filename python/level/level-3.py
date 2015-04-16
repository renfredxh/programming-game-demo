from browser import window

SCRIPT_ID = '27,81'

level = window.Level
variables = (level.variables.to_dict()).get(SCRIPT_ID)

class MissingPasswordError(Exception):
    pass

class IncorrectPasswordError(Exception):
    pass

class Door:

    def __init__(self, id):
        self.obj = level.doors.get(id)

    def open(self, password=None):
        if password is None:
            raise MissingPasswordError("Password required to open door")
        if not self.obj.is_open:
            if password == "sesame":
                self.obj.open()
            else:
                raise IncorrectPasswordError("Incorrect password")

    def close(self):
        if self.obj.is_open:
            self.obj.close()

if variables is not None:
    if 'password' in variables:
        password = "sesame"

door = Door('2')
