#!/bin/bash
#
# dora-agent に発話リクエストを送信する
#

curl -s -X POST -d "{\"text\":\"$1\"}" http://$DORA_AGENT_HOST/utterance
