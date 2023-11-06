# ELYZA Llama2 Chat Sample

[llama.cpp](https://github.com/ggerganov/llama.cpp) と [ELYZA](https://huggingface.co/elyza/ELYZA-japanese-Llama-2-7b-fast-instruct) を使用したサンプルチャットアプリです。簡単な会話なら M1 Max で数秒で応答するようです。

```sh
$ npm -s start
2023-11-06T12:58:15.695Z
> こんにちは
2023-11-06T12:58:19.578Z
こんにちは。
私はELYZAによって訓練されたAIであるELYZA-AIです。
あなたは何に対し質問しますか？

2023-11-06T12:58:21.180Z
> 富士山の高さ
2023-11-06T12:58:29.325Z
富士山の標高は3,776メートルです。

2023-11-06T12:58:30.476Z
> 
```

参考：[M1/M2 Macのローカルで日本語対応のLLMを実行する(ELYZA版)](https://zenn.dev/michy/articles/d13d24e5f19c56)

## 準備

```sh
# make コマンドの確認
make --version

# llama.cppプロジェクトのダウンロード
curl -L -o ./work/llama.zip https://github.com/ggerganov/llama.cpp/archive/refs/heads/master.zip

# llama.zip の解凍
unzip ./work/llama.zip

# ディレクトリの移動
pushd llama.cpp-master

# matalでビルド(macの場合)
LLAMA_METAL=1 make

# その他のOSの場合は make

# ディレクトリを戻る
popd
```

[https://huggingface.co/mmnga/ELYZA-japanese-Llama-2-7b-fast-instruct-gguf/tree/main](https://huggingface.co/mmnga/ELYZA-japanese-Llama-2-7b-fast-instruct-gguf/tree/main) から [ELYZA-japanese-Llama-2-7b-fast-instruct-q8_0.gguf](https://huggingface.co/mmnga/ELYZA-japanese-Llama-2-7b-fast-instruct-gguf/blob/main/ELYZA-japanese-Llama-2-7b-fast-instruct-q8_0.gguf) をダウンロードする。

ダウンロードした　ELYZA-japanese-Llama-2-7b-fast-instruct-q8_0.gguf を ./llama.cpp-master/models に移動する。

## 実行方法

[nodejs](https://nodejs.org/en) が必要です。

```sh
# サンプルアプリの実行
$ npm -s start
```
