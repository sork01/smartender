scp -r * pi@192.168.0.10:~/smartender/
ssh pi@192.168.0.10 "sudo systemctl restart smartender"
