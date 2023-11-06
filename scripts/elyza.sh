#!/bin/bash
cd ./llama.cpp-master
./main --repeat-last-n 0 --repeat-penalty 1.0 -m 'models/ELYZA-japanese-Llama-2-7b-fast-instruct-q8_0.gguf' -n 256 -p "$1"
cd ..
