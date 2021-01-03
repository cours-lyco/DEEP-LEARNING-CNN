import os
import sys
import json
import string
import numpy as np

'''
a1d = np.array([1, 2, 3, 4])

a2d = np.array([
                    [1, 2, 3],
                    [4, 5, 6],
                    [7, 8, 9]
             ])

a3d = np.array([

                [[10, 11, 12], [13, 14, 15], [16, 17, 18]],
                [[20, 21, 22], [23, 24, 25], [26, 27, 28]],
                [[30, 31, 32], [33, 34, 35], [36, 37, 38]]

               ])

a4d = np.array([
                [[[10, 11, 12], [13, 14, 15], [16, 17, 18]],
                [[20, 21, 22], [23, 24, 25], [26, 27, 28]],
                [[30, 31, 32], [33, 34, 35], [36, 37, 38]]]

                [[[10, 11, 12], [13, 14, 15], [16, 17, 18]],
                [[20, 21, 22], [23, 24, 25], [26, 27, 28]],
                [[30, 31, 32], [33, 34, 35], [36, 37, 38]]]

               ]) '''

class Token(object):
    def __init__(self, variable, shape, dtype,  content):
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

    def get_shape(self):
        if len(self.text) > 0:
            char_hook_open, char_hook_close, virgule = '[', ']', ','
            num_char_hook_open = 0
            num_virgule = 0 # number of column
            for char in self.text :
                if char == char_hook_open:
                    num_char_hook_open += 1
                if num_char_hook_open > 0:
                    if char == virgule:
                        num_virgule += 1
                if char == char_hook_close :
                    return num_char_hook_open, num_virgule + 1
        self.error("Cannot get array dim from input")

    def get_variable_info(self):
        numpy_data = None
        list_data = {'1d':[], '2d':[], '3d':[], '4d':[]}

        array_ok = False # to check if we have all array element
        if self.current_char == '=':
            array_patterns = [ 'np.array([', 'np.array([[', 'np.array([[[', 'np.array([[[[' ]
            dtype_patterns , dtype_value = "dtype=", ''

            array_patern_index = 0
            dtype_patern_index = 0

            number_open_hook = 0
            number_close_hook = 0

            dim, num_colomn = self.get_shape()

            self.advance()
            while self.current_char != None:
                char = self.current_char
                if array_patern_index < len(array_patterns[dim - 1]):
                    if char != array_patterns[dim - 1][array_patern_index]:
                        self.error('Character {} is missing in {} while parsing'.format(char, array_patterns[dim - 1] ))
                    if char == '[':
                        number_open_hook += 1
                        num = ''
                    array_patern_index += 1
                elif number_open_hook == dim:

                    if char == '-' or char == '+' or char == '.' or char.isdigit():
                        num += char
                    elif (char == ',' or char == ']') and num != '':
                        try:
                            float_num = float(num)
                            key = number_close_hook + 1
                            list_data[ str(key) + 'd'].append(float_num)
                            num = ''
                        except Exception as ex:
                            print(ex)
                            self.error("Cannot convert {} to float ".format(num))
                    if char == ']':
                        number_close_hook += 1
                        num = ''
                    if char == '[':
                        #number_open_hook += 1
                        num = ''
                    if char == ')':
                        if dim == 1:
                            return np.array(list_data['1d'], dtype=np.float64)
                        if dim == 2:
                            return np.array( [list_data['1d'], list_data['2d']], dtype=np.float64)
                        if dim >= 3:
                            return np.array( [ list_data['1d'], list_data['2d'], list_data['3d']], dtype=np.float64)

                self.advance()
        else:
            self.error("This parsing must start with '=' character")

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
