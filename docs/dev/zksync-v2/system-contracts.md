# Understanding system contracts

In order to keep the zero knowledge circuits as simple as possible and allow easily extensions, a large chunk of the logic of zkSync was moved to so called "system contracts" -- a set of contracts that have special priviliges and that serve special purposes, e.g. deployment of contracts, making sure that the user pays only once for publishing contracts' calldata, etc.

Until the code for the system contracts has gone thorough testing, the code for all the system contracts will not be public. This section will still give you a rough idea of how our system works under the hood. The more detailed description will be available later on down the road.

TODO: add the list of system contracts' descriptions with their addresses.
