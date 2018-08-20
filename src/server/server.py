# server.py
from flask import Flask, render_template, request, redirect, url_for, make_response
from flask_redis import FlaskRedis
import hashlib
import json
import requests
import time

app = Flask(__name__, static_folder="../static/dist", template_folder="../static")
redis_store = FlaskRedis(app, strict=False)

@app.route("/")
def index():
    token = request.cookies.get("token")
    if token is not None:
        access_token = redis_store.get(token)
        if access_token is not None:
            r = requests.get("https://api.github.com?access_token=" + access_token.decode("utf-8"))
            if r.json().get("message") == "Bad credentials":
                redis_store.delete(token)
                response = make_response(redirect("/login"))
                response.set_cookie("token", "", expires=0)
                return response
            return render_template("home/index.html", access_token=access_token.decode("utf-8"))
    return redirect("/login")

@app.route("/login")
def login():
    code = request.args.get("code")
    if code is None:
        return render_template("login/index.html")
    else:
        r = requests.post("https://github.com/login/oauth/access_token",
                          data={
                              "client_id": "2b4ff89d2dd91e089b98",
                              "client_secret": "CLIENT_SECRET_GOES_HERE",
                              "code": code
                          },
                          headers={
                              "Accept": "application/json"
                          })
        access_token = r.json()["access_token"]
        r = requests.get("https://api.github.com/user?access_token=" + access_token)
        username = r.json()["login"]
        current_time = time.time()
        hashed_token  = hashlib.sha256((username + str(current_time)).encode("utf-8"))
        redis_store.set(str(hashed_token), access_token)
        response = make_response(redirect("/"))
        response.set_cookie("token", str(hashed_token))
        return response

if __name__ == "__main__":
    app.run()
