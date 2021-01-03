import pygame
import numpy as np

class Numpy_Array(object):
    def __init__(self, numpyarray):
        self.shape = numpyarray.shape
        self.width = 450
        self.height = 450
        self.title = 'maths-physic-code'

    def draw_shape(self):
        pygame.init()
        win = pygame.display.set_mode((self.width, self.height))
        pygame.display.set_caption(self.title)

        done = True
        while done:
            for event in pygame.event.get():
                if event == pygame.QUIT:
                    done = False
            print("ok", end=" ")
