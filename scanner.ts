#!/usr/bin/env node
import { Command } from 'commander';
import * as net from 'net';

//creating cli 
const program = new Command();

program
  .name('tcpscan')
  .description('A simple TCP port scanner')
  .argument('<host>', 'Target host (e.g., 127.0.0.1)')
  .option('-s, --start <number>', 'Start port', '20')
  .option('-e, --end <number>', 'End port', '1024')
  .option('-t, --timeout <ms>', 'Timeout per port in milliseconds', '200')
  .parse();

const host = program.args[0];
const options = program.opts();
const startPort = parseInt(options.start);
const endPort = parseInt(options.end);
const timeout = parseInt(options.timeout);

//common tcp ports identifier
function portIdentifier(port: number){
  const ports =[
    [21, 'FTP'],
    [22, 'SSH'],
    [23, 'Telnet'],
    [25, 'SMTP'],
    [53, 'DNS'],
    [80, 'HTTP'],
    [110, 'POP3'],
    [143, 'IMAP'],
    [443, 'HTTPs'],
    [445, 'SMB'],
    [465, 'Message submission over TLS'],
    [587, 'Email Message submission'],
    [993, 'IMAP over SSL'],
    [995, 'POP3 over SSL']
  ]

  for(let i = 0; i < ports.length; i++){
    if(ports[i][0] == port){
      return ports[i][1];
    }
  }

  return null;
}

//function to check if the port is 'open' or 'closed'
function scanPort(host: string, port: number, timeout = 200){
  
  //return if the port is 'open' or 'closed'
  return new Promise <{port: number; status: 'open' | 'closed'}> ((resolve) => {

    const socket = new net.Socket();
    
    socket.on('connect', () => {
      socket.destroy();
      resolve({port, status: 'open'});
    })
   
    socket.on('timeout', () => {
      socket.destroy();
      resolve({port, status: 'closed'});
    }) 

    socket.on('error', () => {
      socket.destroy();
      resolve({port, status: 'closed'});
    })
    
    socket.connect(port, host);

  })
}

//function to check all ports in the range (asynchronously)
async function scanRange(host: string, start: number, end: number, timeout: number){
  
  //new array to store the result of individual scan
  const scans = [];

  for(let port = start; port <= end; port++){
    let newScan = scanPort(host, port, timeout);
    scans.push(newScan);
  }

  const results = await Promise.all(scans);
  let openPorts = results.filter(scan => scan.status == 'open');

  openPorts.forEach(scan=> {
    let p = portIdentifier(scan.port);
    if (p){
      console.log(`Port ${scan.port} (${p})\t: open`);
    }
    else{
      console.log(`Port ${scan.port}\t: open`);
    }

  });

}

console.log(`Starting scan - Host: ${host}`);
scanRange(host, startPort, endPort, timeout);
