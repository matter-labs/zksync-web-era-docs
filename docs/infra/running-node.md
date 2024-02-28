head:
  - - meta
    - name: "twitter:title"
      content: Running an External Node | zkSync Documentation
Running an External Node
This guide outlines the steps and requirements for running an external node for zkSync, following the preparation of a configuration file as detailed in the preceding documentation.

Hardware Recommendations
The hardware specifications provided below are approximate; updates may occur as system requirements evolve.

Minimum Hardware Requirements
CPU: 32 cores
Memory: 64GB RAM
Storage:
SSD: NVMe is recommended for optimal performance.
Testnet: Approximately 800 GB (subject to increase over time; continuous monitoring is advised).
Mainnet: Approximately 400 GB (subject to increase over time; continuous monitoring is advised).
Network: 100 Mbps connection.
PostgreSQL Storage Considerations
The call_traces table, primarily used for debugging, can significantly consume storage space. If the debug namespace is not in use, you can manage space by:

Executing DELETE FROM call_traces; to clear the table.
Disabling the debug namespace via the EN_API_NAMESPACES environment variable, as demonstrated in the configuration examples.
Infrastructure Setup
PostgreSQL Server
A PostgreSQL server with SSD storage is required, with capacity considerations as follows:

Testnet: Around 1TB (with potential growth; monitor regularly).
Mainnet: Around 2TB (with potential growth; monitor regularly).
While setting up PostgreSQL exceeds the scope of this documentation, Docker is a popular deployment option. Comprehensive guides are available, such as this tutorial on using the Postgres Docker image.

Note: Stand-alone Docker images of Postgres (not part of a Docker-compose network) will require network configuration adjustments to allow EN (External Node) connectivity:

On Linux, use --network host.
Alternatively, replace localhost with host.docker.internal in the EN configuration to facilitate connection from containers to the host service. For more details, visit Docker networking documentation.
To import a database dump for a specific environment, use the command: pg_restore -O -C <DUMP_PATH> --dbname=<DB_URL>.

Node Operation
With the EN Docker image, an environment file for configuration, and a restored database from a dump, you're ready to launch the node.

Example Launch Command:
docker run --env-file <path_to_env_file> --mount type=bind,source=<local_rocksdb_data_path>,target=<configured_rocksdb_data_path> <image>
Future documentation will cover Helm charts and additional infrastructure configuration options.

Initial Start-Up
The initial launch synchronizes the PostgreSQL state with the absent RocksDB state, primarily the Merkle tree. This synchronization, dependent on hardware, may exceed 20 hours for mainnet setups.

Node Update with New PostgreSQL Dump
To update the EN with a new PostgreSQL dump:

Terminate the EN process.
Clear the SK cache at EN_STATE_CACHE_PATH.
Remove the existing database.
Restore the database using the new dump.
Restart the EN.
Further details on node monitoring and state analysis are available in the observability section.
