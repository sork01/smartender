import random, time
import RPi.GPIO as GPIO
import math
import _thread
import threading
from random import randint


class rgbled:
    _FINISH = False
    RED = None
    GREEN = None
    BLUE = None
    speed = 0.8

    def __init__(self,rpin,gpin,bpin):
        self.rpin = rpin
        self.gpin = gpin
        self.bpin = bpin
        self.freq = 100
        GPIO.setwarnings(False)
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(rpin, GPIO.OUT)
        GPIO.setup(gpin, GPIO.OUT)
        GPIO.setup(bpin, GPIO.OUT)
        self.RED = GPIO.PWM(rpin, self.freq)
        self.GREEN = GPIO.PWM(gpin, self.freq)
        self.BLUE = GPIO.PWM(bpin, self.freq)
        self.redprev = 1
        self.greenprev = 1
        self.blueprev = 1
        self.RED.start(0)
        self.GREEN.start(0)
        self.BLUE.start(0)

    def run(self):
        t = threading.Thread(target=self.changeColor)
        t.start()

    def changeColor(self):
        while True:
            r = randint(0,100)
            g = randint(0,100)
            b = randint(0,100)
            self.changeto(r,g,b,1/self.speed)
            time.sleep(1/self.speed)

    def setSpeed(self, speed):
        self.speed = speed

    def changeto(self,redv,greenv,bluev,speed):
        r = redv
        g = greenv
        b = bluev
        if(r == self.redprev or r == 0):
                rx = self.redprev + 1
        else:
                rx = abs(r-self.redprev)
        if(g == self.greenprev or g == 0):
                gx = self.greenprev + 1
        else:
                gx = abs(g-self.greenprev)
        if(b == self.blueprev or b == 0):
                bx = self.blueprev + 1
        else:
                bx = abs(b-self.blueprev)
        rs = speed/rx
        gs = speed/gx
        bs = speed/bx

        rt = threading.Thread(target=self.changered, args=(r,rs))
        gt = threading.Thread(target=self.changegreen, args=(g,gs))
        bt = threading.Thread(target=self.changeblue, args=(b,bs))
        rt.start()
        gt.start()
        bt.start()
        rt.join()
        gt.join()
        bt.join()

    def changered(self,red,speed):
        if(red > self.redprev):
                for x in range (self.redprev,red):
                    if self._FINISH:
                        break
                    self.RED.ChangeDutyCycle(x)
                    time.sleep(speed)
        else:
                down = self.redprev - red
                if down < 0:
                    down = 0
                for x in range (0,down):
                    if self._FINISH:
                        break
                    elif (self.redprev - x) <= 0:
                        self.RED.ChangeDutyCycle(0)
                    elif (self.redprev - x) >= 100:
                        self.RED.ChangeDutyCycle(100)
                    else:
                        self.RED.ChangeDutyCycle(self.redprev - x )
                        time.sleep(speed)
        self.redprev = red

    def changegreen(self,green,speed):
        if(green > self.greenprev):
                for x in range (self.greenprev,green):
                    if self._FINISH:
                        break
                    self.GREEN.ChangeDutyCycle(x)
                    time.sleep(speed)
        else:
                down = self.greenprev - green
                if down < 0:
                    down = 0
                for x in range (0,down):
                    if self._FINISH:
                        break
                    elif (self.greenprev - x) <= 0:
                        self.GREEN.ChangeDutyCycle(0)
                    elif (self.greenprev - x) >= 100:
                        self.GREEN.ChangeDutyCycle(100)
                    else:
                        self.GREEN.ChangeDutyCycle(self.greenprev - x )
                        time.sleep(speed)
        self.greenprev = green

    def changeblue(self,blue,speed):
        if(blue > self.blueprev):
                for x in range (self.blueprev,blue):
                    if self._FINISH:
                        break
                    self.BLUE.ChangeDutyCycle(x)
                    time.sleep(speed)
        else:
                down = self.blueprev - blue
                if down < 0:
                    down = 0
                for x in range (0,down):
                    if self._FINISH:
                        break
                    elif (self.blueprev - x) <= 0:
                        self.BLUE.ChangeDutyCycle(0)
                    elif (self.blueprev - x) >= 100:
                        self.BLUE.ChangeDutyCycle(100)
                    else:
                        self.BLUE.ChangeDutyCycle(self.blueprev - x )
                        time.sleep(speed)
        self.blueprev = blue

    def on(self,r,g,b,speed):
        self.setup(self.rpin,self.gpin,self.bpin,self.freq)
        time.sleep(0.001)
        self.changeto(r,g,b,speed)
            
    def off(self,speed):
        self.changeto(1,1,1,speed)
        time.sleep(speed)
        self.RED.stop()
        self.GREEN.stop()
        self.BLUE.stop()

    def cleanup(self):
        self.RED.ChangeDutyCycle(0)
        self.GREEN.ChangeDutyCycle(0)
        self.BLUE.ChangeDutyCycle(0)
            #self.RED.stop()
            #self.GREEN.stop()
            #self.BLUE.stop()

    def turnoff(self, condition):
        self._FINISH = condition
