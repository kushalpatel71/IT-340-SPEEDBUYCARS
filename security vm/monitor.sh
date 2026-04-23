#!/bin/bash
echo "===== SECURITY VM STATUS ====="
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
ps aux --sort=-%cpu | head -10
echo
echo "ACTIVE SSH CONNECTIONS:"
who
echo
echo "RECENT LOGINS:"
last -n 10
echo
echo "FAILED LOGIN ATTEMPTS:"
sudo grep "Failed password" /var/log/auth.log | tail -20
