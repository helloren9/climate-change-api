const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'washingtonpost',
        address: 'https://www.washingtonpost.com/climate-environment/?itid=nb_climate-and-environment'
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis'
    },
    {
        name: 'latimes',
        address: 'https://www.latimes.com/environment'
    }
    
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("climate")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')

            articles.push({
                title,
                url,
                source: newspaper.name
            })
        })

    })
})

app.get('/', (req,res) => {
    res.json('Welcome to my Climate Change API')
})

app.get('/news', (req,res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', async (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))