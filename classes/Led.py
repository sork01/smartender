import RPi.GPIO as GPIO
import time

class Led:
    pin = 0
    flow_rate = 0
    def __init__(self, pin, flow_rate):
        self.pin = pin
        self.flow_rate = flow_rate
        GPIO.setup(pin, GPIO.OUT)
    
    def run(self, time_to_glow):
        print("Set " + str(self.pin) + " high")
        GPIO.output(self.pin, GPIO.HIGH)
        time.sleep(self.flow_rate*time_to_glow)
        GPIO.output(self.pin, GPIO.LOW)
        print("hej " + str(self.pin) + " " + str(self.flow_rate*time_to_glow))
