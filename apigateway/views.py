import json

import requests
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView


class gateway(APIView):
    authentication_classes = ()
    headers = {}
    base_url = "http://10.0.1.219"
    def operation(self, request, method_type='get'):
        path = request.path_info.split('/')
        print(request.headers)
        if len(path) < 2:
            return Response('bad request', status=status.HTTP_400_BAD_REQUEST)
        print("shubham", path[0], path[1], path[2])
        self.headers['authorization'] = request.META.get('HTTP_AUTHORIZATION')
        self.headers['Content-Type'] = request.headers.get('Content-Type')
        print("shubham", self.headers)
        if request.headers.get('Content-Type') == 'text/plain':
            self.headers['Content-Type'] = 'text/html'
        if path[1] == 'cms':
            url = self.base_url +":8002"
            url = self.generate_url(url, path)
        elif path[1] == 'api':
            url = self.base_url +":8004"
            url = self.generate_url(url, path)
        elif path[1] == 'foundation':
            url = self.base_url +":8003"
            url = self.generate_url(url, path)
        elif path[1] == 'suraksha':
            url = self.base_url +":8005"
            url = self.generate_url(url, path)
        print("hhhh", url)
        if method_type == 'get':
            print("dixit", url)
            response = requests.get(url=url, headers=self.headers, params=request.query_params.dict())
        elif method_type == 'post':
            response = requests.post(url=url, headers=self.headers, data=json.dumps(request.data))
        data = response.text
        print(response.headers.get('Content-Type').split(";")[0])
        if response.headers.get('Content-Type').split(";")[0] == 'text/html':
            print("nitin")
            return HttpResponse(data, content_type="text/html")
        elif response.headers.get('Content-Type').split(";")[0] == 'application/json':
            return Response(data=json.loads(data), status=response.status_code)

    def get(self, request):
        return self.operation(request, 'get')

    def post(self, request):
        return self.operation(request, 'post')

    def put(self, request):
        return self.operation(request, 'put')

    def patch(self, request):
        return self.operation(request, 'patch')

    def delete(self, request):
        return self.operation(request, 'delete')

    def generate_url(self, url, path):
        for p in range(2, len(path)):
            print(path[p])
            url = url + '/' + path[p]
        print(url)
        return url
