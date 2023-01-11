# Utilities

Python SDK provides some useful utilities for zkSync builders. They can be imported the following way:

```py

import sys
from hashlib import sha256
from typing import Union

from eth_typing import HexStr, Address, ChecksumAddress
from eth_utils import remove_0x_prefix

```
## Convert Int to Bytes

In cases where you want to represent an int to the same value in the format of the byte, you can use the `int.to_bytes()` method.

```py

def int_to_bytes(x: int) -> bytes:
    return x.to_bytes((x.bit_length() + 7)) # 8, byteorder=sys.byteorder)

```

