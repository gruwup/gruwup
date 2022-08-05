#!/bin/bash
clear
echo "Starting shell ....";
cd C:/Users/Sijan/.android/avd;
emulator -list-avds;
emulator -avd Gruwup_Test -wipe-data;
$SHELL