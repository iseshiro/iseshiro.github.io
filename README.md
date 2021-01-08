# 3D Audio Format
## 概要
音楽作品を製作する場合、オーディオシステムの再生環境に合わせて製作することが従来行われてきたが、3Dオーディオ技術を用いた音楽作品製作では3Dオーディオシステム自体が発展途上にあり、再生環境に依存しない作品制作が望ましい。
オブジェクティブ・ベースド・オーディオ技術は再生環境に依存せずに音楽制作を可能とするプラットフォームを提供しうるが、現段階では再生手法に依存するものが多く、また完全に公開されているとは言い難い。
そこで本プロジェクトでは3Dオーディオを用いてコンテンツ製作、システム開発を行うためのオープンソースコミュニティを形成するためのプラットフォームの開発を推進する。
## 記述形式
json形式で記述する。
## 方針
1. どのような3Dオーディオの再生方式（レンダラー）にも対応可能な形式とする
2. わかりやすい文法規則とする
3. 矛盾が生じない文法規則とする
4. 余計な規則を設けず、最小限の文法規則とする
## 一番外側の形式
| key           | value | description | 省略 |
| ----          | ---- | ---- | ---- |
| creator      | [creator format](#creator-format) | 制作者情報の記述形式 | 可 |
| sound motion | [sound motion format](#sound-motion-format) | 音源動作情報の記述形式 | 不可 |
| mic position | [mic position format](#mic-position-format) | マイク位置情報の記述形式 | 不可 |
| reverberation| [reverberation format](#reverberation-format) | 残響成分情報の記述形式 | 可 |

記述例
```
{
 "creator": { creator format },
 "sound motion": { sound motion format },
 "mic position": { mic position format },
 "reverberation": { reverberation format }
}
```
### creator format
制作者情報の記述形式
Ref from: [一番外側の形式](#一番外側の形式)

| key        | value | description |
| ----       | ---- | ---- |
| name       |  文字列 | 氏名          |
| affiliation|  文字列 | 所属          |
| email      |  文字列 | メールアドレス |
| role       |  文字列 | 役割          |
| license    |  文字列 | 著作権の種類   |
複数指定可。
```
"creator":{
  "name":"Shiro Ise",
  "affilation":"Tokyo Denki University",
  "email":"iseshiro@gmail.com",
  "role":"producer",
   "license":"GPL"
}
```
### sound motion format
音源動作情報の記述形式
Ref from: [一番外側の形式](#一番外側の形式)

| key     | value | description |
| ----    | ---- | ---- |
| name    | 文字列 | 音源名     |
| amp     | 実数 | 相対振幅     |
| file path | [file format](#file-format) | ファイル情報の形式 |
| sequence | [sequence format](#sequence-format) | 時系列情報の形式 |
複数指定可。複数指定した場合は加算された信号が用いられる。

### file format
ファイル情報の形式
Ref from: [sound motion format](#sound-motion-format)

| key     | value | description | 省略 |
| ----    | ---- | ---- | ---- |
| full_path  |  文字列 | フルパス名 | 不可 |
| channel   |  整数  | 使用するチャンネル | 省略時は1ch(Lch)が選択される |
| start_time |  文字列（時:分:秒） | ファイル開始時間 | 省略時はファイルに含まれる信号の最初から |
| end_time |  文字列（時:分:秒） | ファイル終了時間 |省略時はファイルに含まれる信号の最後まで |

1. 複数指定可。複数指定した場合は加算された信号が用いられる。
1. ファイルの信号長が短い場合はゼロ詰めされる。
1. ファイルの信号長が長い場合は途中で打ち切られる。

### sequence format
時系列情報の形式
Ref from: [sound motion format](#sound-motion-format)

| key     | value | description |
| ----      | ---- | ---- |
| time     | 文字列（時:分:秒または分:秒）| 動作開始時間 |
| motion | [motion format](#motion-format) | 動作情報の記述形式 |
| comment  | 文字列 | コメント     |
### motion format
動作情報の記述形式
Ref from: [sequence format](#sequence-format)
#### 動作の種類
| value of state | description | additional keys |
| ----      | ---- | ---- |
| [unmoving](#unmoving) | 移動しない | polar position |
| [moveto](#moveto)| 移動する | polar position, orthogonal position, duration |
| [rotate](#rotate) | 回転する | period |
| [random](#random) | ランダムに移動する | duration |
| [stop](#stop) | 終了する | - |
#### unmoving
移動しない
Ref from: [動作の種類](#動作の種類)

| key       | value | description    |
| ----      | ----    | ---- |
| state    | unmoving | 動作開始時間から次の動作開始時間まで移動しないで、position keyで指定された位置に留まる。 |
| polar position | [polar position format](#polar-position-format) | 極座標形式の位置座標 |
最初に必ず記述する。
#### moveto
移動する
Ref from: [動作の種類](#動作の種類)

| key       | value | description    |
| ----      | ----    | ---- |
| state    | moveto | 動作開始時間からpolar(orthogonal) position keyで指定される目標位置に向かって移動する。移動速度はduration keyの時間が経過したときに目標位置に到達するように決められる。|
| polar position | [polar position format](#polar-position-format) | 極座標形式の位置座標 |
| orthogonal position | [orthogonal position format](#orthogonal-position-format) | 直交座標形式の位置座標 |
| duration | 実数 | 目標位置へ到達するまでの時間 |
1. 極座標形式、直交座標形式のどちらかの位置座標を指定する。
1. 移動速度は現在の位置から目標位置への距離÷durationで求められる。
1. 動作開始時間＋durationが次の動作開始時間よりも小さい場合は次の動作開始時間まで目標位置に留まる
1. 動作開始時間＋durationが次の動作開始時間よりも大きい場合は次の動作開始時間に次の動作を始める

#### rotate
回転する
Ref from: [動作の種類](#動作の種類)

| key       | value | description    |
| ----      | ----    | ---- |
| state    | rotate | 動作開始時間からperiod keyで指定される周期で回転する。回転速度はperiodの時間が経過したときに1周するように決められる。|
| period | [period format](#period-format) | 回転周期 |
#### random
ランダムに移動する
Ref from: [動作の種類](#動作の種類)

| key       | value | description    |
| ----      | ----    | ---- |
| state    | random | 動作開始時間からduration keyで指定される時間留まり、次に乱数で指定された水平角および仰角の位置に移動する。距離は変化しない。duration keyで指定される時間留まった後、次の乱数の位置に移動する。|-|
| duration | 実数 | 次の移動まで停止する時間 | - |
#### stop
終了する。最後に必ず記述する。
Ref from: [動作の種類](#動作の種類)
### 座標、周期などの形式
#### polar position format
極座標形式の位置座標
Ref from: [unmoving](#unmoving), [moveto](#moveto), [mic position format](#mic-position-format)

| key       | value | unit | description  |
| ----      | ----                  | ---- | ---- |
| radius    | 0<実数 | m | 原点からの距離         |  |
| azimuth   |  -180<実数<180 | ° |水平角、左右方向の角度、正=右, 負=左 |
| elevation |  -90<実数<90 | ° | 仰角、上下方向の角度、正=上, 負=下 |
省略形 : [radius azimuth elevation]

例

|  記述例       | 省略形 | 説明 |
| ----          | ----          | ---- |
| "radius":1.5, "azimuth":0, "elevation":0 | "[1.5 0 0]" | 距離:1.5m, 方向:正面 |
| "radius":1.5, "azimuth":45, "elevation":0 | "[1.5 45 0]" | 距離:1.5m, 方向:右に45°（右斜め前） |
| "radius":50, "azimuth":-135, "elevation":-30 | "[50 -135 -30]" | 距離:50m、方向:左に135°（左斜め後）、下に30°（斜め下） |
| "radius":5, "azimuth":-135, "elevation":-90 | "[5 -135 -90]" | 距離:5m、方向:下に90°（真下）、真下なので方位角は効果なし |
#### orthogonal position format
直交座標形式の位置座標
Ref from: [moveto](#moveto), [mic position format](#mic-position-format)

| key   | value | unit | description  |
| ----  | ----  | ---- | ---- |
| x | 実数 | m | 左右、 正=右, 負=左 |
| y | 実数 | m | 前後、 正=前, 負=後 |
| z | 実数 | m | 上下、 正=上, 負=下 |
省略形 : [x y z]

例

|  記述例       | 省略形 | 説明 |
| ----          | ----          | ---- |
| "x":1, "y":1, "z":1 | "[1 1 1]" | 右に1m, 前に1m,上に1m |
| "x":-1.5, "y":-2, "z":-1 | "[-1.5 -2 -1]" | 左に1.5m, 後ろに2m,下に1m |
#### period format
回転周期
Ref from: [rotate](#rotate)

| key   | value | unit | description  |
| ----  | ----  | ---- | ---- |
| h | 実数 | s | 水平角周期、極座標の水平方向の偏角が360度増加する時間（秒単位）、正=右, 負=左 |
| v | 実数 | s | 仰角周期、極座標の垂直方向の偏角が360度増加する時間（秒単位）、矢状面ではなく中心をとおる垂直面、正=上, 負=下 |
省略形 : [h v]

例

|  記述例       | 省略形 | 説明 |
| ----          | ----          | ---- |
| "h":4, "v":0 | "[4 0]" | 右方向に回転を開始し、水平方向1周に4秒の回転速度 |
| "h":0, "v":3 | "[0 3]" | 上方向に回転を開始し、垂直方向1周に3秒の回転速度 |
| "h":-1.5, "v":1 | "[-1.5 1]" | 左上方向に回転を開始し、水平方向1周に1.5秒、垂直方向1周に1秒の回転速度 |
| "h":2, "v":-2.5 | "[2 -2.5]" | 右下方向に回転を開始し、水平方向1周に2秒、垂直方向1周に2.5秒の回転速度 |
### mic position format
マイク位置情報の記述形式
Ref from: [一番外側の形式](#一番外側の形式)

| key       | value | description    |
| ----      | ----    | ---- |
| polar position | [polar position format](#polar-position-format) | 極座標形式の位置座標 |
| orthogonal position | [orthogonal position format](#orthogonal-position-format) | 直交座標形式の位置座標 |
1. 極座標形式、直交座標形式のどちらかの形式を用いて位置座標を指定する。
1. 複数指定可。複数指定した場合はそれぞれのmic位置について計算結果が出力される。座標形式はどちらかに統一する。
### reverberation format
残響成分情報の記述形式
Ref from: [一番外側の形式](#一番外側の形式)

| key       | value | description    | 省略時 |
| ----      | ----    | ---- | ---- |
| ir_full_path  |  文字列 | 残響成分インパルス応答のフルパス名 | 省略不可 |
| amp  | 実数 | 残響成分の混合比 | 1.0 |

マイクロホンと同数分の残響成分インパルス応答を指定する。最終的なマイクロホン出力信号に対して、各チャンネルの残響IRが畳み込まれて
加算される。したがって、理論的に正確な残響ではなく、疑似的な残響である。

## sequenceの記述例
例えば、ファイルsound_source_1.wavの15秒目から２（右）チャンネル信号を用いて、
- 時間0秒（音源ファイルの15秒）で移動しない状態で始める
  - 初期位置は距離1.5m、正面から右に15度、仰角0度（水平面）
- 時間1秒（音源ファイルの16秒）から音源は回転をはじめる
  - 回転速度は右に1周30秒の速度
- 時間31秒に音源再生を停止する
  - つまり、ちょうど一周して元の位置に戻った時に音源再生は停止する。
- 最終的に0.8倍されて、要素名"Sound Source Movment 1"のディレクトリに中間出力としてマイクロホン位置での信号が出力される。
```json
{
   "creator":{
      "name":"Shiro Ise",
      "affilation":"Tokyo Denki University",
      "email":"iseshiro@gmail.com",
      "role":"producer",
      "license":"GPL"
   },
   "sound motion":{
      "name":"Sound Source Movment 1",
      "amp":"0.8",
      "file":{
         "name":"sound_source_1.wav",
         "channel":"2",
         "start_time":"0:0:15"
      },
      "sequence":[
         {
            "time":"0:0",
            "motion":{
               "state":"unmoving",
               "polar_position":{
                  "radius":1.5,
                  "azimuth":15,
                  "elevation":0
               }
            },
            "comment":"距離1.5m, 右斜め前（右に15度, 上下方向は0度）"
         },
         {
            "time":"0:01",
            "motion":{
               "state":"rotate",
               "period":{
                  "h":30,
                  "v":0
               }
            },
            "comment":"水平右回転１周"
         },
         {
            "time":"0:31",
            "state":"stop"
         }
      ]
   },
   "mic position":[
      {
         "orthogonal position":{
            "x":0.23,
            "y":0,
            "z":0
         }
      },
      {
         "orthogonal position":{
            "x":-0.23,
            "y":0,
            "z":0
         }
      }
   ],
   "reverberation":[
      {
         "ir_fullpath":"C:\temp\\concert_hall_a\\stage1.wav",
         "amp":0.9
      },
      {
         "ir_fullpath":"C:\temp\\concert_hall_a\\stage2.wav",
         "amp":0.9
      }
   ]
}
```
