# IPFS-setup

Hello world ipfs setup using aws ec2 instance.

curl -s https://ip-ranges.amazonaws.com/ip-ranges.json| jq -r ".prefixes[] | select(.region==\"$AWS_REGION\") | select(.service==\"EC2_INSTANCE_CONNECT\") | .ip_prefix"

-> [cloudshell-user@ip-10-132-39-47 ~]$ curl -s https://ip-ranges.amazonaws.com/ip-ranges.json| jq -r ".prefixes[] | select(.region==\"$AWS_REGION\") | select(.service==\"EC2_INSTANCE_CONNECT\") | .ip_prefix"
18.206.107.24/29
[cloudshell-user@ip-10-132-39-47 ~]$

//18.206.107.24/29

//ipfs kubo requires 2 core cpu (kubo is highly parallel)
// 6gb of memory
