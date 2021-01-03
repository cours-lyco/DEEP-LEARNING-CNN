import os
import sys
import json
import string
import numpy as np

class Token(object):
    def __init__(self, variable, shape, dtype, content):
        self.variable = variable
        self.shape = shape
        self.dtype = dtype
        self.content = content

    def __str__(self):
        return 'Array({content})'.format(content=json.stringify(content))

    def __repr__(self):
        return self.__str__()

class Interpreter(object):
    def __init__(self, text):
        text = text.strip().replace(" ", "")
        self.text = text.translate({ord(c): None for c in string.whitespace})
        self.pos = 0
        self.current_token = None
        if len(self.text) > 0:
            self.current_char = self.text[self.pos]
        else:
            self.error()

    def error(self, error_string="Error while parsing input"):
        raise Exception("[ERROR]: " + error_string)
        return "[ERROR]: " + error_string

    def advance(self):
        self.pos += 1
        if self.pos >= len(self.text):
            self.current_char = None
        else:
            self.current_char = self.text[self.pos]

    def get_varibale_name(self):
        name = ""
        i = 0
        while self.current_char is not None:
            name += self.current_char
            self.advance()
            if self.current_char == '=':
                return name
        self.error("Wrong variable_name")

    def get_variable_info(self):
        numpy_data = None
        list_data = []
        dtype = ''

        array_ok = False # to check if we have all array element
        if self.current_char == '=':
            array_pattern ='np.array(['
            dtype_pattern = 'dtype='
            j = 0
            k = 0
            self.advance()
            while self.current_char is not None:
                if j < len(array_pattern):
                    if self.current_char != array_pattern[j]:
                        self.error("np.array character '{}' not found".format(array_pattern[j]))
                    j += 1
                else :
                    if self.current_char.isdigit() and not array_ok:
                        list_data.append(int(self.current_char))
                    elif self.current_char != ']' and self.current_char != ',' and self.current_char != ')':
                        array_ok = True
                        if k < len(dtype_pattern):
                            if self.current_char != dtype_pattern[k]:
                                self.error("dtype character '{}' not found".format(dtype_pattern[k]))
                            dtype += self.current_char
                            k += 1
                    elif self.current_char == ')':
                        if dtype == 'np.int32':
                            numpy_data= np.array(list_data, dtype=np.int32)
                        elif dtype == 'np.float32':
                            numpy_data = np.array(list_data, dtype=np.float32)
                        elif dtype == 'np.int64':
                            numpy_data = np.array(list_data, dtype=np.int64)
                        else:
                            numpy_data = np.array(list_data, dtype=np.float64)
                    
                self.advance()
            return numpy_data, list_data
        self.error("No Equal in expression")


    def get_next_token(self):
        if self.pos >= len(self.text):
            return Token(EOF, None)
        current_char = self.text[self.pos]
        if current_char.isdigit():
            self.pos += 1
            return Token(INTEGER, int(current_char))
        if current_char == '=':
            self.pos += 1
            return Token(PLUS, current_char)
        self.error()

    def eat(self, token_type):
        if self.current_token.type == token_type:
            self.current_token = self.get_next_token()
        else:
            self.error()

    def expr(self):
        self.current_token = self.get_next_token()
        left = self.current_token
        self.eat(INTEGER)

        op=self.current_token
        self.eat(PLUS)

        right=self.current_token
        self.eat(INTEGER)

        result = left.value + right.value
        return result
