% Software Radio with CTypes
% T M Winningham
% July 27, 2014

# Overview

- What is the device?
- Base project software
- Scripting with CTypes

# Introducing the device

## SDR concept
### Software radio on Wikipedia
### Like a soundcard for radio waves
- http://whiteboard.ping.se/SDR/IQ
### USRP and GNU-Radio, Funcube, SoftRock
### Waterfall spectrum analyzer
### WebSDR
- http://websdr.ewi.utwente.nl:8901/
### Simply?

## Origin of RTL-SDR
### DVB-T TV tuner linux drivers
### Debug mode
### Linux-tv IRC and mailing list

## Today in RTL-SDR
### Vibrant community
- http://www.reddit.com/r/rtlsdr
- http://www.rtl-sdr.com/
- http://rtlsdr.org/
### Projects
- ADS-B aircraft data, AIS maritime tracking
- NOAA weather satellite reception
- Radio scanner, Pagers
- Amateur Radio
- High altitude balloons
- Radio astronomy
- Ambiant radio analysis

# The RTL-FM command
## RTL-SDR Project
## Basic Usage

# Creating a CTypes wrapper

## Reading the RTL-FM source
### Limited C experience
### Lucky the code is straightforward

## Rewriting RTL-FM
### Identifying blocks of related code
### Turning that code into functions
### Grouping the functions in order back together
### Compiling as a shared object

## Compilation

    gcc -I /usr/include/libusb-1.0 -I ./convenience/ -I ./getopt -shared -Wl,-soname,rtl_fm_python -o rtl_fm_python.so -fPIC rtl_fm_python.c convenience/convenience.c getopt/getopt.c -lrtlsdr

## simplest first test

    uint32_t lib_get_frequency(){
        return controller.freqs[controller.freq_now];
    }

### Loading with CTypes
    
    
## Rewriting the rewrite
### Segfaults and patience
### Finding the bare minimum

# Now the library

## Web Interface
## Interactive commands

