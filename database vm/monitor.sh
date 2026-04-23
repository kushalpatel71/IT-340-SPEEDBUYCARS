#!/bin/bash
echo "===== DATABASE VM STATUS ====="
date
echo
echo "HOSTNAME:"
hostname
echo
echo "IP ADDRESS:"
hostname -I
echo
echo "UPTIME:"
uptime
echo
echo "MEMORY:"
free -h
echo
echo "DISK:"
df -h
echo
echo "TOP PROCESSES:"
ps aux --sort=-%mem | head -10
echo
echo "MONGODB STATUS:"
sudo systemctl status mongod --no-pager
echo
echo "PORT 27017 CHECK:"
ss -tulnp | grep 27017
echo
echo "RECENT LOGINS:"
last -n 5
echo
echo "FAILED LOGIN ATTEMPTS:"
sudo grep "Failed password" /var/log/auth.log | tail -10
