from flask import Flask, request, render_template
import bikes

app = Flask(__name__)

@app.route('/')
def server_static_index():
    return render_template('index.html')
    
@app.route('/bikes')
def server_static_bike():
    return bikes.get_bike_data("https://feeds.citibikenyc.com/stations/stations.json")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port = 8080, debug=True)
    
#from flask import Flask, request
#import tickets
#
#app = Flask(__name__, static_url_path='')
#
#@app.route('/')
#def server_static_index():
#    return app.send_static_file('index.html')
#    
#@app.route('/map.js')
#def server_static_map():
#    return app.send_static_file('map.js')
#    
#@app.route('/tickets')
#def server_static_ticket():
#    return tickets.get_ticket_data("https://data.buffalony.gov/resource/ux3f-ypyc.json")
#
#if __name__ == '__main__':
#    app.run(host='0.0.0.0', port = 8080, debug=True)

#https://stackoverflow.com/questions/20646822/how-to-serve-static-files-in-flask
#https://www.tutorialspoint.com/flask/flask_static_files.htm?fbclid=IwAR2wMsNMxNLhR7QbFb02DHm4Br4W25xdZFNgXyfUKfYF_t6rQG3jpisvG4E
#from flask import Flask, request, send_from_directory
#import tickets
#
#app = Flask(__name__, static_url_path='')
#
#@app.route('//<path:path>')
#def server_static_index(path):
#    return send_from_directory('index.html',path)
#
#@app.route('/map.js/<path:path>')
#def server_static_map(path):
#    return send_from_directory('map.js',path)
#
#@app.route('/tickets')
#def server_static_ticket():
#    return tickets.get_ticket_data("https://data.buffalony.gov/resource/ux3f-ypyc.json")
#
#
#if __name__ == '__main__':
#    app.run(host='0.0.0.0', port = 8080, debug=True)

