from django.urls import path
from django.conf.urls import url
from . import views

urlpatterns = [
    path(r'', views.index, name='index'),
    url(r'^mypostview$', views.mypostview, name='mypostview'),
    url(r'^upload-cnn-files$', views.simple_upload, name='simple_upload'),
    url(r'^cnn-convolution-kernel$', views.convolution_kernel, name='convolution_kernel'),
    #url(r'^upload-cnn-files-channels$', views.build_channels, name='build_channels'),
]
