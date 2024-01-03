---
head:
  - - meta
    - name: "twitter:title"
      content: EVM | zkSync Docs
---

# EVM

# Native EVM Instructions

Such instructions are grouped into the following categories according to
[the original reference](https://www.evm.codes/):

- [Arithmetic](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/instructions/evm/arithmetic.md)
- [Logical](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/instructions/evm/logical.md)
- [Bitwise](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/instructions/evm/bitwise.md)
- [SHA3](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/instructions/evm/sha3.md)
- [Environment](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/instructions/evm/environment.md)
- [Block](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/instructions/evm/block.md)
- [Stack](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/instructions/evm/stack.md)
- [Memory](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/instructions/evm/memory.md)
- [Logging](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/instructions/evm/logging.md)
- [Call](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/instructions/evm/call.md)
- [Create](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/instructions/evm/create.md)
- [Return](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/instructions/evm/return.md)

## EraVM Assembly

Assembly emitted for LLVM standard library functions depends on available optimizations which differ between versions.
If there is no assembly example under an instruction, compile a reproducing contract with the latest version of
`zksolc`.

# Arithmetic

# [ADD](https://www.evm.codes/#01?fork=shanghai)

### LLVM IR

```llvm
%addition_result = add i256 %value1, %value2
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/arithmetic.rs#L15) is common for Yul and EVMLA representations.

[LLVM IR instruction documentation](https://releases.llvm.org/15.0.0/docs/LangRef.html#add-instruction)

### EraVM Assembly

```nasm
add     r1, r2, r1
```

# [MUL](https://www.evm.codes/#02?fork=shanghai)

### Differences from EVM

1. The carry is written to the 2nd output register

### LLVM IR

```llvm
%multiplication_result = mul i256 %value1, %value2
```

EraVM can output the carry of the multiplication operation. In this case, the result is a tuple of two values: the multiplication result and the carry. The carry is written to the 2nd output register.
The snippet below returns the carry value.

```llvm
%value1_extended = zext i256 %value1 to i512
%value2_extended = zext i256 %value2 to i512
%result_extended = mul nuw i512 %value1_extended, %value2_extended
%result_shifted = lshr i512 %result_extended, 256
%result = trunc i512 %result_shifted to i256
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/arithmetic.rs#L53) is common for Yul and EVMLA representations.

[LLVM IR instruction documentation](https://releases.llvm.org/15.0.0/docs/LangRef.html#mul-instruction)

### EraVM Assembly

```nasm
mul     r1, r2, r1, r2
```

# [SUB](https://www.evm.codes/#03?fork=shanghai)

### LLVM IR

```llvm
%subtraction_result = sub i256 %value1, %value2
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/arithmetic.rs#L34) is common for Yul and EVMLA representations.

[LLVM IR instruction documentation](https://releases.llvm.org/15.0.0/docs/LangRef.html#sub-instruction)

### EraVM Assembly

```nasm
sub     r1, r2, r1
```

# [DIV](https://www.evm.codes/#04?fork=shanghai)

### Differences from EVM

1. The remainder is written to the 2nd output register

### LLVM IR

```llvm
define i256 @__div(i256 %arg1, i256 %arg2) #0 {
entry:
  %is_divider_zero = icmp eq i256 %arg2, 0
  br i1 %is_divider_zero, label %return, label %division

division:
  %div_res = udiv i256 %arg1, %arg2
  br label %return

return:
  %res = phi i256 [ 0, %entry ], [ %div_res, %division ]
  ret i256 %res
}
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/arithmetic.rs#L73) is common for Yul and EVMLA representations.

[LLVM IR instruction documentation](https://releases.llvm.org/15.0.0/docs/LangRef.html#udiv-instruction)

# [SDIV](https://www.evm.codes/#05?fork=shanghai)

### LLVM IR

```llvm
define i256 @__sdiv(i256 %arg1, i256 %arg2) #0 {
entry:
  %is_divider_zero = icmp eq i256 %arg2, 0
  br i1 %is_divider_zero, label %return, label %division_overflow

division_overflow:
  %is_divided_int_min = icmp eq i256 %arg1, -57896044618658097711785492504343953926634992332820282019728792003956564819968
  %is_minus_one = icmp eq i256 %arg2, -1
  %is_overflow = and i1 %is_divided_int_min, %is_minus_one
  br i1 %is_overflow, label %return, label %division

division:
  %div_res = sdiv i256 %arg1, %arg2
  br label %return

return:
  %res = phi i256 [ 0, %entry ], [ %arg1, %division_overflow ], [ %div_res, %division ]
  ret i256 %res
}
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/arithmetic.rs#L162) is common for Yul and EVMLA representations.

[LLVM IR instruction documentation](https://releases.llvm.org/15.0.0/docs/LangRef.html#sdiv-instruction)

# [MOD](https://www.evm.codes/#06?fork=shanghai)

### Differences from EVM

1. The remainder is written to the 2nd output register

### LLVM IR

```llvm
define i256 @__mod(i256 %arg1, i256 %arg2) #0 {
entry:
  %is_divider_zero = icmp eq i256 %arg2, 0
  br i1 %is_divider_zero, label %return, label %remainder

remainder:
  %rem_res = urem i256 %arg1, %arg2
  br label %return

return:
  %res = phi i256 [ 0, %entry ], [ %rem_res, %remainder ]
  ret i256 %res
}
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/arithmetic.rs#L117) is common for Yul and EVMLA representations.

[LLVM IR instruction documentation](https://releases.llvm.org/15.0.0/docs/LangRef.html#urem-instruction)

# [SMOD](https://www.evm.codes/#07?fork=shanghai)

### LLVM IR

```llvm
define i256 @__smod(i256 %arg1, i256 %arg2) #0 {
entry:
  %is_divider_zero = icmp eq i256 %arg2, 0
  br i1 %is_divider_zero, label %return, label %division_overflow

division_overflow:
  %is_divided_int_min = icmp eq i256 %arg1, -57896044618658097711785492504343953926634992332820282019728792003956564819968
  %is_minus_one = icmp eq i256 %arg2, -1
  %is_overflow = and i1 %is_divided_int_min, %is_minus_one
  br i1 %is_overflow, label %return, label %remainder

remainder:
  %rem_res = srem i256 %arg1, %arg2
  br label %return

return:
  %res = phi i256 [ 0, %entry ], [ 0, %division_overflow ], [ %rem_res, %remainder ]
  ret i256 %res
}
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/arithmetic.rs#L236) is common for Yul and EVMLA representations.

[LLVM IR instruction documentation](https://releases.llvm.org/15.0.0/docs/LangRef.html#srem-instruction)

# [ADDMOD](https://www.evm.codes/#08?fork=shanghai)

### LLVM IR

```llvm
define i256 @__addmod(i256 %arg1, i256 %arg2, i256 %modulo) #0 {
entry:
  %is_zero = icmp eq i256 %modulo, 0
  br i1 %is_zero, label %return, label %addmod

addmod:
  %arg1m = urem i256 %arg1, %modulo
  %arg2m = urem i256 %arg2, %modulo
  %res = call {i256, i1} @llvm.uadd.with.overflow.i256(i256 %arg1m, i256 %arg2m)
  %sum = extractvalue {i256, i1} %res, 0
  %obit = extractvalue {i256, i1} %res, 1
  %sum.mod = urem i256 %sum, %modulo
  br i1 %obit, label %overflow, label %return

overflow:
  %mod.inv = xor i256 %modulo, -1
  %sum1 = add i256 %sum, %mod.inv
  %sum.ovf = add i256 %sum1, 1
  br label %return

return:
  %value = phi i256 [0, %entry], [%sum.mod, %addmod], [%sum.ovf, %overflow]
  ret i256 %value
}
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/math.rs#L16) is common for Yul and EVMLA representations.

# [MULMOD](https://www.evm.codes/#09?fork=shanghai)

### LLVM IR

```llvm
define i256 @__mulmod(i256 %arg1, i256 %arg2, i256 %modulo) #0 {
entry:
  %cccond = icmp eq i256 %modulo, 0
  br i1 %cccond, label %ccret, label %entrycont

ccret:
  ret i256 0

entrycont:
  %arg1m = urem i256 %arg1, %modulo
  %arg2m = urem i256 %arg2, %modulo
  %less_then_2_128 = icmp ult i256 %modulo, 340282366920938463463374607431768211456
  br i1 %less_then_2_128, label %fast, label %slow

fast:
  %prod = mul i256 %arg1m, %arg2m
  %prodm = urem i256 %prod, %modulo
  ret i256 %prodm

slow:
  %arg1e = zext i256 %arg1m to i512
  %arg2e = zext i256 %arg2m to i512
  %prode = mul i512 %arg1e, %arg2e
  %prodl = trunc i512 %prode to i256
  %prodeh = lshr i512 %prode, 256
  %prodh = trunc i512 %prodeh to i256
  %res = call i256 @__ulongrem(i256 %prodl, i256 %prodh, i256 %modulo)
  ret i256 %res
}
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/math.rs#L43) is common for Yul and EVMLA representations.

# [EXP](https://www.evm.codes/#0a?fork=shanghai)

### LLVM IR

```llvm
define i256 @__exp(i256 %value, i256 %exp) "noinline-oz" #0 {
entry:
  %exp_is_non_zero = icmp eq i256 %exp, 0
  br i1 %exp_is_non_zero, label %return, label %exponent_loop_body

return:
  %exp_res = phi i256 [ 1, %entry ], [ %exp_res.1, %exponent_loop_body ]
  ret i256 %exp_res

exponent_loop_body:
  %exp_res.2 = phi i256 [ %exp_res.1, %exponent_loop_body ], [ 1, %entry ]
  %exp_val = phi i256 [ %exp_val_halved, %exponent_loop_body ], [ %exp, %entry ]
  %val_squared.1 = phi i256 [ %val_squared, %exponent_loop_body ], [ %value, %entry ]
  %odd_test = and i256 %exp_val, 1
  %is_exp_odd = icmp eq i256 %odd_test, 0
  %exp_res.1.interm = select i1 %is_exp_odd, i256 1, i256 %val_squared.1
  %exp_res.1 = mul i256 %exp_res.1.interm, %exp_res.2
  %val_squared = mul i256 %val_squared.1, %val_squared.1
  %exp_val_halved = lshr i256 %exp_val, 1
  %exp_val_is_less_2 = icmp ult i256 %exp_val, 2
  br i1 %exp_val_is_less_2, label %return, label %exponent_loop_body
}
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/math.rs#L70) is common for Yul and EVMLA representations.

