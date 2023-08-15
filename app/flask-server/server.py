from flask import Flask


app = Flask(__name__)


@app.route('/members')
def members():
    return {'Members':["1","2","3","4","5"]}

if __name__ == '__main__':
    app.run(debug=True)