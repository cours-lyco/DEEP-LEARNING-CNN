from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.template import loader
from django .views.decorators.csrf import  csrf_exempt
from django.core.files.storage import FileSystemStorage
from django.core.files.storage import default_storage
from django import forms
from .models import FileSerializer
from rest_framework import serializers
from PIL import Image
import glob

import sys
import json
import numpy as np
import io
import os

# Create your views here.
from interpreter import Token, Interpreter
from image_preprocessing import PreprocessImage
from images_upload  import  FileResponse
from numpy_data import Numpy_Array
from django.views.decorators.cache import cache_page
from django.views.decorators.csrf import csrf_protect

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
        print(type(myfiles[0]))

        #clean directory before ...:
        files = glob.glob('media/images/*')
        for f in files:
            os.remove(f)

        for index, file_obj in enumerate(myfiles):
            current_path = 'images/'+filename + str(index)
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
            im_instance = PreprocessImage( "media/" + normalize_url )

            #print("...... img_numpy_shape: .... :", im_instance.img_numpy_shape)
            red_channel = im_instance.img_nump_red_channel
            # convert numpy array to PIL Image
            im = Image.fromarray(red_channel)
            red_channel_path = "media/images/red_channel."+uploaded_file_extension
            im.save(red_channel_path)

            green_channel = im_instance.img_nump_green_channel
            im = Image.fromarray(green_channel)
            green_channel_path = "media/images/green_channel."+uploaded_file_extension
            im.save(green_channel_path)

            blue_channel = im_instance.img_nump_blue_channel
            im = Image.fromarray(blue_channel)
            blue_channel_path = "media/images/blue_channel."+uploaded_file_extension
            im.save(blue_channel_path)

            return  HttpResponse(json.dumps([
                red_channel_path,
                green_channel_path,
                blue_channel_path,
                json.dumps(paths_list) , #todo: loop over liste
                json.dumps( im_instance.img_numpy.tolist() )
             ]))
        except Exception as ex:
            print("[ERROR from build_channel]" , ex)
            return  HttpResponse("");


        #return  HttpResponse(json.dumps(paths_list))
    return HttpResponse("server-error")


################################################################################
#
################################################################################
def  build_channels(request):
    if request.method == 'POST':
        try:
            uploaded_image_url = request.POST['mydata']
            uploaded_file_extension = os.path.splitext(uploaded_image_url)[1]

            if not uploaded_file_extension or len(uploaded_file_extension) < 3:
                uploaded_file_extension = 'png'

            #print("extension: ", uploaded_file_extension)
            #print(".......", uploaded_image_url)
            normalize_url = "".join(uploaded_image_url[1:])
            #print("------------>>>>>>>", normalize_url)
            im_instance = PreprocessImage( normalize_url )

            red_channel = im_instance.img_nump_red_channel
            # convert numpy array to PIL Image
            im = Image.fromarray(red_channel)
            red_channel_path = "media/images/red_channel."+uploaded_file_extension
            im.save(red_channel_path)

            green_channel = im_instance.img_nump_green_channel
            im = Image.fromarray(green_channel)
            green_channel_path = "media/images/green_channel."+uploaded_file_extension
            im.save(green_channel_path)

            blue_channel = im_instance.img_nump_blue_channel
            im = Image.fromarray(blue_channel)
            blue_channel_path = "media/images/blue_channel."+uploaded_file_extension
            im.save(blue_channel_path)

            return  HttpResponse(json.dumps([
                red_channel_path,
                green_channel_path,
                blue_channel_path,
                json.dumps( im_instance.img_numpy.tolist() )
             ]))
        except Exception as ex:
            print("[ERROR from build_channel]" , ex)
            return  HttpResponse("");
