from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.template import loader
from django .views.decorators.csrf import  csrf_exempt
from django.core.files.storage import FileSystemStorage
from django.core.files.storage import default_storage
from django import forms
from .models import FileSerializer
from rest_framework import serializers
from math  import gcd
from PIL import Image
import glob

import sys
import json
import numpy as np
import io
import os
import time

# Create your views here.
from interpreter import Token, Interpreter
from image_preprocessing import PreprocessImage
from images_upload  import  FileResponse
from numpy_data import Numpy_Array
from django.views.decorators.cache import cache_page
from django.views.decorators.csrf import csrf_protect

RESHAPE_ROW, RESHAPE_COL = 276,182
file_order = 0

def index(request):
    numpy_functions = ['dtype', 'shape', 'reshape', 'arange', 'reshape', 'zeros', 'ones']
    return render(request,'draw_numpy/interpreted_numpy.html', {'numpy_functions': numpy_functions})


################################################################################
#     INTERPRETER
################################################################################
def mypostview(request):
    if request.method == 'POST':
        print("**post**")
        data = request.POST['mydata']
        try:
            data_to_list = eval(data)
        except Exception as ex:
            print(ex)
            return HttpResponse("")

        numpy_data = np.array(data_to_list, dtype=np.float64)

        data_to_send_to_front = {
                        'console-data':  numpy_data.tolist() ,
                        'console-data-shape': numpy_data.shape,
                        'console-data-dtype': str(numpy_data.dtype)
                        }

        return HttpResponse(  json.dumps(data_to_send_to_front ))
    return render(request,"null.html")


################################################################################
#     UPLOAD IMAGE
################################################################################
def simple_upload(request):
    if request.method == 'POST':
        #file = serializers.FileField(upload_to='images/')
        paths_list = []
        myfiles = request.FILES.getlist('file')
        filename = "uploaded_file"
        print("..[FILES Submitted to server]: ", myfiles)
        #print(type(myfiles[0]))

        #clean directory before ...:
        files = glob.glob('media/images/*')
        for f in files:
            os.remove(f)
        global file_order;

        for index, file_obj in enumerate(myfiles):
            current_path = 'images/'+filename + str(file_order)+ str(index)
            file_order = file_order + 1
            paths_list.append(current_path)
            with default_storage.open(current_path, 'wb+') as destination:
                for chunk in file_obj.chunks(): #for each row
                    destination.write(chunk)

        #print("------------ paths_list -------------: ", paths_list) #['images/uploaded_file0']

        try: ##### BUILDING CHANNELS

            uploaded_image_url = paths_list[0]
            uploaded_file_extension = os.path.splitext(uploaded_image_url)[1]

            if not uploaded_file_extension or len(uploaded_file_extension) < 3:
                uploaded_file_extension = 'png'

            #print("extension: ", uploaded_file_extension)
            #print(".......", uploaded_image_url)
            normalize_url = uploaded_image_url
            #print("------------>>>>>>>", normalize_url)
            global im_instance
            im_instance = PreprocessImage( "media/" + normalize_url )

            image_shape = im_instance.img_numpy.shape
            image_total_dim = image_shape[0] * image_shape[1] * image_shape[2]

            image_channel_total_dim = image_total_dim // image_shape[-1] #each channel w*h


            pgcd = gcd(im_instance.img_numpy.shape[0], im_instance.img_numpy.shape[1])
            print("....... GCD :      ", pgcd)
            RESHAPE_ROW, RESHAPE_COL = im_instance.img_numpy.shape[0], im_instance.img_numpy.shape[1]

            print("...... img_numpy_shape: .... :", im_instance.img_numpy_shape)
            red_channel = im_instance.img_nump_red_channel.reshape((RESHAPE_ROW, RESHAPE_COL, im_instance.img_numpy.shape[2]))
            # convert numpy array to PIL Image
            im = Image.fromarray(red_channel)
            red_channel_path = "media/images/red_channel."+uploaded_file_extension
            im.save(red_channel_path)

            green_channel = im_instance.img_nump_green_channel#.reshape((RESHAPE_ROW, RESHAPE_COL, im_instance.img_numpy.shape[2]))
            im = Image.fromarray(green_channel)
            green_channel_path = "media/images/green_channel."+uploaded_file_extension
            im.save(green_channel_path)

            blue_channel = im_instance.img_nump_blue_channel#.reshape((RESHAPE_ROW, RESHAPE_COL, im_instance.img_numpy.shape[2]))
            im = Image.fromarray(blue_channel)
            blue_channel_path = "media/images/blue_channel."+uploaded_file_extension
            im.save(blue_channel_path)

            greyscale_image = im_instance.img_as_grey_numpy#.reshape((RESHAPE_ROW, RESHAPE_COL, im_instance.img_numpy.shape[2]))
            im = Image.fromarray(greyscale_image)
            greyscale_image_path = "media/images/greyscale_channel."+uploaded_file_extension
            im.save(greyscale_image_path)

            return  HttpResponse(json.dumps([
                red_channel_path,
                green_channel_path,
                blue_channel_path,
                json.dumps(paths_list) , #todo: loop over liste
                json.dumps( im_instance.img_numpy.tolist()),#.reshape((RESHAPE_ROW, RESHAPE_COL, im_instance.img_numpy.shape[2])).tolist() ),
                greyscale_image_path,
                json.dumps(im_instance.img_as_grey_numpy.tolist())
             ]))
        except Exception as ex:
            print("[ERROR from simple_upload]" , ex)
            return  HttpResponse("");


        #return  HttpResponse(json.dumps(paths_list))
    return HttpResponse("server-error")


