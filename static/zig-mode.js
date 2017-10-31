// Copyright (c) 2012-2017, Matt Godbolt
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright notice,
//       this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

define(function (require) {
    "use strict";
    var monaco = require('monaco');

    function definition() {
        return {
            defaultToken: 'invalid',

            keywords: [
                'const', 'var', 'extern', 'packed', 'export', 'pub', 'noalias', 'inline',
                'comptime', 'nakedcc', 'coldcc', 'stdcallcc', 'volatile', 'align',
                'struct', 'enum', 'union',
                'goto', 'break', 'return', 'continue', 'asm', 'defer', 'unreachable',
                'if', 'else', 'switch', 'and', 'or',
                'while', 'for',
                'null', 'undefined', 'this',
                'fn', 'use', 'test',
                'true', 'false'
            ],

            typeKeywords: [
                'bool', 'f32', 'f64', 'f128', 'void', 'noreturn', 'type', 'error',
                'i2', 'u2', 'i3', 'u3', 'i4', 'u4', 'i5', 'u5', 'i6', 'u6',
                'i7', 'u7', 'i8', 'u8', 'i16', 'u16', 'i32', 'u32', 'i64', 'u64',
                'i128', 'u128', 'isize', 'usize',
                'c_short', 'c_ushort', 'c_int', 'c_uint', 'c_long', 'c_ulong',
                'c_longlong', 'c_ulonglong', 'c_longdouble', 'c_void'
            ],

            operators: [
                '+', '+%', '-', '-%', '/', '*', '*%', '=', '^', '&', '?', '|',
                '!', '>', '<', '%', '<<', '<<%', '>>',

                '+=', '+%=', '-=', '-%=', '/=', '*=', '*%=', '==', '^=', '&=',
                '?=', '|=', '!=', '>=', '<=', '%=', '<<=', '<<%=', '>>=',
            ],

            // we include these common regular expressions
            symbols: /[=><!~?:&|+\-*\/^%]+/,
            escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

            // The main tokenizer for our languages
            tokenizer: {
                root: [
                    // identifiers and keywords
                    [/[a-z_$][\w$]*/, {
                        cases: {
                            '@typeKeywords': 'keyword',
                            '@keywords': 'keyword',
                            '@default': 'identifier'
                        }
                    }],
                    [/[A-Z][\w$]*/, 'type.identifier'],  // to show class names nicely

                    // whitespace
                    {include: '@whitespace'},

                    // delimiters and operators
                    [/[{}()\[\]]/, '@brackets'],
                    [/[<>](?!@symbols)/, '@brackets'],
                    [/@symbols/, {
                        cases: {
                            '@operators': 'operator',
                            '@default': ''
                        }
                    }],

                    // numbers
                    [/\d*\.\d+([eE][\-+]?\d+)?[fFdD]?/, 'number.float'],
                    [/0[xX][0-9a-fA-F_]*[0-9a-fA-F][Ll]?/, 'number.hex'],
                    [/0o[0-7_]*[0-7][Ll]?/, 'number.octal'],
                    [/0[bB][0-1_]*[0-1][Ll]?/, 'number.binary'],
                    [/\d+[lL]?/, 'number'],

                    // delimiter: after number because of .\d floats
                    [/[;,.]/, 'delimiter'],

                    // strings
                    [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
                    [/"/, 'string', '@string'],

                    // characters
                    [/'[^\\']'/, 'string'],
                    [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
                    [/'/, 'string.invalid']
                ],

                whitespace: [
                    [/[ \t\r\n]+/, 'white'],
                    [/\/\*/, 'comment', '@comment'],
                    [/\/\+/, 'comment', '@comment'],
                    [/\/\/.*$/, 'comment'],
                ],

                comment: [
                    [/[^\/*]+/, 'comment'],
                    [/\/\*/, 'comment.invalid'],
                    [/[\/*]/, 'comment']
                ],

                string: [
                    [/[^\\"]+/, 'string'],
                    [/@escapes/, 'string.escape'],
                    [/\\./, 'string.escape.invalid'],
                    [/"/, 'string', '@pop']
                ],
            }
        };
    }

    monaco.languages.register({id: 'zig'});
    monaco.languages.setMonarchTokensProvider('zig', definition());
});
