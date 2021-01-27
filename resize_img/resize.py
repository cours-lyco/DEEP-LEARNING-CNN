from PIL import Image
import glob
import os
import sys

# new folder path (may need to alter for Windows OS)
# change path to your path
#path = 'yourpath/Resized_Shapes' #the path where to save resized images
path = os.path.abspath("/Users/whodunit/Desktop/cnn_img")
path_new_img = os.path.abspath("/Users/whodunit/Desktop/resized_images/")

NEW_IMAGE_SIZE_WIDTH = 70
NEW_IMAGE_SIZE_HEIGHT = 80

def  resize(new_size_width=NEW_IMAGE_SIZE_WIDTH, new_size_height=NEW_IMAGE_SIZE_HEIGHT):
    # create new folder
    if not os.path.exists(path):
        os.makedirs(path)

    # loop over existing images and resize
    # change path to your path
    ext_list = ['gif','jpg','jpeg','png'];
    for filename in glob.glob(path + '/*.*'): #path of raw images
        if filename.rsplit('.',1)[1] in ext_list :
            #img = Image.open(filename).resize((new_size_width, new_size_height))
            img = Image.open(filename)
            img.thumbnail((new_size_width, new_size_height))
            # save resized images to new folder with existing filename
            img.save('{}{}'.format(path_new_img, os.path.split(filename)[1]))
            print(" --> resize:    {} .......... OK".format(filename))




if __name__ == '__main__':
    print(path)
    if len(sys.argv) == 2:
        try:
            new_size = int(sys.argv[1])
            resize(new_size, new_size)
            print("image resize to : ({}x{})".format(new_size, new_size))
        except Exception as ex:
            print(ex)
    elif len(sys.argv) == 3:
        try:
            new_size_w = int(sys.argv[1])
            new_size_h = int(sys.argv[2])
            resize(new_size_w, new_size_h)
            print("image resize to : ({}x{})".format(new_size_w, new_size_h))
        except Exception as ex:
            print(ex)
    else:
        resize()
