---
id: ascii-crack
title: ASCII-CRACK
category: crackmes.one
date: April 1, 2026
tags: Reverse Engineering, Writeup
---

## Overview

This is a writeup on a challenge [ASCII-CRACK](https://crackmes.one/crackme/69a806c17b3cc38c80464e06) from [crackmes.one](https://crackmes.one)

![info](https://raw.githubusercontent.com/U1907/U1907-site-images/refs/heads/main/ascii/ascii-crack-info.png)

So we are given an `ELF 64-bit LSB pie executable` file named `ascii`.

When run on a Linux machine, it asks for user input:
```bash
# filename: ascii
u1907@debian:~/crackme$ ./ascii
Usage: ./script <flag>
```

So the author expects us to find the flag itself. Well then, let's start up Ghidra.
After analyzing the `ascii` file with Ghidra, we get to see what is called decompiled source code.
We can see that there are 3 functions including `main`.

![func-info](https://raw.githubusercontent.com/U1907/U1907-site-images/refs/heads/main/ascii/functions-ascii.png)

## Main Function Analysis

Let's analyze the main function:
```cpp
#filename: decomplied-main ascii

undefined8 main(int param_1,long user_input)

{
  char cVar1;
  int iVar2;
  ostream *poVar3;
  char *pcVar4;
  ulong uVar5;
  undefined8 uVar6;
  ulong uVar7;
  long in_FS_OFFSET;
  allocator local_9e;
  char check;
  int i;
  allocator *local_98;
  allocator *local_90;
  string local_88 [32];
  string local_68 [32];
  string local_48 [40];
  long local_20;
  
  local_20 = *(long *)(in_FS_OFFSET + 0x28);
  if (param_1 == 2) {
    local_98 = &local_9e;

    std::__cxx11::string::string<>(local_88,*(char **)(user_input + 8),&local_9e);
    std::__new_allocator<char>::~__new_allocator((__new_allocator<char> *)&local_9e);
    local_90 = &local_9e;
                    /* try { // try from 001023c3 to 001023c7 has its CatchHandler @ 0010254d */
    std::__cxx11::string::string<>(local_68,"",&local_9e);
    std::__new_allocator<char>::~__new_allocator((__new_allocator<char> *)&local_9e);
    i = 0;
    while( true ) {
      uVar7 = (ulong)i;
      uVar5 = std::__cxx11::string::length();
      if (uVar5 <= uVar7) break;
      iVar2 = 6 - i;
                    /* try { // try from 00102404 to 001024e3 has its CatchHandler @ 00102562 */
      pcVar4 = (char *)std::__cxx11::string::operator[]((ulong)local_88);
      cVar1 = encode(*pcVar4,iVar2);
                    /* adding byte by byte to local_68 from cVar1 */
      std::__cxx11::string::operator+=(local_68,cVar1);
      i = i + 1;
    }
                    /* this method stores value to a var from another var */
    std::__cxx11::string::string(local_48,local_68);
    check = verify(local_48);
    std::__cxx11::string::~string(local_48);
    if (check == '\x01') {
      poVar3 = std::operator<<((ostream *)std::cout,"You cracked me!");
      std::ostream::operator<<(poVar3,std::endl<>);
    }
    else {
      poVar3 = std::operator<<((ostream *)std::cout,"Try again! You can do it!");
      std::ostream::operator<<(poVar3,std::endl<>);
    }
    uVar6 = 0;
    std::__cxx11::string::~string(local_68);
    std::__cxx11::string::~string(local_88);
  }
  else {
    poVar3 = std::operator<<((ostream *)std::cout,"Usage: ./script <flag>");
    std::ostream::operator<<(poVar3,std::endl<>);
    uVar6 = 1;
  }
  if (local_20 != *(long *)(in_FS_OFFSET + 0x28)) {
                    /* WARNING: Subroutine does not return */
    __stack_chk_fail();
  }
  return uVar6;
}

```
Well, that's better than pasting an image here.

Anyway, `param_1` and `param_2` are our classic `argc` and `argv`.
The main code begins by checking if the user provided an input with the initial `if-then` condition; otherwise, the program prompts the user for the `flag`.

On line 27, the `user_input` is being copied into variable `local_88`. After that, the program enters a while loop with `i` as the counter.

On line 37, the program checks if the loop has iterated entirely over the `user_input`. If yes, it breaks the loop. If not, it calculates `6 - i` and stores it in variable `iVar2`. The program flow seems straightforward up to this point.

Line 40 is where the real work begins. `string::operator[]` extracts one byte at each iteration and passes it to the `encode` function along with `iVar2`. The output is stored in `cVar1`.

### Encode Function

here is the decompiled encode function
```cpp
# filename: decompiled-encode ascii
char encode(char param_1,int param_2)

{
  return (char)param_2 + param_1;
}

```
Ah, that's a pretty normal-looking encode function. It simply shifts characters forward by `6 - i`.

Let's go back to the main function. The variable `cVar1` is copied to `local_48`, which is then passed to the verify function.
### Verify Function

Here is the decompiled verify function:
```cpp
# filename: decompiled-verify ascii
bool verify(string *param_1)

{
  bool bVar1;
  
  bVar1 = std::operator==(param_1,(string *)encoded_flag[abi:cxx11]);
  return bVar1;
}
```

Ah, what do we have here? The `encoded_flag`, perhaps? Well, if we can grab that encoded flag, we could simply decode it to get the real flag.

Normally, I would have expected to see plain text when clicking on the variable in Ghidra, but I found nothing. 
![encode-var](https://raw.githubusercontent.com/U1907/U1907-site-images/refs/heads/main/ascii/encode.png)

## Finding the Encoded Flag

This has to do with the language it is written in: `C++`. You see, in languages like `C`, a string is basically a sequence of characters, which are essentially numbers in memory. Whenever there is a string in a C program, the compiler takes the string and hardcodes it into the `.rodata` section of the file. But in C++, that's not the case. The encoded flag is a data object called `std::string`, which doesn't hold the text directly. Rather, it points to memory, a length variable, and a capacity variable. To build such objects, C++ has the concept of `constructors`, which allocates space at runtime for the string and other properties. But to build it, the constructors still need raw data. That's where our encoded flag is. This raw data is cross-referenced at runtime. Ghidra shows what cross-references occur during object initialization. We can see a bunch of `static_initialization_and_destruction` functions in the image above; those are the cross-references for the raw data. 

By clicking on the reference, I was greeted with this pleasant initialization code:
```cpp
# filename: static_initialization_and_destruction
void __static_initialization_and_destruction_0(void)

{
  long in_FS_OFFSET;
  allocator local_29;
  allocator *local_28;
  long local_20;
  
  local_20 = *(long *)(in_FS_OFFSET + 0x28);
  local_28 = &local_29;
                    /* try { // try from 001025e4 to 001025e8 has its CatchHandler @ 0010262b */
  std::__cxx11::string::string<>
            ((string *)encoded_flag[abi:cxx11],"IYJ~U4cQ1Q[<mL[(U;`\'Ynk/M-i",&local_29);
  std::__new_allocator<char>::~__new_allocator((__new_allocator<char> *)&local_29);
  __cxa_atexit(std::__cxx11::string::~string,encoded_flag[abi:cxx11],&__dso_handle);
  if (local_20 != *(long *)(in_FS_OFFSET + 0x28)) {
                    /* WARNING: Subroutine does not return */
    __stack_chk_fail();
  }
  return;
}
```
## Decoding Script

Now we can be sure we have the encoded flag: `IYJ~U4cQ1Q[<mL[(U;`\'Ynk/M-i`.
Now that we understand how the encoding works, we can write a simple decoding function in Python:
```python
# filename: decode.py
enc_flag="IYJ~U4cQ1Q[<mL[(U;`\'Ynk/M-i"
denc_flag=""

for i in range(len(enc_flag)):
    denc_flag+=chr(ord(enc_flag[i]) - (6 - i))

print(denc_flag)
```
Voilà! It works!