# [SIGNEXTEND](https://www.evm.codes/#0b?fork=shanghai)

### LLVM IR

```llvm
define i256 @__signextend(i256 %numbyte, i256 %value) #0 {
entry:
  %is_overflow = icmp uge i256 %numbyte, 31
  br i1 %is_overflow, label %return, label %signextend

signextend:
  %numbit_byte = mul nuw nsw i256 %numbyte, 8
  %numbit = add nsw nuw i256 %numbit_byte, 7
  %numbit_inv = sub i256 256, %numbit
  %signmask = shl i256 1, %numbit
  %valmask = lshr i256 -1, %numbit_inv
  %ext1 = shl i256 -1, %numbit
  %signv = and i256 %signmask, %value
  %sign = icmp ne i256 %signv, 0
  %valclean = and i256 %value, %valmask
  %sext = select i1 %sign, i256 %ext1, i256 0
  %result = or i256 %sext, %valclean
  br label %return

return:
  %signext_res = phi i256 [%value, %entry], [%result, %signextend]
  ret i256 %signext_res
}
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/math.rs#L93) is common for Yul and EVMLA representations.

# Logical

# [LT](https://www.evm.codes/#10?fork=shanghai)

### LLVM IR

```llvm
%comparison_result = icmp ult i256 %value1, %value2
%comparison_result_extended = zext i1 %comparison_result to i256
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/comparison.rs#L15) is common for Yul and EVMLA representations.

