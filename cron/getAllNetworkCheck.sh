croncmd="curl http://localhost:5000/getAllNetwork >/dev/null 2>&1"
cronjob="*/30 * * * * $croncmd"
( crontab -l | grep -v -F "$croncmd" ; echo "$cronjob" ) | crontab -
