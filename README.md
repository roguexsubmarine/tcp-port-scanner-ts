# tcp-port-scanner-ts
simple nmap in Typescript. why? just because.


- Can take upto 3.3 minutes
- 1000 ports x 200ms timeout = 200s (~3.3 minutes)

## Installation
```bash  
git clone https://github.com/roguexsubmarine/tcp-port-scanner-ts.git 
cd tcp-port-scanner-ts
npm install 
npm run build 
sudo npm link
```

## Usage
```bash
tcpscan <host>
```

```bash
tcpscan --help
```

```bash
tcpscan -s 20 -e 450 --timeout 100 www.coeptech.ac.in
```