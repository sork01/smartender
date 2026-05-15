# Smartender

A Raspberry Pi-powered cocktail dispensing machine. Built in 2020.

Python/Flask web app with a web UI for browsing and pouring drinks. Uses peristaltic pumps controlled via GPIO to mix and dispense cocktails.

## Features

- **Drink menu** — Browse and select from a list of supported cocktails (Rum & Coke, Gin & Tonic, Long Island, Screwdriver, etc.)
- **Hard mode** — Pours 1.5x the spirit amount for stronger drinks
- **Custom drinks** — Add your own drink recipes via the web UI
- **Random drink generator** — Generates random cocktail recipes with creative names
- **Pump configuration** — Assign ingredients to pumps and adjust flow rates
- **RGB LED status** — Visual feedback during pouring

## Hardware

- Raspberry Pi (any model with GPIO)
- Peristaltic pumps (one per ingredient)
- RGB LED for status indication
- Relay board or pump driver circuit

## Tech

- **Backend:** Python / Flask
- **Frontend:** HTML, CSS, JavaScript
- **Hardware:** RPi.GPIO for pump control

## Setup

```bash
./install.sh
./run.sh
```

Set `ENV=dev` environment variable to run without actual GPIO hardware (uses fake_rpi for development/testing).
