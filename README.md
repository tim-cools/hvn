# HVN - Abelton Controller

## Goal

A user friendly remote view of the Ableton session view which supports multiple tracks (with audio, midi, fx automation) per deck.
 
## Architecture

Ableton <--(m4l/js/udp)--> server (python) <--(websockets)--> browser (react)

## Work in progress

Works:
- Communication between ableton/server/browser
- Very basic UI to send and viualize get/info

Not tested, works on my machine ;-)