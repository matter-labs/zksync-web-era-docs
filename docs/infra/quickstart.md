---
head:
  - - meta
    - name: "twitter:title"
      content: Quickstart | zkSync Docs
---

# Quick Start Guide for zkSync Node

## Prerequisites

- **Installations Required:**
  - [Docker](https://docs.docker.com/get-docker/)
  - [Docker Compose](https://docs.docker.com/compose/install/)

## Setup Instructions

1. Clone the zkSync Era repository and navigate to the external node guide:

   ```
   git clone https://github.com/matter-labs/zksync-era.git
   cd zksync-era/docs/guides/external-node
   ```

## Running a zkSync Node Locally

### Starting the Node

- **For a Mainnet instance:**

  ```sh
  cd docker-compose-examples
  docker compose --file mainnet-external-node-docker-compose.yml up
  ```

- **For a Testnet instance:**

  ```sh
  cd docker-compose-examples
  docker compose --file testnet-external-node-docker-compose.yml up
  ```

### Resetting the Node State

- **For a Mainnet instance:**

  ```sh
  cd docker-compose-examples
  docker compose --file mainnet-external-node-docker-compose.yml down --volumes
  ```

- **For a Testnet instance:**

  ```sh
  cd docker-compose-examples
  docker compose --file testnet-external-node-docker-compose.yml down --volumes
  ```

### Monitoring Node Status

Access the local Grafana dashboard to see the node status after recovery:
[Local Grafana Dashboard](http://localhost:3000/d/0/external-node).

### API Access

- **HTTP JSON-RPC API:** Port `3060`
- **WebSocket API:** Port `3061`

### Important Notes

- **Initial Recovery:** The node will recover from a snapshot on its first run, which may take up to 10 hours. During this period, the API server will not serve any requests.
- **Historical Data:** For access to historical transaction data, consider recovery from DB dumps. Refer to the Advanced Setup section for more details.
- **DB Dump:** For nodes that operate from a DB dump, which allows starting a zkSync node with a full historical transactions history, refer to the documentation on running from DB dumps at [03_running.md](https://github.com/matter-labs/zksync-era/blob/main/docs/guides/external-node/03_running.md).

## System Requirements

The following are minimal requirements:

- **CPU:** A relatively modern CPU is recommended.
- **RAM:** 32 GB
- **Storage:**
  - **Testnet Nodes:** 30 GB
  - **Mainnet Nodes:** 300 GB, with the state growing about 1TB per month.
- **Network:** 100 Mbps connection (1 Gbps+ recommended)

## Advanced Setup

For additional configurations like monitoring, backups, recovery from DB dump or snapshot, and custom PostgreSQL settings, please refer to the [ansible-en-role repository](https://github.com/matter-labs/ansible-en-role).
