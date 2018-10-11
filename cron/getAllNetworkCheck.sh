croncmd="curl http://localhost:5000/getAllNetwork 2>&1"
cronjob="*/3 * * * * $croncmd"
( crontab -l | grep -v -F "$croncmd" ; echo "$cronjob" ) | crontab -