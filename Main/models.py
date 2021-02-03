from Main import db, app

class Locations(db.Model ):
    address = db.Column(db.String(150))
    id = db.Column(db.Integer, primary_key=True)