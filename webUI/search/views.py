from django.views.generic import TemplateView
from elasticsearch import Elasticsearch
from django.http import HttpResponse
import json

es = Elasticsearch(['192.168.121.128:9200'])


class MainView(TemplateView):
    template_name = 'index.html'


def search_title(request):
    query = request.body.decode()
    documents = es.search(index="hamshahri", doc_type="news",
                          body={
                              "from": 0,
                              "size": 10,
                              "_source": ["TITLE"],
                              "query": {"bool": {"should": [{"match": {"TITLE": query}}, {"match": {"TEXT": query}}]}}}
                          )
    data_object = {
        "total": documents['hits']['total'],
        "body": documents['hits']['hits']
    }
    return HttpResponse(json.dumps(data_object), content_type="application/json")


def get_body(request):
    id = request.body.decode()
    document = es.search(index="hamshahri", doc_type="news",
                         body={
                             "query": {"term": {"_id": id}}}
                         )
    return HttpResponse(json.dumps({"doc": document}), content_type="application/json")


def get_df(request):
    id = request.body.decode()
    df = es.mtermvectors(index="hamshahri", doc_type="news",
                         body={
                             "ids": [id],
                             "parameters": {
                                 "fields": [
                                     "TEXT"
                                 ],
                                 "term_statistics": True}})

    return HttpResponse(json.dumps({"df": df}), content_type="application/json")
