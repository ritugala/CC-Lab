from geopy.geocoders import Nominatim
import gmplot
import googlemaps
from googleplaces import GooglePlaces, types
import math


def MidPoint(n, addr):
    geolocator = Nominatim(user_agent="MeetInTheMid")

    google_places = GooglePlaces('AIzaSyCd3yT-00TDYD1gYM6WWWKTO6kxOVr-ho8')
    lat = []
    longy = []
    temp = []
    print("This is",addr)
    for x in addr:
        print(x)
        location = geolocator.geocode(x)
        lat.append(location.latitude)
        longy.append(location.longitude)
        temp.append((location.latitude, location.longitude))
    lat_centroid = sum(lat)/n
    longy_centroid = sum(longy)/n
    ans = []
    for i in range(len(addr)):
        dlat = lat[i]-lat_centroid
        dlong = longy[i] - longy_centroid
        a = math.pow(math.sin(dlat/2),2), +math.cos(lat[i])*math.cos(lat_centroid)*math.pow(sin(dlong/2),2)
        c = 2*math.asin(math.sqrt(a))
        km = 6367*c
        ans.append(km)
    



    print(temp)
    gmap = gmplot.GoogleMapPlotter(lat_centroid,longy_centroid,12)
    lat, longy = zip(*temp)
    #lat, longy = zip(*[(19.0549792, 72.8402203), (19.0549792, 72.8402203)])
    lat_centroid = round(lat_centroid, 4)
    longy_centroid = round(longy_centroid, 4)
    print(lat_centroid, longy_centroid)
    print(type(lat_centroid))
    rest_near_me = google_places.nearby_search(
        lat_lng={'lat': lat_centroid, 'lng': longy_centroid},
        radius=20,
        types=[types.TYPE_CAFE])
    print("Rest mea",rest_near_me)
    for place in rest_near_me.places:
        print("this si:",place.geo_location['lat'], place.geo_location['lng'])
        gmap.marker(place.geo_location['lat'], place.geo_location['lng'], 'green')
    gmap.scatter(lat, longy, 'FA0000', size = 50, marker=False)
    for i in range(len(addr)):
        gmap.marker(lat[i], longy[i], 'red')
    gmap.marker(lat_centroid, longy_centroid, 'cornflowerblue' )
    for x in range(len(addr)):
        gmap.plot([lat_centroid, lat[x]], [longy_centroid, longy[x]],'blue', edge_width=5)
    mid_addr = geolocator.reverse(lat_centroid, longy_centroid)
    #gmap.plot(lat_centroid, longy_centroid)
    gmap.apikey = "AIzaSyCd3yT-00TDYD1gYM6WWWKTO6kxOVr-ho8"


    #print(gmaps.directions(addr[0], mid_addr))

    gmap.draw(r"C:\Users\Ritu\PycharmProjects\MiddleGround\Main\templates\temp.html") #to save the image

    return lat_centroid, longy_centroid, temp





