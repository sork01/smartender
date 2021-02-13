import os
import sys
import fake_rpi
import time

if 'ENV' in os.environ.keys() and os.environ['ENV'] == "dev":
    sys.modules['RPi'] = fake_rpi.RPi     # Fake RPi
    sys.modules['RPi.GPIO'] = fake_rpi.RPi.GPIO # Fake GPIO
    sys.modules['smbus'] = fake_rpi.smbus # Fake smbus (I2C)

from classes import Bartender
from drinks import drinkList, drinkOptions
from drinks2 import drinkList2
import json
import RPi.GPIO as GPIO
from flask import Flask, render_template, request

app = Flask(__name__)
GPIO.setmode(GPIO.BCM)
bartender = Bartender.Bartender(drinkList, drinkList2, drinkOptions)


@app.route("/")
def hello():
    return "Hello World!"

@app.route('/drinks', methods=['GET'])
def getDrink():
    return render_template('drinks.html.j2', drinks=bartender.getSupportedDrinks())

@app.route('/addrinks', methods=['GET'])
def getAddedDrinks():
    print(bartender.getAddedDrinks())
    return render_template('addrinks.html.j2', drinks=bartender.getAddedDrinks())

@app.route('/add', methods=['POST'])
def addDrink():
    print(request.json["drink"])
    bartender.addDrinkToList(request.json["drink"])
    return "Ok"

@app.route('/pour', methods=['POST'])
def pourDrink():
    bartender.pour(request.json["drink"])
    time.sleep(0.1)
    return bartender.getDrinkJson()
    
@app.route('/pourhard', methods=['POST'])
def pourHard():
    bartender.pour(request.json["drink"], True)
    time.sleep(0.1)
    return bartender.getDrinkJson()

@app.route('/pumps', methods=['GET'])
def getPumps():
    return render_template('pumps.html.j2', pumpConfig=bartender.getPumpConfig(), drinkOptions=bartender.getDrinkOptions())

@app.route('/pump', methods=['POST'])
def updatePump():
    bartender.updatePumpDrink(request.json["pump"], request.json["drink"])
    return ""

@app.route('/startpump', methods=['POST'])
def startPump():
    bartender.startPump(request.json["pump"])
    return ""

@app.route('/stoppump', methods=['POST'])
def stopPump():
    bartender.stopPump(request.json["pump"])
    return ""

@app.route('/startallpumps', methods=['POST'])
def startAllPumps():
    bartender.startAllPumps()
    return ""

@app.route('/stopallpumps', methods=['POST'])
def stopAllPumps():
    bartender.stopAllPumps()
    return ""
    
if __name__ == "__main__":
    app.run(host="0.0.0.0")
