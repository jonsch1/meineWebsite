import sys
from flask import Flask, render_template
from flask_frozen import Freezer
app = Flask(__name__)
freezer = Freezer(app)

@app.route('/')
def index():
    return render_template("index.html")


@app.route('/Studium/')
def studium():
    return render_template("Studium.html")


@app.route('/Threats_and_Defense_Mechanisms/')
def test():
    return render_template("Threats_and_Defense_Mechanisms.html")


@app.route('/spaceshuttle/')
def spaceship():
    return render_template("spaceshuttle.html")



if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == "build":
        freezer.freeze()
    else:
        app.run(port=8000)