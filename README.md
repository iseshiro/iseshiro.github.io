大学のUbuntu PC上で
sudo ufw allow to any port 3001
してから
nohup json-server sample.json --port 3001 -H acoust.ad.dendai.ac.jp &
を起動する。ノートPCはTDU VPN接続をする。

Add new line