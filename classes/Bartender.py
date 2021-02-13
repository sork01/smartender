import json
import threading
import random
import codecs
import copy
import addeddrinks
from importlib import reload  
from classes import Pump
from classes import rgbled

class Bartender:
    pumpConfigFile = "config/pump_config.json"
    led = rgbled.rgbled(17,27,22)
    pumpConfig = json.load(open(pumpConfigFile))
    drinkList = None
    drinkOptions = None
    loadedIngredients = None
    supportedDrinks = []
    pumps = {}
    global drinkjson 

    def __init__(self, drinkList, drinkList2, drinkOptions):
        self.drinkList = drinkList
        self.drinkList2 = drinkList2
        self.tempDrinks =[]
        self.drinkOptions = drinkOptions
        self.populateSupportedDrinks()
        self.setupPumps()
        self.led.run()
        self.stopAllPumps()
        self.initateAddedDrinks()
        

    def populateSupportedDrinks(self):
        self.supportedDrinks = []
        loadedIngredients = [self.pumpConfig[pump]["value"] for pump in self.pumpConfig.keys()]
        for drink in self.drinkList:
            supportedDrink = True
            for ingredient in drink["ingredients"].keys():
                if not ingredient in loadedIngredients:
                    supportedDrink = False
                    break
            if supportedDrink:
                self.supportedDrinks.append(drink)
        for drink in self.drinkList2:
            supportedDrink = True
            for ingredient in drink["ingredients"].keys():
                if not ingredient in loadedIngredients:
                    supportedDrink = False
                    break
            if supportedDrink:
                self.supportedDrinks.append(drink)
        print(loadedIngredients)

    def getSupportedDrinks(self):
        return self.supportedDrinks
        
    def populateRandomDrinks(self):
        adDrinks = []
        for drink in addeddrinks.addedDrinks:
            adDrinks.append(drink)
        return adDrinks
    
    def getAddedDrinks(self):
        reload(addeddrinks)
        return self.populateRandomDrinks()
        

    def getPumpConfig(self):
        return self.pumpConfig

    def getDrinkOptions(self):
        return self.drinkOptions
    
    def setupPumps(self):
        for _, config in self.pumpConfig.items():
            self.pumps[config["value"]] = Pump.Pump(config["pin"], config["flow_rate"])
    
    def updatePumpDrink(self, pumpId, drink):
        self.pumpConfig[pumpId]["value"] = drink
        self.savePumpConfig()
        self.populateSupportedDrinks()
        self.setupPumps()
    
    def savePumpConfig(self):
        with open(self.pumpConfigFile, 'w') as outfile:
            json.dump(self.pumpConfig, outfile, indent=2)

    def getEstimatedPourTime(self, drink):
        pourTime = 0
        for ingredient, amount in drink["ingredients"].items():
            pourTime = max(pourTime, self.pumps[ingredient].getEstimatedPourTime(amount[0]))
        return pourTime
        
    def drink2json(self, drink2):
        res = json.dumps(drink2, indent=4)
        global drinkjson 
        self.drinkjson = res
        
    def getDrinkJson(self):
        global drinkjson
        result = self.drinkjson
        self.drinkjson = ""
        return str(result)

    def pour(self, drinkKey, hard=False):
        t = threading.Thread(target=self.pourInternal, args=(drinkKey, hard))
        t.start()
        return t
    
    def startPump(self, pumpId):
        pumpPin = self.pumpConfig[pumpId]["pin"]
        for ingredient, pump in self.pumps.items():
            if pump.pin == pumpPin:
                pump.start()
                return
    
    def stopPump(self, pumpId):
        pumpPin = self.pumpConfig[pumpId]["pin"]
        for ingredient, pump in self.pumps.items():
            if pump.pin == pumpPin:
                pump.stop()
                return
    
    def startAllPumps(self):
        for ingredient, pump in self.pumps.items():
            pump.start()
    
    def stopAllPumps(self):
        for ingredient, pump in self.pumps.items():
            pump.stop()

    def pourInternal(self, drinkKey, hard):
        drinkFound = False
        threads = []
        if drinkKey == "randoming":
            drink = self.randomIngredients()
            for ingredient, amount in drink["ingredients"].items():
                for name in self.drinkOptions:
                    if ingredient == name["value"]:
                        if hard and (ingredient in ("gin", "vodka", "rum", "tequila", "trisec", "appschnapps", "peachschnaps")):
                            print(ingredient + " har amount " + str(amount))
                            amount = float(amount)*1.5
                            drink["ingredients"][ingredient] = [amount, name["name"]]
                        else:
                            drink["ingredients"][ingredient] = [amount, name["name"]]
            if hard:
                drink["name"] = drink["name"] + " (HM)"
            drink["duration"] = self.getEstimatedPourTime(drink)
            self.drink2json(drink)
            self.led.setSpeed(200)
            for ingredient, amount in drink["ingredients"].items():
                print(ingredient + ":")
                threads.append(self.pumps[ingredient].pour(amount))
            drinkFound = True
        else:   
            for drink in copy.deepcopy(self.supportedDrinks):
                if drink["key"] == drinkKey:
                    for ingredient, amount in drink["ingredients"].items():
                        for name in self.drinkOptions:
                            if ingredient == name["value"]:
                                if hard and (ingredient in ("gin", "vodka", "rum", "tequila", "trisec", "appschnapps", "peachschnaps")):
                                    amount = float(amount)*1.5
                                drink["ingredients"][ingredient] = [amount, name["name"]]
                    if hard:
                        drink["name"] = drink["name"] + " (HM)"
                    drink["duration"] = self.getEstimatedPourTime(drink)
                    self.drink2json(drink)
                    self.led.setSpeed(200)
                    for ingredient, amount in drink["ingredients"].items():
                        print(ingredient + ":")
                        threads.append(self.pumps[ingredient].pour(amount))
                    drinkFound = True
                    break
        for thread in threads:
            thread.join()
        self.led.setSpeed(0.8)
        return drinkFound
        
    def initateAddedDrinks(self):
        f = open("addeddrinks.py", "w")
        str = '''addedDrinks= [
{
    "name": "Test",
    "ingredients": {
        "gin": 1,
        "rum": 1,
        "vodka": 1
    },
    "key": "test"
}
]'''
        f.write(str)
        
    def addDrinkToList(self, drink):
        drink = drink.replace("\'", "\"")
        parsed = json.loads(drink)
        drinksfile = open("drinks2.py", "r")
        lines = drinksfile.readlines()
        lines[0] += (json.dumps(parsed, indent=4) + ",\n")
        drinksfile = open("drinks2.py", "w")
        drinksfile.writelines(lines)

        drinksfile.close()
    
    def drinkGenerator(self):
        result = []
        with codecs.open('words2.txt', encoding='utf-8') as json_file:
            data = json.load(json_file)
            for word in data:
                det = (data["det"])
                adj = (data["adj"])
                noun = (data["noun"])
            
            deter = random.choice(det)
            adje = random.choice(adj)
            nou = random.choice(noun)        
            return (adje + " " + nou)
                
    def randomIngredients(self):
        name = self.drinkGenerator()
        newdrink = {"name": "test", 
                            "ingredients": {}                             
                            }
        newdrink["name"] = name
        spirits = 0
        liquids = 0
        loadedIngredients = [self.pumpConfig[pump]["value"] for pump in self.pumpConfig.keys()]
        ingredients = random.sample(loadedIngredients, k=random.randint(2,6))
        for ingredient in ingredients:
            if ingredient in ("vodka", "gin", "rum", "requila", "trisec", "appschnaps", "peachschnaps"):
                amount = random.randint(1,100)
                if spirits + amount >= 100:
                    amount = 100 - spirits
                    spirits = 100
                else:
                    spirits += amount
            else:
                amount = random.randint(1,300)
                if liquids + amount >= 300:
                    amount = 300 - liquids
                    liquids = 300
                else:
                    liquids += amount
            if amount != 0:
                if amount < 10:
                    amount = 10
                newdrink["ingredients"][ingredient] = amount
        key = newdrink["name"]
        key = key.split(" ")
        newkey = ""
        for i in range(len(key)):
            newkey += key[i][:1].lower()
        newdrink["key"] = newkey 
        f = open("addeddrinks.py","r")
        lines = f.readlines()
        lines[0] += (json.dumps(newdrink, indent=4) + ",\n")
        f = open("addeddrinks.py", "w")
        f.writelines(lines)
        f.close()
        return newdrink
        
    
