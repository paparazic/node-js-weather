const path = require('path')
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');
const app = express();

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App ',
        name: 'Main page'
    });
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'Weater App ',
        name: 'About page'
    });
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'This is help page',
        name: 'Help page',
        message: 'This message will help you. If not, please send message to me'
    });
})


app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send('Это не можыт быть')
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        name: '404',
        title: 'This is wrong directory',
        errorMessage: 'This page doesn`t exist in help directory'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        name: '404',
        title: 'This is wrong directory',
        errorMessage: 'This page doesn`t exist'
    });
})



// app.com
// app.com/help
// app.com/about


app.listen(3000, () => {
    console.log('server is up on port 3000')
});