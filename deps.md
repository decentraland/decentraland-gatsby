# Deps decentraland-gatsbt<>decentraland-dapps

```mermaid
graph LR;
    dgatsby[decentraland-gatsby] --> dcommons[decentraland-commons];
    dgatsby --> dcryptomidw[decentraland-crypto-middleware];
    dgatsby --> dserver[decentraland-server];
    dgatsby --> duienv[@dcl/ui-env];
    dgatsby --> dsso[@dcl/single-sign-on-client];
    dgatsby --> dschemas[@dcl/schemas];
    dgatsby --> dcrypto[@dcl/crypto];
    dgatsby --> ddapps[decentraland-dapps];
    ddapps --> ui[decentraland-ui];
    ddapps --> dconnect[decentraland-connect];
    ddapps --> dcryptofetch[decentraland-crypto-fetch];
    ddapps --> dtx[decentraland-transactions];
    ddapps --> dcclient[dcl-catalyst-client];
    ddapps --> dcrypto;
    ddapps --> duienv;
    ddapps --> dschemas;
    ui --> dschemas;
    ui --> duienv;
    dconnect --> dschemas;
    dconnect --> dsso;
    dcrypto --> dschemas;
    dcryptomidw --> dcrypto;
    dcryptofetch --> dcrypto;
```
