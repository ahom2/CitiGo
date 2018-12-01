import urllib.request
import json

def get_bike_data(url):
    stationList = []
    data = json.loads(urllib.request.urlopen(url).read().decode())

    for station in data["stationBeanList"]:
        if station.get("statusValue") != "Not In Service":
            stationList.append([int(station.get('id')), station.get('stationName'), int(station.get("availableDocks")), float(station.get("latitude")), float(station.get("longitude")), int(station.get("availableBikes")), station.get("lastCommunicationTime")])
    return json.dumps(stationList)