import RPi.GPIO as GPIO
import time
import threading

class Pump:
    pin = 0
    flowRate = 0
    def __init__(self, pin, flowRate):
        self.pin = pin
        self.flowRate = flowRate
        GPIO.setup(pin, GPIO.OUT)

    def getEstimatedPourTime(self, amount):
        return amount/self.flowRate*60

    def pour(self, amount):
        t = threading.Thread(target=self.pourInternal, args=(amount,))
        t.start()
        return t # returning thread in case we want to wait for it to be done in calling function

    def start(self):
        GPIO.output(self.pin, GPIO.HIGH)

    def stop(self):
        GPIO.output(self.pin, GPIO.LOW)
    
    def getPump(self, pin):
        if pin == 24:
            res = "1"
        elif pin == 23:
            res = "2"
        elif pin == 25:
            res = "3"
        elif pin == 8:
            res = "4"
        elif pin == 7:
            res = "5"
        elif pin == 12:
            res = "6"
        return res

    def pourInternal(self, amount):
        GPIO.output(self.pin, GPIO.HIGH)
        print("Pump " + self.getPump(self.pin) + " on Pin " + str(self.pin) + " poured " + str(amount[0]) + " with a flow rate of " + str(self.flowRate))
        time.sleep(amount[0]/self.flowRate*60)
        GPIO.output(self.pin, GPIO.LOW)

    def toString(self):
        return "pin: " + str(self.pin) + ", flowRate: " + str(self.flowRate)
        
    
