# Explore all possible relationships

# This web application is hosted on Heroku and can be viewed at all-possible-relationships.herokuapp.com.
# The architecture of this app is a Flask app (app.py) that runs on a Waitress server and renders index.html. Index.html in turn loads JavaScript and CSS files. A csv dataset (containing several columns of demographic and health data) is loaded by app.js.
# The D3.js library provides most of the functionality of the app:
# -Parses data from csv
# -Handles mouse click and hover events
# -Appends svg elements to the DOM to create a scalable vector graphic chart
# -Styles the svg chart
# -Updates the chart based on user selection
# -Provides snazzy transition effects between chart updates