################################################################################
#                     CONVOLUTION
################################################################################
def convolution_kernel(request):

        try:
            if request.method != 'POST':
                return  HttpResponse("")
            else:
                filter = []
                for i,j in request.POST.items():
                    filter.append(request.POST.getlist(i))
                filter = [[float(el) for el in filter[i]] for i in range(len(filter)) ]
            print("----------------------FILTER SERVER :----------  ", filter)

            weight  = 1
            image_array = im_instance.img_as_grey_numpy
            i = image_array

            print("img len: ",im_instance.img_as_grey_numpy.shape )
            stride = 1
            global i_transformed
            i_transformed = np.zeros(( 1+(i.shape[0] - len(filter))//stride, 1+(i.shape[1] - len(filter))//stride ), dtype=np.float64)
            print("i_transformed: ", i_transformed.shape)
            for x in range(1, i.shape[0] - 1):
                for y in range(1, i.shape[1] - 1):
                    output_pixel = 0.0
                    output_pixel = output_pixel + (i[x - 1, y-1] * filter[0][0])
                    output_pixel = output_pixel + (i[x, y-1] * filter[0][1])
                    output_pixel = output_pixel + (i[x + 1, y-1] * filter[0][2])

                    output_pixel = output_pixel + (i[x-1, y] * filter[1][0])
                    output_pixel = output_pixel + (i[x, y] * filter[1][1])
                    output_pixel = output_pixel + (i[x+1, y] * filter[1][2])

                    output_pixel = output_pixel + (i[x-1, y+1] * filter[2][0])
                    output_pixel = output_pixel + (i[x, y+1] * filter[2][1])
                    if x < i.shape[0] -1  and y < i.shape[1] - 1:
                        output_pixel = output_pixel + (i[x+1, y+1] * filter[2][2])
                    output_pixel = output_pixel * weight
                    if(output_pixel<0):
                        output_pixel=0
                    if(output_pixel>255):
                        output_pixel=255
                    if x < i_transformed.shape[0] - 1 and y < i_transformed.shape[1] - 1:
                        i_transformed[x, y] = output_pixel
            im = Image.fromarray(i_transformed.astype(np.uint8))
            #f_ext = (im_instance.img.format).lower()

            kernel_conv_img_path = "media/images/kernel_image"
            if os.path.isfile(kernel_conv_img_path):
                os.remove(kernel_conv_img_path)
            im.save(kernel_conv_img_path, "png")

            return  HttpResponse(json.dumps([
                kernel_conv_img_path,
                json.dumps( i_transformed.tolist() )
             ]))
        except Exception as ex:
            print("[ERROR from convolution_kernel]" , ex)
            return  HttpResponse("");


######################################################################################
#      MAX POOLING
######################################################################################
def  max_pool_image(request):
    try:
        size_x, size_y = i_transformed.shape[0], i_transformed.shape[1]
        new_x = int(size_x/2)
        new_y = int(size_y/2)
        global newImage
        newImage = np.zeros((new_x, new_y))
        for x in range(0, size_x, 2):
            for y in range(0, size_y, 2):
                pixels = []
                pixels.append(i_transformed[x, y])
                pixels.append(i_transformed[x+1, y])
                pixels.append(i_transformed[x, y+1])
                pixels.append(i_transformed[x+1, y+1])
                pixels.sort(reverse=True)
                newImage[int(x/2),int(y/2)] = pixels[0]

        im = Image.fromarray(newImage.astype(np.uint8))
        poll_max_img_path = "media/images/pool_max_image"
        im.save(poll_max_img_path, "png")

        return  HttpResponse(json.dumps([
            poll_max_img_path,
            json.dumps( newImage.tolist() )
         ]))

    except Exception as ex:
        print(ex)
        return HttpResponse("")



######################################################################################
#     FULLY CONNECTED
######################################################################################

def  fully_connected(request):
    try:
        if request.method == 'POST':

             num_row = request.POST['fully_row'] #num_row corresponding to 1 pixel, because we cannot see 1-pixel row
             num_row = int(num_row)
             print(".................... FULLY_CONNECTED .............{}".format(num_row))
             max_pool_image_array = newImage.astype(np.uint8)
             max_pool_image_array_fully_conn = max_pool_image_array.reshape(num_row,-1)

             max_pool_image_array_fully_conn_for_front = max_pool_image_array.flatten()

             im = Image.fromarray(max_pool_image_array_fully_conn)
             fully_conn_img_path = "media/images/fully_conn_image"
             im.save(fully_conn_img_path, "png")

             print(max_pool_image_array_fully_conn_for_front.tolist())
             return  HttpResponse(json.dumps([
                fully_conn_img_path,
                #json.dumps( max_pool_image_array_fully_conn.tolist() )
                json.dumps(  max_pool_image_array_fully_conn_for_front.tolist() )
            ]))
        return HttpResponse("")
    except Exception as ex:
        print(ex)
        return HttpResponse("")

######################################################################################
#    TRAIN CNN
######################################################################################

def  train_cnn(request):
    try:
        size_x, size_y = i_transformed.shape[0], i_transformed.shape[1]
        new_x = int(size_x/2)
        new_y = int(size_y/2)
        newImage = np.zeros((new_x, new_y))
        for x in range(0, size_x, 2):
            for y in range(0, size_y, 2):
                pixels = []
                pixels.append(i_transformed[x, y])
                pixels.append(i_transformed[x+1, y])
                pixels.append(i_transformed[x, y+1])
                pixels.append(i_transformed[x+1, y+1])
                pixels.sort(reverse=True)
                newImage[int(x/2),int(y/2)] = pixels[0]

        im = Image.fromarray(newImage.astype(np.uint8))
        poll_max_img_path = "media/images/pool_max_image"
        im.save(poll_max_img_path, "png")

        return  HttpResponse(json.dumps([
            poll_max_img_path,
            json.dumps( newImage.tolist() )
         ]))

    except Exception as ex:
        print(ex)
        return HttpResponse("")


######################################################################################
#    PREDICT CNN
######################################################################################

def  predict_cnn(request):
    try:
        size_x, size_y = i_transformed.shape[0], i_transformed.shape[1]
        new_x = int(size_x/2)
        new_y = int(size_y/2)
        newImage = np.zeros((new_x, new_y))
        for x in range(0, size_x, 2):
            for y in range(0, size_y, 2):
                pixels = []
                pixels.append(i_transformed[x, y])
                pixels.append(i_transformed[x+1, y])
                pixels.append(i_transformed[x, y+1])
                pixels.append(i_transformed[x+1, y+1])
                pixels.sort(reverse=True)
                newImage[int(x/2),int(y/2)] = pixels[0]

        im = Image.fromarray(newImage.astype(np.uint8))
        poll_max_img_path = "media/images/pool_max_image"
        im.save(poll_max_img_path, "png")

        return  HttpResponse(json.dumps([
            poll_max_img_path,
            json.dumps( newImage.tolist() )
         ]))

    except Exception as ex:
        print(ex)
        return HttpResponse("")
