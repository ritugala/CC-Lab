from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
from Main.models import Locations


class LocationForm(FlaskForm):

    address1 = StringField('Address')
    new_user = SubmitField('New Field')
    final_submit = SubmitField('Go!')