[LLVM IR instruction documentation](https://releases.llvm.org/15.0.0/docs/LangRef.html#icmp-instruction)

### EraVM Assembly

```nasm
ptr.add stack[@ptr_calldata], r0, r1
ptr.add.s       36, r1, r2
ld      r2, r2
ptr.add.s       4, r1, r1
ld      r1, r1
sub!    r1, r2, r1
add     0, r0, r1
add.lt  1, r0, r1
st.1    128, r1
```

# [GT](https://www.evm.codes/#11?fork=shanghai)

### LLVM IR

```llvm
%comparison_result = icmp ugt i256 %value1, %value2
%comparison_result_extended = zext i1 %comparison_result to i256
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/comparison.rs#L15) is common for Yul and EVMLA representations.

[LLVM IR instruction documentation](https://releases.llvm.org/15.0.0/docs/LangRef.html#icmp-instruction)

### EraVM Assembly

```nasm
ptr.add stack[@ptr_calldata], r0, r1
ptr.add.s       36, r1, r2
ld      r2, r2
ptr.add.s       4, r1, r1
ld      r1, r1
sub!    r1, r2, r1
add     0, r0, r1
add.gt  1, r0, r1
st.1    128, r1
```

# [SLT](https://www.evm.codes/#12?fork=shanghai)

### LLVM IR

```llvm
%comparison_result = icmp slt i256 %value1, %value2
%comparison_result_extended = zext i1 %comparison_result to i256
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/comparison.rs#L15) is common for Yul and EVMLA representations.

[LLVM IR instruction documentation](https://releases.llvm.org/15.0.0/docs/LangRef.html#icmp-instruction)

### EraVM Assembly

```nasm
ptr.add stack[@ptr_calldata], r0, r1
ptr.add.s       36, r1, r2
ld      r2, r2
ptr.add.s       4, r1, r1
ld      r1, r1
add     @CPI0_4[0], r0, r3
sub!    r1, r2, r4
add     r0, r0, r4
add.lt  r3, r0, r4
and     @CPI0_4[0], r2, r2
and     @CPI0_4[0], r1, r1
sub!    r1, r2, r5
add.le  r0, r0, r3
xor     r1, r2, r1
sub.s!  @CPI0_4[0], r1, r1
add     r4, r0, r1
add.eq  r3, r0, r1
sub!    r1, r0, r1
add     0, r0, r1
add.ne  1, r0, r1
st.1    128, r1
```

# [SGT](https://www.evm.codes/#13?fork=shanghai)

### LLVM IR

```llvm
%comparison_result = icmp sgt i256 %value1, %value2
%comparison_result_extended = zext i1 %comparison_result to i256
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/comparison.rs#L15) is common for Yul and EVMLA representations.

[LLVM IR instruction documentation](https://releases.llvm.org/15.0.0/docs/LangRef.html#icmp-instruction)

### EraVM Assembly

```nasm
ptr.add stack[@ptr_calldata], r0, r1
ptr.add.s       36, r1, r2
ld      r2, r2
ptr.add.s       4, r1, r1
ld      r1, r1
add     @CPI0_4[0], r0, r3
sub!    r1, r2, r4
add     r0, r0, r4
add.gt  r3, r0, r4
and     @CPI0_4[0], r2, r2
and     @CPI0_4[0], r1, r1
sub!    r1, r2, r5
add.ge  r0, r0, r3
xor     r1, r2, r1
sub.s!  @CPI0_4[0], r1, r1
add     r4, r0, r1
add.eq  r3, r0, r1
sub!    r1, r0, r1
add     0, r0, r1
add.ne  1, r0, r1
st.1    128, r1
```

# [EQ](https://www.evm.codes/#14?fork=shanghai)

### LLVM IR

```llvm
%comparison_result = icmp eq i256 %value1, %value2
%comparison_result_extended = zext i1 %comparison_result to i256
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/comparison.rs#L15) is common for Yul and EVMLA representations.

[LLVM IR instruction documentation](https://releases.llvm.org/15.0.0/docs/LangRef.html#icmp-instruction)

### EraVM Assembly

```nasm
ptr.add stack[@ptr_calldata], r0, r1
ptr.add.s       36, r1, r2
ld      r2, r2
ptr.add.s       4, r1, r1
ld      r1, r1
sub!    r1, r2, r1
add     0, r0, r1
add.eq  1, r0, r1
st.1    128, r1
```

# [ISZERO](https://www.evm.codes/#15?fork=shanghai)

### LLVM IR

```llvm
%comparison_result = icmp eq i256 %value, 0
%comparison_result_extended = zext i1 %comparison_result to i256
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/comparison.rs#L15) is common for Yul and EVMLA representations.

[LLVM IR instruction documentation](https://releases.llvm.org/15.0.0/docs/LangRef.html#icmp-instruction)

### EraVM Assembly

```nasm
ptr.add stack[@ptr_calldata], r1, r1
ld      r1, r1
sub!    r1, r0, r1
add     0, r0, r1
add.eq  1, r0, r1
st.1    128, r1
```

# Bitwise

# [AND](https://www.evm.codes/#16?fork=shanghai)

### LLVM IR

```llvm
%and_result = and i256 %value1, %value2
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/bitwise.rs#L47) is common for Yul and EVMLA representations.

[LLVM IR instruction documentation](https://releases.llvm.org/15.0.0/docs/LangRef.html#and-instruction)

### EraVM Assembly

```nasm
ptr.add stack[@ptr_calldata], r0, r1
ptr.add.s       36, r1, r2
ld      r2, r2
ptr.add.s       4, r1, r1
ld      r1, r1
and     r1, r2, r1
st.1    128, r1
```

# [OR](https://www.evm.codes/#17?fork=shanghai)

### LLVM IR

```llvm
%or_result = or i256 %value1, %value2
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/bitwise.rs#L13) is common for Yul and EVMLA representations.

[LLVM IR instruction documentation](https://releases.llvm.org/15.0.0/docs/LangRef.html#or-instruction)

### EraVM Assembly

```nasm
ptr.add stack[@ptr_calldata], r0, r1
ptr.add.s       36, r1, r2
ld      r2, r2
ptr.add.s       4, r1, r1
ld      r1, r1
or      r1, r2, r1
st.1    128, r1
```

# [XOR](https://www.evm.codes/#18?fork=shanghai)

### LLVM IR

```llvm
%xor_result = or i256 %value1, %value2
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/bitwise.rs#L30) is common for Yul and EVMLA representations.

[LLVM IR instruction documentation](https://releases.llvm.org/15.0.0/docs/LangRef.html#xor-instruction)

### EraVM Assembly

```nasm
ptr.add stack[@ptr_calldata], r0, r1
ptr.add.s       36, r1, r2
ld      r2, r2
ptr.add.s       4, r1, r1
ld      r1, r1
xor     r1, r2, r1
st.1    128, r1
```

# [NOT](https://www.evm.codes/#19?fork=shanghai)

### LLVM IR

```llvm
%xor_result = xor i256 %value, -1
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/bitwise.rs#L30) is common for Yul and EVMLA representations.

### EraVM Assembly

```nasm
ptr.add stack[@ptr_calldata], r1, r1
ld      r1, r1
sub.s   1, r0, r2
xor     r1, r2, r1
st.1    128, r1
```

# [BYTE](https://www.evm.codes/#1a?fork=shanghai)

### LLVM IR

```llvm
define i256 @__byte(i256 %index, i256 %value) #0 {
entry:
  %is_overflow = icmp ugt i256 %index, 31
  br i1 %is_overflow, label %return, label %extract_byte

extract_byte:
  %bits_offset = shl i256 %index, 3
  %value_shifted_left = shl i256 %value, %bits_offset
  %value_shifted_right = lshr i256 %value_shifted_left, 248
  br label %return

return:
  %res = phi i256 [ 0, %entry ], [ %value_shifted_right, %extract_byte ]
  ret i256 %res
}
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/bitwise.rs#L229) is common for Yul and EVMLA representations.

# [SHL](https://www.evm.codes/#1b?fork=shanghai)

### LLVM IR

```llvm
define i256 @__shl(i256 %shift, i256 %value) #0 {
entry:
  %is_overflow = icmp ugt i256 %shift, 255
  br i1 %is_overflow, label %return, label %shift_value

shift_value:
  %shift_res = shl i256 %value, %shift
  br label %return

return:
  %res = phi i256 [ 0, %entry ], [ %shift_res, %shift_value ]
  ret i256 %res
}
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/bitwise.rs#L67) is common for Yul and EVMLA representations.

# [SHR](https://www.evm.codes/#1c?fork=shanghai)

### LLVM IR

```llvm
define i256 @__shr(i256 %shift, i256 %value) #0 {
entry:
  %is_overflow = icmp ugt i256 %shift, 255
  br i1 %is_overflow, label %return, label %shift_value

shift_value:
  %shift_res = lshr i256 %value, %shift
  br label %return

return:
  %res = phi i256 [ 0, %entry ], [ %shift_res, %shift_value ]
  ret i256 %res
}
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/bitwise.rs#L111) is common for Yul and EVMLA representations.

# [SAR](https://www.evm.codes/#1d?fork=shanghai)

### LLVM IR

```llvm
define i256 @__sar(i256 %shift, i256 %value) #0 {
entry:
  %is_overflow = icmp ugt i256 %shift, 255
  br i1 %is_overflow, label %arith_overflow, label %shift_value

arith_overflow:
  %is_val_positive = icmp sge i256 %value, 0
  %res_overflow = select i1 %is_val_positive, i256 0, i256 -1
  br label %return

shift_value:
  %shift_res = ashr i256 %value, %shift
  br label %return

return:
  %res = phi i256 [ %res_overflow, %arith_overflow ], [ %shift_res, %shift_value ]
  ret i256 %res
}
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/bitwise.rs#L157) is common for Yul and EVMLA representations.

# [SHA3](https://www.evm.codes/#20?fork=shanghai)

### System Contract

This instruction is handled by a System Contract called [Keccak256](https://github.com/matter-labs/era-system-contracts/blob/main/contracts/precompiles/Keccak256.yul),
which is a wrapper around the EraVM precompile.

On how the System Contract is called, see [this section](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/system_contracts.md).

### LLVM IR

```llvm
define i256 @__sha3(i8 addrspace(1)* nocapture nofree noundef %0, i256 %1, i1 %throw_at_failure) "noinline-oz" #1 personality i32()* @__personality {
entry:
  %addr_int = ptrtoint i8 addrspace(1)* %0 to i256
  %2 = tail call i256 @llvm.umin.i256(i256 %addr_int, i256 4294967295)
  %3 = tail call i256 @llvm.umin.i256(i256 %1, i256 4294967295)
  %gas_left = tail call i256 @llvm.syncvm.gasleft()
  %4 = tail call i256 @llvm.umin.i256(i256 %gas_left, i256 4294967295)
  %abi_data_input_offset_shifted = shl nuw nsw i256 %2, 64
  %abi_data_input_length_shifted = shl nuw nsw i256 %3, 96
  %abi_data_gas_shifted = shl nuw nsw i256 %4, 192
  %abi_data_offset_and_length = add i256 %abi_data_input_length_shifted, %abi_data_input_offset_shifted
  %abi_data_add_gas = add i256 %abi_data_gas_shifted, %abi_data_offset_and_length
  %abi_data_add_system_call_marker = add i256 %abi_data_add_gas, 904625697166532776746648320380374280103671755200316906558262375061821325312
  %call_external = tail call { i8 addrspace(3)*, i1 } @__staticcall(i256 %abi_data_add_system_call_marker, i256 32784, i256 undef, i256 undef, i256 undef, i256 undef, i256 undef, i256 undef, i256 undef, i256 undef, i256 undef, i256 undef)
  %status_code = extractvalue { i8 addrspace(3)*, i1 } %call_external, 1
  br i1 %status_code, label %success_block, label %failure_block

success_block:
  %abi_data_pointer = extractvalue { i8 addrspace(3)*, i1 } %call_external, 0
  %data_pointer = bitcast i8 addrspace(3)* %abi_data_pointer to i256 addrspace(3)*
  %keccak256_child_data = load i256, i256 addrspace(3)* %data_pointer, align 1
  ret i256 %keccak256_child_data

failure_block:
  br i1 %throw_at_failure, label %throw_block, label %revert_block

revert_block:
  call void @__revert(i256 0, i256 0, i256 0)
  unreachable

throw_block:
  call void @__cxa_throw(i8* noalias nocapture nofree align 32 null, i8* noalias nocapture nofree align 32 undef, i8* noalias nocapture nofree align 32 undef)
  unreachable
}
```

# Environment

## [ADDRESS](https://www.evm.codes/#30?fork=shanghai)

This value is fetched with a native EraVM instruction.

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-solidity/blob/main/src/yul/parser/statement/expression/function_call/mod.rs#L973) is common for Yul and EVMLA representations.

## [BALANCE](https://www.evm.codes/#31?fork=shanghai)

### System Contract

This information is requested a System Contract called [L2EthToken](https://github.com/code-423n4/2023-10-zksync/blob/main/code/system-contracts/contracts/L2EthToken.sol).

On how the System Contract is called, see [this section](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/system_contracts.md).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/ether_gas.rs#L39) is common for Yul and EVMLA representations.

The request to the System Contract is done via the [SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## [ORIGIN](https://www.evm.codes/#32?fork=shanghai)

### System Contract

This information is requested a System Contract called [SystemContext](https://github.com/code-423n4/2023-10-zksync/blob/main/code/system-contracts/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/system_contracts.md).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L47) is common for Yul and EVMLA representations.

The request to the System Contract is done via the [SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## [CALLER](https://www.evm.codes/#33?fork=shanghai)

This value is fetched with a native EraVM instruction.

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-solidity/blob/main/src/yul/parser/statement/expression/function_call/mod.rs#L974) is common for Yul and EVMLA representations.

## [CALLVALUE](https://www.evm.codes/#34?fork=shanghai)

This value is fetched with a native EraVM instruction.

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/ether_gas.rs#L25) is common for Yul and EVMLA representations.

## CALLDATALOAD

[CALLDATALOAD](https://www.evm.codes/#35?fork=shanghai)

Calldata is accessed with a generic memory access instruction, but the memory chunk itself is a reference
to the calling contract's heap.
A fat pointer to the parent contract is passed via ABI using registers.

Then, the pointer [is saved to a global stack variable](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/entry.rs#L129) accessible from anywhere in the contract.

### LLVM IR

```llvm
@ptr_calldata = private unnamed_addr global ptr addrspace(3) null                   ; global variable declaration
...
store ptr addrspace(3) %0, ptr @ptr_calldata, align 32                              ; saving the pointer from `r1` to the global variable
...
%calldata_pointer = load ptr addrspace(3), ptr @ptr_calldata, align 32              ; loading the pointer from the global variable to `calldata_pointer`
%calldata_value = load i256, ptr addrspace(3) %calldata_pointer, align 32           ; loading the value from the calldata pointer
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/calldata.rs#L14) is common for Yul and EVMLA representations.

### EraVM Assembly

```nasm
ptr.add r1, r0, stack[@ptr_calldata]                                                ; saving the pointer from `r1` to the global variable
...
ptr.add stack[@ptr_calldata], r0, r1                                                ; loading the pointer from the global variable to `r1`
ld      r1, r1                                                                      ; loading the value to `r1`
```

## [CALLDATASIZE](https://www.evm.codes/#36?fork=shanghai)

Calldata size is stored in the fat pointer passed from the parent contract (see [CALLDATALOAD](#calldataload)).

The size value can be extracted with bitwise operations as illustrated below.

### LLVM IR

```llvm
@calldatasize = private unnamed_addr global i256 0                                  ; global variable declaration
...
%abi_pointer_value = ptrtoint ptr addrspace(3) %0 to i256                           ; converting the pointer to an integer
%abi_pointer_value_shifted = lshr i256 %abi_pointer_value, 96                       ; shifting the integer right 96 bits
%abi_length_value = and i256 %abi_pointer_value_shifted, 4294967295                 ; keeping the lowest 32 bits of the integer
store i256 %abi_length_value, ptr @calldatasize, align 32                           ; saving the value to the global variable
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/calldata.rs#L40) is common for Yul and EVMLA representations.

### EraVM Assembly

```nasm
ptr.add r1, r0, stack[@ptr_calldata]                                                ; saving the pointer from `r1` to the global variable
shr.s   96, r1, r1                                                                  ; shifting the integer right 96 bits
and     @CPI0_0[0], r1, stack[@calldatasize]                                        ; keeping the lowest 32 bits of the integer, saving the value to the global variable
...
CPI0_0:
    .cell 4294967295
```

## CALLDATACOPY

[CALLDATACOPY](https://www.evm.codes/#37?fork=shanghai)

Unlike on EVM, on EraVM it is a simple loop over [CALLDATALOAD](#calldataload)).

### LLVM IR

```llvm
; loading the pointer from the global variable to `calldata_pointer`
%calldata_pointer = load ptr addrspace(3), ptr @ptr_calldata, align 32
; shifting the pointer by 122 bytes
%calldata_source_pointer = getelementptr i8, ptr addrspace(3) %calldata_pointer, i256 122
; copying 64 bytes from calldata at offset 122 to the heap at offset 128
call void @llvm.memcpy.p1.p3.i256(ptr addrspace(1) align 1 inttoptr (i256 128 to ptr addrspace(1)), ptr addrspace(3) align 1 %calldata_source_pointer, i256 64, i1 false)
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/calldata.rs#L54) is common for Yul and EVMLA representations.

### EraVM Assembly

```nasm
.BB0_3:
    shl.s   5, r2, r3           ; shifting the offset by 32
    ptr.add r1, r3, r4          ; adding the offset to the calldata pointer
    ld      r4, r4              ; reading the calldata value
    add     128, r3, r3         ; adding the offset to the heap pointer
    st.1    r3, r4              ; writing the calldata value to the heap
    add     1, r2, r2           ; incrementing the offset
    sub.s!  2, r2, r3           ; checking the bounds
    jump.lt @.BB0_3             ; loop continuation branching
```

## [CODECOPY](https://www.evm.codes/#38?fork=shanghai)

See [the EraVM docs](https://era.zksync.io/docs/reference/architecture/differences-with-ethereum.html#codecopy).

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-solidity/blob/main/src/evmla/ethereal_ir/function/block/element/mod.rs#L856).

## [CODESIZE](https://www.evm.codes/#39?fork=shanghai)

See [the EraVM docs](https://era.zksync.io/docs/reference/architecture/differences-with-ethereum.html#codesize).

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-solidity/blob/main/src/evmla/ethereal_ir/function/block/element/mod.rs#L837).

## [GASPRICE](https://www.evm.codes/#3a?fork=shanghai)

### System Contract

This information is requested a System Contract called [SystemContext](https://github.com/code-423n4/2023-10-zksync/blob/main/code/system-contracts/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/system_contracts.md#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L30) is common for Yul and EVMLA representations.

The request to the System Contract is done via the [SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## [EXTCODESIZE](https://www.evm.codes/#3b?fork=shanghai)

### System Contract

This information is requested a System Contract called [AccountCodeStorage](https://github.com/code-423n4/2023-10-zksync/blob/main/code/system-contracts/contracts/AccountCodeStorage.sol).

On how the System Contract is called, see [this section](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/system_contracts.md).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/ext_code.rs#L11) is common for Yul and EVMLA representations.

The request to the System Contract is done via the [SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## [EXTCODECOPY](https://www.evm.codes/#3c?fork=shanghai)

Not supported. Triggers a compile-time error.

## [RETURNDATASIZE](https://www.evm.codes/#3d?fork=shanghai)

Return data size is read from the fat pointer returned from the child contract.

The size value can be extracted with bitwise operations as illustrated below.

### LLVM IR

```llvm
%contract_call_external = tail call { ptr addrspace(3), i1 } @__farcall(i256 0, i256 0, i256 undef, i256 undef, i256 undef, i256 undef, i256 undef, i256 undef, i256 undef, i256 undef, i256 undef, i256 undef)
%contract_call_external_result_abi_data = extractvalue { ptr addrspace(3), i1 } %contract_call_external, 0
%contract_call_memcpy_from_child_pointer_casted = ptrtoint ptr addrspace(3) %contract_call_external_result_abi_data to i256
%contract_call_memcpy_from_child_return_data_size_shifted = lshr i256 %contract_call_memcpy_from_child_pointer_casted, 96
%contract_call_memcpy_from_child_return_data_size_truncated = and i256 %contract_call_memcpy_from_child_return_data_size_shifted, 4294967295
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/return_data.rs#L16) is common for Yul and EVMLA representations.

### EraVM Assembly

```nasm
near_call       r0, @__farcall, @DEFAULT_UNWIND                 ; calling a child contract
shr.s   96, r1, r1                                              ; shifting the pointer value right 96 bits
and     @CPI0_1[0], r1, r1                                      ; keeping the lowest 32 bits of the pointer value
...
CPI0_1:
    .cell 4294967295
```

## [RETURNDATACOPY](https://www.evm.codes/#3e?fork=shanghai)

Unlike on EVM, on EraVM it is a simple loop over memory operations on 256-bit values.

### LLVM IR

```llvm
; loading the pointer from the global variable to `return_data_pointer`
%return_data_pointer = load ptr addrspace(3), ptr @ptr_return_data, align 32
; shifting the pointer by 122 bytes
%return_data_source_pointer = getelementptr i8, ptr addrspace(3) %return_data_pointer, i256 122
; copying 64 bytes from return data at offset 122 to the heap at offset 128
call void @llvm.memcpy.p1.p3.i256(ptr addrspace(1) align 1 inttoptr (i256 128 to ptr addrspace(1)), ptr addrspace(3) align 1 %return_data_source_pointer, i256 64, i1 false)
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/return_data.rs#L31) is common for Yul and EVMLA representations.

### EraVM Assembly

```nasm
.BB0_3:
    shl.s   5, r2, r3           ; shifting the offset by 32
    ptr.add r1, r3, r4          ; adding the offset to the return data pointer
    ld      r4, r4              ; reading the return data value
    add     128, r3, r3         ; adding the offset to the heap pointer
    st.1    r3, r4              ; writing the return data value to the heap
    add     1, r2, r2           ; incrementing the offset
    sub.s!  2, r2, r3           ; checking the bounds
    jump.lt @.BB0_3             ; loop continuation branching
```

## [EXTCODEHASH](https://www.evm.codes/#3f?fork=shanghai)

### System Contract

This information is requested a System Contract called [AccountCodeStorage](https://github.com/code-423n4/2023-10-zksync/blob/main/code/system-contracts/contracts/AccountCodeStorage.sol).

On how the System Contract is called, see [this section](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/system_contracts.md).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/ext_code.rs#L29) is common for Yul and EVMLA representations.

The request to the System Contract is done via the [SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## Block

### [BLOCKHASH](https://www.evm.codes/#40?fork=shanghai)

### System Contract

This information is requested a System Contract called [SystemContext](https://github.com/code-423n4/2023-10-zksync/blob/main/code/system-contracts/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/system_contracts.md#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L47) is common for Yul and EVMLA representations.

The request to the System Contract is done via the [SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## [COINBASE](https://www.evm.codes/#41?fork=shanghai)

### System Contract

This information is requested a System Contract called [SystemContext](.https://github.com/code-423n4/2023-10-zksync/blob/main/code/system-contracts/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/system_contracts.md#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L150) is common for Yul and EVMLA representations.

The request to the System Contract is done via the [SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## [TIMESTAMP](https://www.evm.codes/#42?fork=shanghai)

### System Contract

This information is requested a System Contract called [SystemContext](https://github.com/code-423n4/2023-10-zksync/blob/main/code/system-contracts/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/system_contracts.md#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L98) is common for Yul and EVMLA representations.

The request to the System Contract is done via the [SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## [NUMBER](https://www.evm.codes/#43?fork=shanghai)

### System Contract

This information is requested a System Contract called [SystemContext](https://github.com/code-423n4/2023-10-zksync/blob/main/code/system-contracts/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/system_contracts.md#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L81) is common for Yul and EVMLA representations.

The request to the System Contract is done via the [SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

# [PREVRANDAO](https://www.evm.codes/#44?fork=shanghai) | [DIFFICULTY](https://www.evm.codes/#44?fork=grayGlacier)

### System Contract

This information is requested a System Contract called [SystemContext]<https://github.com/code-423n4/2023-10-zksync/blob/main/code/system-contracts/contracts/SystemContext.sol>).

On how the System Contract is called, see [this section](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/system_contracts.md#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L133) is common for Yul and EVMLA representations.

The request to the System Contract is done via the [SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

# [GASLIMIT](https://www.evm.codes/#45?fork=shanghai)

### System Contract

This information is requested a System Contract called [SystemContext](https://github.com/code-423n4/2023-10-zksync/blob/main/code/system-contracts/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/system_contracts.md#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L13) is common for Yul and EVMLA representations.

The request to the System Contract is done via the [SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## [CHAINID](https://www.evm.codes/#46?fork=shanghai)

### System Contract

This information is requested a System Contract called [SystemContext](https://github.com/code-423n4/2023-10-zksync/blob/main/code/system-contracts/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/system_contracts.md#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L64) is common for Yul and EVMLA representations.

The request to the System Contract is done via the [SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## [SELFBALANCE](https://www.evm.codes/#47?fork=shanghai)

Implemented as [BALANCE](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/instructions/evm/environment.md#balance) with an [ADDRESS](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/instructions/evm/environment.md#address) as its argument.

## [BASEFEE](https://www.evm.codes/#48?fork=shanghai)

### System Contract

This information is requested a System Contract called [SystemContext](https://github.com/code-423n4/2023-10-zksync/blob/main/code/system-contracts/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/system_contracts.md#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L167) is common for Yul and EVMLA representations.

The request to the System Contract is done via the [SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## Calls

All EVM call instructions are handled similarly.

The call type is encoded on the assembly level, so we will describe the common handling workflow, mentioning
distinctions if there are any.

### [CALL](https://www.evm.codes/#f1?fork=shanghai)

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/call.rs#L530)
is common for Yul and EVMLA representations.

The code checks if the call is non-static and the Ether value is non-zero. If so, the call is redirected to the
[MsgValueSimulator](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/system_contracts.md#ether-value-simulator).

## [DELEGATECALL](https://www.evm.codes/#f4?fork=shanghai)

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/call.rs#L530)
is common for Yul and EVMLA representations.

## [STATICCALL](https://www.evm.codes/#fa?fork=shanghai)

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/call.rs#L530)
is common for Yul and EVMLA representations.

## CREATE

The EVM CREATE instructions are handled similarly.

## [CREATE](https://www.evm.codes/#f0?fork=shanghai)

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/create.rs#L19)
is common for Yul and EVMLA representations.

## [CREATE2](https://www.evm.codes/#f5?fork=shanghai)

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/create.rs#L57)
is common for Yul and EVMLA representations.

# Environment

## [ADDRESS](https://www.evm.codes/#30?fork=shanghai)

This value is fetched with a native EraVM instruction.

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-solidity/blob/main/src/yul/parser/statement/expression/function_call/mod.rs#L973)
is common for Yul and EVMLA representations.

## [BALANCE](https://www.evm.codes/#31?fork=shanghai)

### System Contract

This information is requested a System Contract called
[L2EthToken](https://github.com/code-423n4/2023-10-zksync/blob/main/code/system-contracts/contracts/L2EthToken.sol).

On how the System Contract is called, see
[this section](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/system_contracts.md).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/ether_gas.rs#L39)
is common for Yul and EVMLA representations.

The request to the System Contract is done via the
[SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs)
runtime function.

## [ORIGIN](https://www.evm.codes/#32?fork=shanghai)

### System Contract

This information is requested a System Contract called
[SystemContext](https://github.com/code-423n4/2023-10-zksync/blob/main/code/system-contracts/contracts/SystemContext.sol).

On how the System Contract is called, see
[this section](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/system_contracts.md).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L47)
is common for Yul and EVMLA representations.

The request to the System Contract is done via the
[SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs)
runtime function.

## [CALLER](https://www.evm.codes/#33?fork=shanghai)

This value is fetched with a native EraVM instruction.

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-solidity/blob/main/src/yul/parser/statement/expression/function_call/mod.rs#L974)
is common for Yul and EVMLA representations.

## [CALLVALUE](https://www.evm.codes/#34?fork=shanghai)

This value is fetched with a native EraVM instruction.

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/ether_gas.rs#L25)
is common for Yul and EVMLA representations.

## [CALLDATALOAD](https://www.evm.codes/#35?fork=shanghai)

Calldata is accessed with a generic memory access instruction, but the memory chunk itself is a reference to the calling
contract's heap. A fat pointer to the parent contract is passed via ABI using registers.

Then, the pointer
[is saved to a global stack variable](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/entry.rs#L129)
accessible from anywhere in the contract.

### LLVM IR

```llvm
@ptr_calldata = private unnamed_addr global ptr addrspace(3) null                   ; global variable declaration
...
store ptr addrspace(3) %0, ptr @ptr_calldata, align 32                              ; saving the pointer from `r1` to the global variable
...
%calldata_pointer = load ptr addrspace(3), ptr @ptr_calldata, align 32              ; loading the pointer from the global variable to `calldata_pointer`
%calldata_value = load i256, ptr addrspace(3) %calldata_pointer, align 32           ; loading the value from the calldata pointer
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/calldata.rs#L14)
is common for Yul and EVMLA representations.

### EraVM Assembly

```nasm
ptr.add r1, r0, stack[@ptr_calldata]                                                ; saving the pointer from `r1` to the global variable
...
ptr.add stack[@ptr_calldata], r0, r1                                                ; loading the pointer from the global variable to `r1`
ld      r1, r1                                                                      ; loading the value to `r1`
```

## [CALLDATASIZE](https://www.evm.codes/#36?fork=shanghai)

Calldata size is stored in the fat pointer passed from the parent contract (see [CALLDATALOAD](#calldataload)).

The size value can be extracted with bitwise operations as illustrated below.

### LLVM IR

```llvm
@calldatasize = private unnamed_addr global i256 0                                  ; global variable declaration
...
%abi_pointer_value = ptrtoint ptr addrspace(3) %0 to i256                           ; converting the pointer to an integer
%abi_pointer_value_shifted = lshr i256 %abi_pointer_value, 96                       ; shifting the integer right 96 bits
%abi_length_value = and i256 %abi_pointer_value_shifted, 4294967295                 ; keeping the lowest 32 bits of the integer
store i256 %abi_length_value, ptr @calldatasize, align 32                           ; saving the value to the global variable
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/calldata.rs#L40)
is common for Yul and EVMLA representations.

### EraVM Assembly

```nasm
ptr.add r1, r0, stack[@ptr_calldata]                                                ; saving the pointer from `r1` to the global variable
shr.s   96, r1, r1                                                                  ; shifting the integer right 96 bits
and     @CPI0_0[0], r1, stack[@calldatasize]                                        ; keeping the lowest 32 bits of the integer, saving the value to the global variable
...
CPI0_0:
    .cell 4294967295
```

## [CALLDATACOPY](https://www.evm.codes/#37?fork=shanghai)

Unlike on EVM, on EraVM it is a simple loop over [CALLDATALOAD](#calldataload)).

### LLVM IR

```llvm
; loading the pointer from the global variable to `calldata_pointer`
%calldata_pointer = load ptr addrspace(3), ptr @ptr_calldata, align 32
; shifting the pointer by 122 bytes
%calldata_source_pointer = getelementptr i8, ptr addrspace(3) %calldata_pointer, i256 122
; copying 64 bytes from calldata at offset 122 to the heap at offset 128
call void @llvm.memcpy.p1.p3.i256(ptr addrspace(1) align 1 inttoptr (i256 128 to ptr addrspace(1)), ptr addrspace(3) align 1 %calldata_source_pointer, i256 64, i1 false)
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/calldata.rs#L54)
is common for Yul and EVMLA representations.

### EraVM Assembly

```nasm
.BB0_3:
    shl.s   5, r2, r3           ; shifting the offset by 32
    ptr.add r1, r3, r4          ; adding the offset to the calldata pointer
    ld      r4, r4              ; reading the calldata value
    add     128, r3, r3         ; adding the offset to the heap pointer
    st.1    r3, r4              ; writing the calldata value to the heap
    add     1, r2, r2           ; incrementing the offset
    sub.s!  2, r2, r3           ; checking the bounds
    jump.lt @.BB0_3             ; loop continuation branching
```

## [CODECOPY](https://www.evm.codes/#38?fork=shanghai)

See [the EraVM docs](https://era.zksync.io/docs/reference/architecture/differences-with-ethereum.html#codecopy).

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-solidity/blob/main/src/evmla/ethereal_ir/function/block/element/mod.rs#L856).

## [CODESIZE](https://www.evm.codes/#39?fork=shanghai)

See [the EraVM docs](https://era.zksync.io/docs/reference/architecture/differences-with-ethereum.html#codesize).

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-solidity/blob/main/src/evmla/ethereal_ir/function/block/element/mod.rs#L837).

## [GASPRICE](https://www.evm.codes/#3a?fork=shanghai)

### System Contract

This information is requested a System Contract called
[SystemContext](https://github.com/code-423n4/2023-10-zksync/blob/main/code/system-contracts/contracts/SystemContext.sol).

On how the System Contract is called, see
[this section](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/system_contracts.md#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L30)
is common for Yul and EVMLA representations.

The request to the System Contract is done via the
[SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs)
runtime function.

## [EXTCODESIZE](https://www.evm.codes/#3b?fork=shanghai)

### System Contract

This information is requested a System Contract called
[AccountCodeStorage](https://github.com/code-423n4/2023-10-zksync/blob/main/code/system-contracts/contracts/AccountCodeStorage.sol).

On how the System Contract is called, see
[this section](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/system_contracts.md).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/ext_code.rs#L11)
is common for Yul and EVMLA representations.

The request to the System Contract is done via the
[SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs)
runtime function.

## [EXTCODECOPY](https://www.evm.codes/#3c?fork=shanghai)

Not supported. Triggers a compile-time error.

## [RETURNDATASIZE](https://www.evm.codes/#3d?fork=shanghai)

Return data size is read from the fat pointer returned from the child contract.

The size value can be extracted with bitwise operations as illustrated below.

### LLVM IR

```llvm
%contract_call_external = tail call { ptr addrspace(3), i1 } @__farcall(i256 0, i256 0, i256 undef, i256 undef, i256 undef, i256 undef, i256 undef, i256 undef, i256 undef, i256 undef, i256 undef, i256 undef)
%contract_call_external_result_abi_data = extractvalue { ptr addrspace(3), i1 } %contract_call_external, 0
%contract_call_memcpy_from_child_pointer_casted = ptrtoint ptr addrspace(3) %contract_call_external_result_abi_data to i256
%contract_call_memcpy_from_child_return_data_size_shifted = lshr i256 %contract_call_memcpy_from_child_pointer_casted, 96
%contract_call_memcpy_from_child_return_data_size_truncated = and i256 %contract_call_memcpy_from_child_return_data_size_shifted, 4294967295
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/return_data.rs#L16)
is common for Yul and EVMLA representations.

### EraVM Assembly

```nasm
near_call       r0, @__farcall, @DEFAULT_UNWIND                 ; calling a child contract
shr.s   96, r1, r1                                              ; shifting the pointer value right 96 bits
and     @CPI0_1[0], r1, r1                                      ; keeping the lowest 32 bits of the pointer value
...
CPI0_1:
    .cell 4294967295
```

## [RETURNDATACOPY](https://www.evm.codes/#3e?fork=shanghai)

Unlike on EVM, on EraVM it is a simple loop over memory operations on 256-bit values.

### LLVM IR

```llvm
; loading the pointer from the global variable to `return_data_pointer`
%return_data_pointer = load ptr addrspace(3), ptr @ptr_return_data, align 32
; shifting the pointer by 122 bytes
%return_data_source_pointer = getelementptr i8, ptr addrspace(3) %return_data_pointer, i256 122
; copying 64 bytes from return data at offset 122 to the heap at offset 128
call void @llvm.memcpy.p1.p3.i256(ptr addrspace(1) align 1 inttoptr (i256 128 to ptr addrspace(1)), ptr addrspace(3) align 1 %return_data_source_pointer, i256 64, i1 false)
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/return_data.rs#L31)
is common for Yul and EVMLA representations.

### EraVM Assembly

```nasm
.BB0_3:
    shl.s   5, r2, r3           ; shifting the offset by 32
    ptr.add r1, r3, r4          ; adding the offset to the return data pointer
    ld      r4, r4              ; reading the return data value
    add     128, r3, r3         ; adding the offset to the heap pointer
    st.1    r3, r4              ; writing the return data value to the heap
    add     1, r2, r2           ; incrementing the offset
    sub.s!  2, r2, r3           ; checking the bounds
    jump.lt @.BB0_3             ; loop continuation branching
```

## [EXTCODEHASH](https://www.evm.codes/#3f?fork=shanghai)

### System Contract

This information is requested a System Contract called
[AccountCodeStorage](https://github.com/code-423n4/2023-10-zksync/blob/main/code/system-contracts/contracts/AccountCodeStorage.sol).

On how the System Contract is called, see
[this section](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/system_contracts.md).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/ext_code.rs#L29)
is common for Yul and EVMLA representations.

The request to the System Contract is done via the
[SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs)
runtime function.

# Events

The EraVM event instructions are more low-level. Each `LOG`-like instruction is unrolled into a loop, where each
iteration writes two 256-bit words.

The words must contain data in the following order:

1. The initializer cell, describing the number of indexed words (e.g. `I`) and the size of non-indexed data in bytes
   (e.g. `D`)
2. `I` indexed 32-byte words
3. `D` bytes of data

Each write operation can contain some subsequent data from its next step. If only one word remains, the second input is
zero.

## [LOG0](https://www.evm.codes/#a0?fork=shanghai) - [LOG4](https://www.evm.codes/#a4?fork=shanghai)

## System Contract

This information is requested a System Contract called
[EventWriter](https://github.com/code-423n4/2023-10-zksync/blob/main/code/system-contracts/contracts/EventWriter.yul).

On how the System Contract is called, see
[this section](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/system_contracts.md).

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/event.rs#L20)
is common for Yul and EVMLA representations.

# Logical

## LLVM IR

```llvm
%comparison_result = icmp ult i256 %value1, %value2
%comparison_result_extended = zext i1 %comparison_result to i256
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/comparison.rs#L15)
is common for Yul and EVMLA representations.

[LLVM IR instruction documentation](https://releases.llvm.org/15.0.0/docs/LangRef.html#icmp-instruction)

## EraVM Assembly

```nasm
ptr.add stack[@ptr_calldata], r0, r1
ptr.add.s       36, r1, r2
ld      r2, r2
ptr.add.s       4, r1, r1
ld      r1, r1
sub!    r1, r2, r1
add     0, r0, r1
add.lt  1, r0, r1
st.1    128, r1
```

## [GT](https://www.evm.codes/#11?fork=shanghai)

## LLVM IR

```llvm
%comparison_result = icmp ugt i256 %value1, %value2
%comparison_result_extended = zext i1 %comparison_result to i256
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/comparison.rs#L15)
is common for Yul and EVMLA representations.

[LLVM IR instruction documentation](https://releases.llvm.org/15.0.0/docs/LangRef.html#icmp-instruction)

## EraVM Assembly

```nasm
ptr.add stack[@ptr_calldata], r0, r1
ptr.add.s       36, r1, r2
ld      r2, r2
ptr.add.s       4, r1, r1
ld      r1, r1
sub!    r1, r2, r1
add     0, r0, r1
add.gt  1, r0, r1
st.1    128, r1
```

## [SLT](https://www.evm.codes/#12?fork=shanghai)

## LLVM IR

```llvm
%comparison_result = icmp slt i256 %value1, %value2
%comparison_result_extended = zext i1 %comparison_result to i256
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/comparison.rs#L15)
is common for Yul and EVMLA representations.

[LLVM IR instruction documentation](https://releases.llvm.org/15.0.0/docs/LangRef.html#icmp-instruction)

## EraVM Assembly

```nasm
ptr.add stack[@ptr_calldata], r0, r1
ptr.add.s       36, r1, r2
ld      r2, r2
ptr.add.s       4, r1, r1
ld      r1, r1
add     @CPI0_4[0], r0, r3
sub!    r1, r2, r4
add     r0, r0, r4
add.lt  r3, r0, r4
and     @CPI0_4[0], r2, r2
and     @CPI0_4[0], r1, r1
sub!    r1, r2, r5
add.le  r0, r0, r3
xor     r1, r2, r1
sub.s!  @CPI0_4[0], r1, r1
add     r4, r0, r1
add.eq  r3, r0, r1
sub!    r1, r0, r1
add     0, r0, r1
add.ne  1, r0, r1
st.1    128, r1
```

## [SGT](https://www.evm.codes/#13?fork=shanghai)

## LLVM IR

```llvm
%comparison_result = icmp sgt i256 %value1, %value2
%comparison_result_extended = zext i1 %comparison_result to i256
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/comparison.rs#L15)
is common for Yul and EVMLA representations.

[LLVM IR instruction documentation](https://releases.llvm.org/15.0.0/docs/LangRef.html#icmp-instruction)

### EraVM Assembly

```nasm
ptr.add stack[@ptr_calldata], r0, r1
ptr.add.s       36, r1, r2
ld      r2, r2
ptr.add.s       4, r1, r1
ld      r1, r1
add     @CPI0_4[0], r0, r3
sub!    r1, r2, r4
add     r0, r0, r4
add.gt  r3, r0, r4
and     @CPI0_4[0], r2, r2
and     @CPI0_4[0], r1, r1
sub!    r1, r2, r5
add.ge  r0, r0, r3
xor     r1, r2, r1
sub.s!  @CPI0_4[0], r1, r1
add     r4, r0, r1
add.eq  r3, r0, r1
sub!    r1, r0, r1
add     0, r0, r1
add.ne  1, r0, r1
st.1    128, r1
```

## [EQ](https://www.evm.codes/#14?fork=shanghai)

### LLVM IR

```llvm
%comparison_result = icmp eq i256 %value1, %value2
%comparison_result_extended = zext i1 %comparison_result to i256
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/comparison.rs#L15)
is common for Yul and EVMLA representations.

[LLVM IR instruction documentation](https://releases.llvm.org/15.0.0/docs/LangRef.html#icmp-instruction)

### EraVM Assembly

```nasm
ptr.add stack[@ptr_calldata], r0, r1
ptr.add.s       36, r1, r2
ld      r2, r2
ptr.add.s       4, r1, r1
ld      r1, r1
sub!    r1, r2, r1
add     0, r0, r1
add.eq  1, r0, r1
st.1    128, r1
```

## [ISZERO](https://www.evm.codes/#15?fork=shanghai)

### LLVM IR

```llvm
%comparison_result = icmp eq i256 %value, 0
%comparison_result_extended = zext i1 %comparison_result to i256
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/comparison.rs#L15)
is common for Yul and EVMLA representations.

[LLVM IR instruction documentation](https://releases.llvm.org/15.0.0/docs/LangRef.html#icmp-instruction)

### EraVM Assembly

```nasm
ptr.add stack[@ptr_calldata], r1, r1
ld      r1, r1
sub!    r1, r0, r1
add     0, r0, r1
add.eq  1, r0, r1
st.1    128, r1
```

# Memory

## [MLOAD](https://www.evm.codes/#51?fork=shanghai)

Heap memory load operation is modeled with a native EraVM instruction.

## LLVM IR

```llvm
%value = load i256, ptr addrspace(1) %pointer, align 1
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/memory.rs#L15)
is common for Yul and EVMLA representations.

[LLVM IR instruction documentation](https://releases.llvm.org/15.0.0/docs/LangRef.html#load-instruction)

## EraVM Assembly

```nasm
ld.1    r1, r2
```

## [MSTORE](https://www.evm.codes/#52?fork=shanghai)

Heap memory load operation is modeled with a native EraVM instruction.

## LLVM IR

```llvm
store i256 128, ptr addrspace(1) inttoptr (i256 64 to ptr addrspace(1)), align 1
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/memory.rs#L38)
is common for Yul and EVMLA representations.

[LLVM IR instruction documentation](https://releases.llvm.org/15.0.0/docs/LangRef.html#store-instruction)

## EraVM Assembly

```nasm
st.1    r1, r2
```

## [MSTORE8](https://www.evm.codes/#53?fork=shanghai)

## LLVM IR

```llvm
define void @__mstore8(i256 addrspace(1)* nocapture nofree noundef dereferenceable(32) %addr, i256 %val) #2 {
entry:
  %orig_value = load i256, i256 addrspace(1)* %addr, align 1
  %orig_value_shifted_left = shl i256 %orig_value, 8
  %orig_value_shifted_right = lshr i256 %orig_value_shifted_left, 8
  %byte_value_shifted = shl i256 %val, 248
  %store_result = or i256 %orig_value_shifted_right, %byte_value_shifted
  store i256 %store_result, i256 addrspace(1)* %addr, align 1
  ret void
}
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/memory.rs#L62)
is common for Yul and EVMLA representations.

# Return

## [STOP](https://www.evm.codes/#00?fork=shanghai)

This instruction is a [RETURN](#return) with an empty data payload.

## LLVM IR

The same as for [RETURN](#return).

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/return.rs#L103)
is common for Yul and EVMLA representations.

## [RETURN](https://www.evm.codes/#f3?fork=shanghai)

This instruction works differently in deploy code. For more information, see
[the zkSync Era documentation](https://era.zksync.io/docs/reference/architecture/differences-with-ethereum.html#return).

## LLVM IR

```llvm
define void @__return(i256 %0, i256 %1, i256 %2) "noinline-oz" #5 personality i32()* @__personality {
entry:
  %abi = call i256@__aux_pack_abi(i256 %0, i256 %1, i256 %2)
  tail call void @llvm.syncvm.return(i256 %abi)
  unreachable
}
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/return.rs#L16)
is common for Yul and EVMLA representations.

## [REVERT](https://www.evm.codes/#fd?fork=shanghai)

## LLVM IR

```llvm
define void @__revert(i256 %0, i256 %1, i256 %2) "noinline-oz" #5 personality i32()* @__personality {
entry:
  %abi = call i256@__aux_pack_abi(i256 %0, i256 %1, i256 %2)
  tail call void @llvm.syncvm.revert(i256 %abi)
  unreachable
}
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/return.rs#L86)
is common for Yul and EVMLA representations.

## [INVALID](https://www.evm.codes/#fe?fork=shanghai)

This instruction is a [REVERT](#revert) with an empty data payload.

## LLVM IR

The same as for [REVERT](#revert).

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/return.rs#L115)
is common for Yul and EVMLA representations.

# [SHA3](https://www.evm.codes/#20?fork=shanghai)

## System Contract

This instruction is handled by a System Contract called
[Keccak256](https://github.com/matter-labs/era-system-contracts/blob/main/contracts/precompiles/Keccak256.yul), which is
a wrapper around the EraVM precompile.

On how the System Contract is called, see
[this section](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/system_contracts.md).

## LLVM IR

```llvm
define i256 @__sha3(i8 addrspace(1)* nocapture nofree noundef %0, i256 %1, i1 %throw_at_failure) "noinline-oz" #1 personality i32()* @__personality {
entry:
  %addr_int = ptrtoint i8 addrspace(1)* %0 to i256
  %2 = tail call i256 @llvm.umin.i256(i256 %addr_int, i256 4294967295)
  %3 = tail call i256 @llvm.umin.i256(i256 %1, i256 4294967295)
  %gas_left = tail call i256 @llvm.syncvm.gasleft()
  %4 = tail call i256 @llvm.umin.i256(i256 %gas_left, i256 4294967295)
  %abi_data_input_offset_shifted = shl nuw nsw i256 %2, 64
  %abi_data_input_length_shifted = shl nuw nsw i256 %3, 96
  %abi_data_gas_shifted = shl nuw nsw i256 %4, 192
  %abi_data_offset_and_length = add i256 %abi_data_input_length_shifted, %abi_data_input_offset_shifted
  %abi_data_add_gas = add i256 %abi_data_gas_shifted, %abi_data_offset_and_length
  %abi_data_add_system_call_marker = add i256 %abi_data_add_gas, 904625697166532776746648320380374280103671755200316906558262375061821325312
  %call_external = tail call { i8 addrspace(3)*, i1 } @__staticcall(i256 %abi_data_add_system_call_marker, i256 32784, i256 undef, i256 undef, i256 undef, i256 undef, i256 undef, i256 undef, i256 undef, i256 undef, i256 undef, i256 undef)
  %status_code = extractvalue { i8 addrspace(3)*, i1 } %call_external, 1
  br i1 %status_code, label %success_block, label %failure_block

success_block:
  %abi_data_pointer = extractvalue { i8 addrspace(3)*, i1 } %call_external, 0
  %data_pointer = bitcast i8 addrspace(3)* %abi_data_pointer to i256 addrspace(3)*
  %keccak256_child_data = load i256, i256 addrspace(3)* %data_pointer, align 1
  ret i256 %keccak256_child_data

failure_block:
  br i1 %throw_at_failure, label %throw_block, label %revert_block

revert_block:
  call void @__revert(i256 0, i256 0, i256 0)
  unreachable

throw_block:
  call void @__cxa_throw(i8* noalias nocapture nofree align 32 null, i8* noalias nocapture nofree align 32 undef, i8* noalias nocapture nofree align 32 undef)
  unreachable
}
```

# Stack

## [POP](https://www.evm.codes/#50?fork=shanghai)

In Yul, only used to mark unused values, and is not translated to LLVM IR.

```solidity
pop(staticcall(gas(), address(), 0, 64, 0, 32))
```

For EVMLA, see
[EVM Legacy Assembly Translator](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/evmla_translator.md).

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-solidity/blob/main/src/evmla/assembly/instruction/stack.rs#L108).

## [JUMPDEST](https://www.evm.codes/#5b?fork=shanghai)

Is not available in Yul.

Ignored in EVMLA. See
[EVM Legacy Assembly Translator](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/evmla_translator.md)
for more information.

## [PUSH](https://www.evm.codes/#5f?fork=shanghai) - [PUSH32](https://www.evm.codes/#7f?fork=shanghai)

Is not available in Yul.

For EVMLA, see
[EVM Legacy Assembly Translator](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/evmla_translator.md).

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-solidity/blob/main/src/evmla/assembly/instruction/stack.rs#L10).

## [DUP1](https://www.evm.codes/#80?fork=shanghai) - [DUP16](https://www.evm.codes/#8f?fork=shanghai)

Is not available in Yul.

For EVMLA, see
[EVM Legacy Assembly Translator](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/evmla_translator.md).

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-solidity/blob/main/src/evmla/assembly/instruction/stack.rs#L48).

## [SWAP1](https://www.evm.codes/#90?fork=shanghai) - [SWAP16](https://www.evm.codes/#9f?fork=shanghai)

Is not available in Yul.

For EVMLA, see
[EVM Legacy Assembly Translator](https://github.com/code-423n4/2023-10-zksync/blob/main/docs/VM%20Section/How%20compiler%20works/evmla_translator.md).

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-solidity/blob/main/src/evmla/assembly/instruction/stack.rs#L74).