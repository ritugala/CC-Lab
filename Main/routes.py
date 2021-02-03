from flask import render_template, url_for, flash, redirect, request
from Main.models import Locations
from Main.forms import LocationForm
from Main.geocoding import MidPoint


from Main import app, db

@app.route("/")
@app.route("/home")
def home():
    return render_template("home.html")

@app.route("/dynamic", methods=['GET', 'POST'])
def Meet():
    count = 2
    form = LocationForm()
    if(form.final_submit.data==True):
        n=request.values.get("hide_f")
        n = int(n)
        addr = []
        for s in range(int(n)):
            addr.append(request.values.get("xyz-"+str(s)))
            print("hello")
        mid_lat, mid_long, temp = MidPoint(n, addr)
        data = {'mid_lat':mid_lat, 'mid_long':mid_long, 'temp':temp}
        print('##################',data)
        return render_template("temp.html", form=form, data =data)

    return render_template("dynamic.html", form=form)
        #
        # print("Entered final_submit")
        # #addr = [form.address1.data, form.address2.data]
        #
        # addr = [a.address for a in Locations.query.all()]  # check this statement
        # print("Prihnting" ,addr)
        # #n = Locations.query().count() #check otherwise use count
        # n = 2
        # print(n)
        # MidPoint(n, addr)
        # db.drop_all()




