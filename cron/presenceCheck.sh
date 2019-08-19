#croncmd="curl http://localhost:5000/presenceMobiles >/dev/null 2>&1"
#cronjob="*/5 * * * * $croncmd"
#( crontab -l | grep -v -F "$croncmd" ; echo "$cronjob" ) | crontab -
