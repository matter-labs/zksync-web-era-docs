---
head:
  - - meta
    - name: "twitter:title"
      content: Precompiles | zkSync Docs
---

# Precompiles

Precompiled contracts for elliptic curve operations are required in order to perform zkSNARK verification.

The operations that you need to be able to perform are elliptic curve point addition, elliptic curve point scalar
multiplication, and elliptic curve pairing.

This document explains the precompiles responsible for elliptic curve point addition and scalar multiplication and the
design decisions. You can read the specification [here](https://eips.ethereum.org/EIPS/eip-196).

## Introduction

On top of having a set of opcodes to choose from, the EVM also offers a set of more advanced functionalities through precompiled contracts. These are a special kind of contracts that are bundled with the EVM at fixed addresses and can be called with a determined gas cost. The addresses start from `1`, and increment for each contract.

New hard forks may introduce new precompiled contracts. They are called from the opcodes like regular contracts, with instructions like `CALL`. The gas cost mentioned here is purely the cost of the contract. It does not consider the cost of the call itself
nor the instructions to put the parameters in memory.

For `Go-Ethereum`, the code being run is written in Go, and the gas costs are defined in each precompile spec.

## Field Arithmetic

The BN254 (also known as alt-BN128) is an elliptic curve defined by the equation $y^2 = x^3 + 3$ over the finite field
$\mathbb{F}_p$, being $p = 218882428718392752222464057452572750886963111572978236626890378946452262$08583. The modulus
is less than 256 bits, which is why every element in the field is represented as a `uint256`.

The arithmetic is carried out with the field elements encoded in the Montgomery form. This is done not only because
operating in the Montgomery form speeds up the computation but also because the native modular multiplication, which is
carried out by Yul's `mulmod` opcode, is very inefficient.

Instructions set on zkSync and EVM are different, so the performance of the same Yul/Solidity code can be efficient on
EVM, but not on zkEVM and opposite.

One such very inefficient command is `mulmod`. On EVM there is a native opcode that makes modulo multiplication and it
costs only 8 gas, which compared to the other opcodes costs is only 2-3 times more expensive. On zkEVM we don’t have
native `mulmod` opcode, instead, the compiler does full-with multiplication (e.g. it multiplies two `uint256`s and gets
as a result an `uint512`). Then the compiler performs long division for reduction (but only the remainder is kept), in
the generic form it is an expensive operation and costs many opcode executions, which can’t be compared to the cost of
one opcode execution. The worst thing is that `mulmod` is used a lot for the modulo inversion, so optimizing this one
opcode gives a huge benefit to the precompiles.

### Multiplication

As said before, multiplication was carried out by implementing the Montgomery reduction, which works with general moduli
and provides a significant speedup compared to the naïve approach.

The squaring operation is obtained by multiplying a number by itself. However, this operation can have an additional
speedup by implementing the SOS Montgomery squaring.

### Inversion

Inversion was performed using the extended binary Euclidean algorithm (also known as extended binary greatest common
divisor). This algorithm is a modification of Algorithm 3 `MontInvbEEA` from
[Montgomery inversion](https://cetinkayakoc.net/docs/j82.pdf).

### Exponentiation

The exponentiation was carried out using the square and multiply algorithm, which is a standard technique for this
operation.

## Montgomery Form

Let’s take a number `R`, such that `gcd(N, R) == 1` and `R` is a number by which we can efficiently divide and take
module over it (for example power of two or better machine word, aka 2^256). Then transform every number to the form of
`x * R mod N` / `y * R mod N` and then we get efficient modulo addition and multiplication. The only thing is that
before working with numbers we need to transform them to the form from `x mod N` to the `x * R mod N` and after
performing operations transform the form back.

For the latter, we will assume that `N` is the module that we use in computations, and `R` is $2^{256}$, since we can
efficiently divide and take module over this number and it practically satisfies the property of `gcd(N, R) == 1`.

### Montgomery Reduction Algorithm (REDC)

> Reference: <https://en.wikipedia.org/wiki/Montgomery_modular_multiplication#The_REDC_algorithm>

```solidity
/// @notice Implementation of the Montgomery reduction algorithm (a.k.a. REDC).
/// @dev See <https://en.wikipedia.org/wiki/Montgomery_modular_multiplication#The_REDC_algorithm>
/// @param lowestHalfOfT The lowest half of the value T.
/// @param higherHalfOfT The higher half of the value T.
/// @return S The result of the Montgomery reduction.
function REDC(lowestHalfOfT, higherHalfOfT) -> S {
    let q := mul(lowestHalfOfT, N_PRIME())
    let aHi := add(higherHalfOfT, getHighestHalfOfMultiplication(q, P()))
    let aLo, overflowed := overflowingAdd(lowestHalfOfT, mul(q, P()))
    if overflowed {
        aHi := add(aHi, 1)
    }
    S := aHi
    if iszero(lt(aHi, P())) {
        S := sub(aHi, P())
    }
}

```

By choosing $R = 2^{256}$ we avoided 2 modulo operations and one division from the original algorithm. This is because
in Yul, native numbers are uint256 and the modulo operation is native, but for the division, as we work with a 512-bit
number split into two parts (high and low part) dividing by $R$ means shifting 256 bits to the right or what is the
same, discarding the low part.

### Montgomery Addition/Subtraction

Addition and subtraction in Montgomery form are the same as ordinary modular addition and subtraction because of the
distributive law

$$
\begin{align*}
aR+bR=(a+b)R,\\
aR-bR=(a-b)R.
\end{align*}
$$

```solidity
/// @notice Computes the Montgomery addition.
/// @dev See <https://en.wikipedia.org/wiki/Montgomery_modular_multiplication#The_The_REDC_algorithm> for further details on the Montgomery multiplication.
/// @param augend The augend in Montgomery form.
/// @param addend The addend in Montgomery form.
/// @return ret The result of the Montgomery addition.
function montgomeryAdd(augend, addend) -> ret {
    ret := add(augend, addend)
    if iszero(lt(ret, P())) {
        ret := sub(ret, P())
    }
}

/// @notice Computes the Montgomery subtraction.
/// @dev See <https://en.wikipedia.org/wiki/Montgomery_modular_multiplication#The_The_REDC_algorithm> for further details on the Montgomery multiplication.
/// @param minuend The minuend in Montgomery form.
/// @param subtrahend The subtrahend in Montgomery form.
/// @return ret The result of the Montgomery addition.
function montgomerySub(minuend, subtrahend) -> ret {
    ret := montgomeryAdd(minuend, sub(P(), subtrahend))
}

```

We do not use `addmod`. That's because in most cases the sum does not exceed the modulus.

### Montgomery Multiplication

The product of $aR \mod N$ and $bR \mod N$ is $REDC((aR \mod N)(bR \mod N))$.

```solidity
/// @notice Computes the Montgomery multiplication using the Montgomery reduction algorithm (REDC).
/// @dev See <https://en.wikipedia.org/wiki/Montgomery_modular_multiplication#The_The_REDC_algorithm> for further details on the Montgomery multiplication.
/// @param multiplicand The multiplicand in Montgomery form.
/// @param multiplier The multiplier in Montgomery form.
/// @return ret The result of the Montgomery multiplication.
function montgomeryMul(multiplicand, multiplier) -> ret {
    let hi := getHighestHalfOfMultiplication(multiplicand, multiplier)
    let lo := mul(multiplicand, multiplier)
    ret := REDC(lo, hi)
}

```

### Montgomery Inversion

```solidity
/// @notice Computes the Montgomery modular inverse skipping the Montgomery reduction step.
/// @dev The Montgomery reduction step is skipped because a modification in the binary extended Euclidean algorithm is used to compute the modular inverse.
/// @dev See the function `binaryExtendedEuclideanAlgorithm` for further details.
/// @param a The field element in Montgomery form to compute the modular inverse of.
/// @return invmod The result of the Montgomery modular inverse (in Montgomery form).
function montgomeryModularInverse(a) -> invmod {
    invmod := binaryExtendedEuclideanAlgorithm(a)
}
```

As said before, we use a modified version of the bEE algorithm that lets us “skip” the Montgomery reduction step.

The regular algorithm would be $REDC((aR \mod N)^{−1}(R^3 \mod N))$ which involves a regular inversion plus a
multiplication by a value that can be precomputed.
