
import numpy as np
from PIL import Image
import os
import numpy as np
import cv2
import matplotlib.pyplot as plt

class PreprocessImage(object):
    def __init__(self, imageFile):
        self.img =  Image.open(imageFile)
        self.img_width, self.img_height = self.img.size
        self.img_as_grey = Image.open(imageFile).convert('L')
        self.img_as_grey_numpy = np.asarray(self.img_as_grey)

        self.format = (self.img).format #format PNG
        self.size =  (self.img).size # size (302, 300)
        self.mode = (self.img).mode #mode RGBA
        self.img_numpy = np.asarray(self.img)# - convert image format to numpy array

        self.img_nump_red_channel = self.build_red_channel()
        self.img_nump_green_channel = self.build_green_channel()
        self.img_nump_blue_channel = self.build_blue_channel()

        self.img_numpy_type = type(self.img_numpy) #simply check , this can display: <class 'numpy.ndarray'>
        self.img_numpy_shape = self.img_numpy.shape #(300, 302, 4)


    def display_image(self):
        self.img.show()
        #plt.imshow(self.img_numpy)

    # - convert numpy array to image format
    def from_numpy_to_img(self, data_array):
        img_fromnparray = Image.fromarray(data_array)
        img_fromnparray.show()

    def display_channel(self, index=0):
        if len(self.img_numpy_shape) == 3 and self.img_numpy_shape[2] >= 3:
            if index == 0:
                plt.imshow(self.img_nump_red_channel)
            if index == 1:
                plt.imshow(self.img_nump_green_channel)
            if index == 2:
                plt.imshow(self.img_nump_blue_channel)
            plt.show()

    def build_red_channel(self):
        img_copy = self.img_numpy.copy()
        img_copy[:,:,1]=0
        img_copy[:,:,2]=0
        return img_copy;

    def build_green_channel(self):
        img_copy = self.img_numpy.copy()
        img_copy[:,:,0]=0
        img_copy[:,:,2]=0
        return img_copy;

    def build_blue_channel(self):
        img_copy = self.img_numpy.copy()
        img_copy[:,:,0]=0
        img_copy[:,:,1]=0
        return img_copy;

    def save_img(self, grey=None):
        if not grey:
            mg_png = Image.fromarray(self.img_numpy).save(os.path.abspath("../../media/images/uploaded_file0.png"))
        else:
            img_png = Image.fromarray(self.img_as_grey).save(os.path.abspath("../../media/images/uploaded_file0_grey.png"))


if __name__ == '__main__':
    #img = PreprocessImage( os.path.abspath("../../media/images/uploaded_file0"))
    img_couleur = PreprocessImage( os.path.abspath("../../media/images/uploaded_file0"))
    print("------ starting ------")
    #img_couleur.display_image()
    print(img_couleur.img_numpy_shape)
    img_couleur.display_channel(2)
    #img_couleur.display_green_channel()
    #img_couleur.display_blue_channel()
