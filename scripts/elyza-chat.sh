#!/bin/bash
#
# ELYZA に問い合わせを行う
#

cd ./llama.cpp-master
./main --interactive-first -m 'models/ELYZA-japanese-Llama-2-7b-fast-instruct-q8_0.gguf' -n 256
