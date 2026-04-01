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

so we are given an `ELF 64-bit LSB pie executable` file named `ascii`

when run on a linux machine it asks for user input
```bash
# filename: ascii
u1907@debian:~/crackme$ ./ascii
Usage: ./script <flag>
```

so the author expects us to find the flag itself. well then, lets start up ghidra
after analyzing the `ascii` file with ghidra, we get to see what is called approximate source code
we can see that there are 3 functions including `main`

![func-info](https://raw.githubusercontent.com/U1907/U1907-site-images/refs/heads/main/ascii/functions-ascii.png)

## Main Function Analysis

Lets analyze main function
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
well, yeah thats better than pasting image here.

Anyways, the `param_1` & `param_2` are our classic `argc` and `argv`
the main code begins off by checking if user provided an input or not with initial `if-then` condition, else the program will prompt user for `flag`.

On the line 27, the `user_input` is being copied into variable `local_88`, after that the program enters into a while true loop with `i` as counter it seems. 

On the line 37, program is checking if the loop iterated entirely over the user_input, if yes it breaks the loop there itself. if not, it does the math `6 - i` and stores in variable `iVar2`. program flow seems pretty normal till now.

Line 40 is where the real stuff begins. `string::operator[]` extracts byte by byte at each iteration and passes it as argument to `encode` function along with `iVar2`. output is stored in `cVar1`

### Encode Function

here is the decompiled encode function
```cpp
# filename: decompiled-encode ascii
char encode(char param_1,int param_2)

{
  return (char)param_2 + param_1;
}

```
ahh that's a pretty normal looking encode function. it just shifts characters forward by `6 - i`. 

lets go back to main function. The variable `cVar1` is copied to `local_48` which in turn is passed to verify function
### Verify Function

here is the decompiled verify function
```cpp
# filename: decompiled-verify ascii
bool verify(string *param_1)

{
  bool bVar1;
  
  bVar1 = std::operator==(param_1,(string *)encoded_flag[abi:cxx11]);
  return bVar1;
}
```

ahh, what do we have here, encoded_flag perhaps? well if we can grab that encoded flag, we can simply decode it to get the real flag.

normally i have expected a plain text when i clicked on variable in ghidra. but i found nothing. 
![encode-var](https://raw.githubusercontent.com/U1907/U1907-site-images/refs/heads/main/ascii/encode.png)

## Finding the Encoded Flag

This has to do with language it is written in, which is `C++` in this case. you see, in languages like `C`, a string is basically a bunch of characters, which are in fact basically some numbers in memory. whenever there is a string in C program, compiler takes string and hardcodes it into `.rodata` section of the file. but in C++, thats not the case. The encoded flag is a data object called `std::string`, it doesnt hold the text, rather it points to memory, length variable and capacity variable. To build such objects, C++ has the concept of `constructors` which allocates the space at run time for string and some other properties. but to build it, constructors still need raw data. Thats where our encoded flag is perhaps. This raw data is cross-referenced during run time. ghidra shows what cross references happen with the object initialization. we can see a bunch of `static_initialization_and_destruction` in the image above, those are the cross references of raw ingredients. 

by clicking on the reference, i was greeted with this pleasant initialization code
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

yeah, now we can be sure that we got the encoded flag `IYJ~U4cQ1Q[<mL[(U;`\'Ynk/M-i`
now we are sure how encoding happens, a simple decoding function can be written in python as follows
```python
# filename: decode.py
enc_flag="IYJ~U4cQ1Q[<mL[(U;`\'Ynk/M-i"
denc_flag=""

for i in range(len(enc_flag)):
    denc_flag+=chr(ord(enc_flag[i]) - (6 - i))

print(denc_flag)
```
voila! it simply works!
