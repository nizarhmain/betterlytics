# Betterlytics - Production setup

## Prerequisites

Ensure you have git installed

## Clone Betterlytics

Clone the repository:\
`$ git clone https://github.com/betterlytics/betterlytics.git`

## Setup the .env

Create a file called `.env` file in the Betterlytics repository root folder.\
Copy the content of `.env.production` into the `.env` file, and update the variables to your needs.

## Install Docker + Docker Compose

I installed docker through: "[Install using the repository](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)"

## Add certificates

### Install certbot

`$ snap install --classic certbot`

### Fetch certificates

Note - currently, you need to uncomment the HTTPS part of the NGINX config to get the proxy up running before running:
`$ certbot certonly --webroot -w ./ssl/certbot -d {domain} -v`

Note - you need to then update the `ssl_certificate` paths in the NGINX config to match the domain used

## Common issues

### Privelege mismatch

Sometimes folders, such as logging folders, may have incorrect initial priveleges

### Proxy stops immediately

You need to already have the certificates locally, before you can run the `certbot`

As previously mentioned, if you do not already have the certificates, outcomment the HTTPS part of the server, before running the `acme-challenge`
